#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { deflateSync } from 'zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const iconsDir = join(__dirname, '..', 'public', 'icons')

// 创建简单的 PNG 图标（纯色圆形背景 + 简单图案）
function createPNG(size) {
  // PNG 文件头
  const signature = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ])

  // IHDR chunk
  const width = size
  const height = size
  const bitDepth = 8
  const colorType = 6 // RGBA
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData.writeUInt8(bitDepth, 8)
  ihdrData.writeUInt8(colorType, 9)
  ihdrData.writeUInt8(0, 10) // compression
  ihdrData.writeUInt8(0, 11) // filter
  ihdrData.writeUInt8(0, 12) // interlace

  const ihdrChunk = createChunk('IHDR', ihdrData)

  // 创建图像数据（渐变背景 + 白色时钟图案）
  const rawData = []
  for (let y = 0; y < height; y++) {
    rawData.push(0) // filter byte
    for (let x = 0; x < width; x++) {
      // 渐变背景色（紫蓝色渐变）
      const cx = x / width
      const r = Math.round(102 + (118 - 102) * cx) // #667eea -> #764ba2
      const g = Math.round(126 + (75 - 126) * cx)
      const b = Math.round(234 + (162 - 234) * cx)

      // 绘制简单的时钟图案（白色圆圈和指针）
      const centerX = width / 2
      const centerY = height / 2
      const radius = size * 0.35
      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

      // 外圈
      const outerRadius = radius
      const innerRadius = radius - Math.max(2, size / 16)

      if (dist <= outerRadius && dist >= innerRadius) {
        // 白色圆环
        rawData.push(255, 255, 255, 220)
      } else if (dist < innerRadius) {
        // 内部：绘制时钟指针
        const angle1 = -Math.PI / 3 // 时针角度
        const angle2 = Math.PI / 6 // 分针角度

        const dx = x - centerX
        const dy = y - centerY

        // 简化的指针绘制
        const isHourHand =
          Math.abs(dx * Math.cos(angle1) + dy * Math.sin(angle1)) < size / 16 &&
          dy * Math.cos(angle1) - dx * Math.sin(angle1) > 0 &&
          dy * Math.cos(angle1) - dx * Math.sin(angle1) < radius * 0.5

        const isMinuteHand =
          Math.abs(dx * Math.cos(angle2) + dy * Math.sin(angle2)) < size / 24 &&
          dy * Math.cos(angle2) - dx * Math.sin(angle2) > 0 &&
          dy * Math.cos(angle2) - dx * Math.sin(angle2) < radius * 0.7

        if (isHourHand || isMinuteHand) {
          rawData.push(255, 255, 255, 200)
        } else {
          rawData.push(r, g, b, 255)
        }
      } else {
        // 外部背景
        rawData.push(r, g, b, 255)
      }
    }
  }

  // 压缩数据
  const compressed = deflateSync(Buffer.from(rawData))

  const idatChunk = createChunk('IDAT', compressed)

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0))

  // 组合 PNG
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk])
}

function createChunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)

  const typeBuffer = Buffer.from(type)
  const crcData = Buffer.concat([typeBuffer, data])
  const crc = crc32(crcData)
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc >>> 0, 0)

  return Buffer.concat([length, typeBuffer, data, crcBuffer])
}

// CRC32 实现
function crc32(data) {
  const table = []
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

// 主函数
function main() {
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
