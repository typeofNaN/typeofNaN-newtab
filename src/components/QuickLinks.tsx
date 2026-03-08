import { useState } from 'react'
import { useQuickLinks } from '../hooks/useQuickLinks'
import { LinkIcon } from '../utils/favicon'

function QuickLinks() {
  const { links, addLink, removeLink, reorderLinks } = useQuickLinks()
  const [editing, setEditing] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const handleAdd = async () => {
    if (newLink.title && newLink.url) {
      let url = newLink.url
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      await addLink({ title: newLink.title, url })
      setNewLink({ title: '', url: '' })
      setShowAddForm(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
    setDragIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragIndex !== null && dragIndex !== index) {
      setDropIndex(index)
    }
  }

  const handleDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
    if (fromIndex !== index) {
      await reorderLinks(fromIndex, index)
    }
    setDragIndex(null)
    setDropIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDropIndex(null)
  }

  const handleClick = (e: React.MouseEvent, url: string) => {
    if (editing) {
      e.preventDefault()
    }
  }

  return (
    <div className="fixed bottom-20 left-1/2 z-20 -translate-x-1/2">
      <div className="flex flex-wrap justify-center gap-3">
        {links.map((link, index) =>
          editing ? (
            <div
              key={link.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative flex cursor-grab flex-col items-center gap-1 transition-all active:cursor-grabbing ${
                dragIndex === index ? 'opacity-50' : ''
              } ${dropIndex === index ? 'translate-x-14' : ''}`}
            >
              <LinkIcon link={link} />
              <span className="max-w-16 truncate text-xs text-white/70">
                {link.title}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeLink(link.id)
                }}
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
              >
                ×
              </button>
            </div>
          ) : (
            <a
              key={link.id}
              href={link.url}
              onClick={(e) => handleClick(e, link.url)}
              className="group relative flex flex-col items-center gap-1 transition-transform hover:scale-110"
            >
              <LinkIcon link={link} />
              <span className="max-w-16 truncate text-xs text-white/70 group-hover:text-white/90">
                {link.title}
              </span>
            </a>
          )
        )}

        {/* Add button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-white/30 text-2xl text-white/50 hover:border-white/50 hover:text-white/70">
            +
          </div>
          <span className="text-xs text-white/50">添加</span>
        </button>
      </div>

      {/* Edit toggle */}
      <button
        onClick={() => setEditing(!editing)}
        className="mt-4 block w-full text-center text-xs text-white/40 hover:text-white/60"
      >
        {editing ? '完成' : '编辑'}
      </button>

      {/* Add form modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass w-80 p-6">
            <h3 className="mb-4 text-lg font-medium text-white">
              添加快捷链接
            </h3>
            <input
              type="text"
              placeholder="名称"
              value={newLink.title}
              onChange={(e) =>
                setNewLink({ ...newLink, title: e.target.value })
              }
              className="mb-3 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/40 outline-none"
            />
            <input
              type="text"
              placeholder="网址"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="mb-4 w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/40 outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 rounded-lg bg-white/10 py-2 text-white/70 hover:bg-white/20"
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-lg bg-white/20 py-2 text-white hover:bg-white/30"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickLinks