#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { deflateSync } from 'zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const iconsDir = join(__dirname, '..', 'public', 'icons')

function createPNG(size: number): Buffer {
  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ])

  const width = size
  const height = size
  const bitDepth = 8
  const colorType = 6
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData.writeUInt8(bitDepth, 8)
  ihdrData.writeUInt8(colorType, 9)
  ihdrData.writeUInt8(0, 10)
  ihdrData.writeUInt8(0, 11)
  ihdrData.writeUInt8(0, 12)

  const ihdrChunk = createChunk('IHDR', ihdrData)

  const rawData: number[] = []
  const themeColor = { r: 249, g: 125, b: 28 }
  for (let y = 0; y < height; y++) {
    rawData.push(0)
    for (let x = 0; x < width; x++) {
      const cx = (x - width / 2) / (width / 2)
      const cy = (y - height / 2) / (height / 2)
      const dist = Math.sqrt(cx * cx + cy * cy)

      if (dist <= 0.85) {
        const gradient = 1 - ((cx + 1) / 2) * 0.15
        const r = Math.round(themeColor.r * gradient)
        const g = Math.round(themeColor.g * gradient)
        const b = Math.round(themeColor.b * gradient)

        const plusWidth = size * 0.08
        const plusLen = size * 0.35

        const isInPlusH =
          Math.abs(y - height / 2) < plusWidth / 2 &&
          Math.abs(x - width / 2) < plusLen / 2
        const isInPlusV =
          Math.abs(x - width / 2) < plusWidth / 2 &&
          Math.abs(y - height / 2) < plusLen / 2

        if (isInPlusH || isInPlusV) {
          rawData.push(255, 255, 255, 255)
        } else {
          rawData.push(r, g, b, 255)
        }
      } else if (dist <= 0.92) {
        rawData.push(themeColor.r, themeColor.g, themeColor.b, 255)
      } else {
        rawData.push(0, 0, 0, 0)
      }
    }
  }

  const compressed = deflateSync(Buffer.from(rawData))

  const idatChunk = createChunk('IDAT', compressed)
  const iendChunk = createChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

function createChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)

  const typeBuffer = Buffer.from(type)
  const crcData = Buffer.concat([typeBuffer, data])
  const crc = crc32(crcData)
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc >>> 0, 0)

  return Buffer.concat([length, typeBuffer, data, crcBuffer])
}

function crc32(data: Buffer): number {
  const table: number[] = []
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[i] = c
  }

  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
  }
  return crc ^ 0xffffffff
}

function main(): void {
  if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true })
  }

  const sizes = [16, 32, 48, 128]

  for (const size of sizes) {
    const png = createPNG(size)
    const filepath = join(iconsDir, `icon-${size}.png`)
    writeFileSync(filepath, png)
    console.log(`Created: icon-${size}.png`)
  }

  console.log('All icons generated!')
}

main()
