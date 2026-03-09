import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '@iconify/react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQuickLinks } from '../hooks/useQuickLinks'
import { LinkIcon } from '../utils/favicon'
import { useI18n } from '../i18n/useI18n'
import { useSettingsContext } from '../context/SettingsContext'
import type { QuickLink } from '../types'

interface ContextMenuProps {
  x: number
  y: number
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
  t: ReturnType<typeof useI18n>['t']
}

function ContextMenu({ x, y, onEdit, onDelete, onClose, t }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-32 overflow-hidden rounded-lg border border-white/20 bg-white/20 py-1.5 shadow-xl backdrop-blur-md"
      style={{ left: x, top: y }}
    >
      <button
        onClick={() => {
          onEdit()
          onClose()
        }}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-white/90 transition-colors hover:bg-white/10"
      >
        <Icon icon="mdi:pencil-outline" width="16" height="16" />
        {t.quickLinks.edit}
      </button>
      <button
        onClick={() => {
          onDelete()
          onClose()
        }}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-white/10"
      >
        <Icon icon="mdi:delete-outline" width="16" height="16" />
        {t.quickLinks.delete}
      </button>
    </div>,
    document.body
  )
}

interface SortableItemProps {
  link: QuickLink
  onRemove: (id: string) => void
  iconSize: 'sm' | 'md' | 'lg'
}

function SortableItem({ link, onRemove, iconSize }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative flex cursor-grab flex-col items-center gap-1 active:cursor-grabbing"
    >
      <LinkIcon link={link} size={iconSize} />
      <span className="max-w-16 truncate text-xs text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
        {link.title}
      </span>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove(link.id)
        }}
        className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white"
      >
        <Icon icon="mdi:close" width="12" height="12" />
      </button>
    </div>
  )
}

interface LinkItemProps {
  link: QuickLink
  onContextMenu: (e: React.MouseEvent, link: QuickLink) => void
  iconSize: 'sm' | 'md' | 'lg'
}

function LinkItem({ link, onContextMenu, iconSize }: LinkItemProps) {
  return (
    <a
      href={link.url}
      onContextMenu={(e) => {
        e.preventDefault()
        onContextMenu(e, link)
      }}
      className="group relative flex flex-col items-center gap-1 transition-transform duration-200 [backface-visibility:hidden] [will-change:transform] hover:scale-110"
    >
      <LinkIcon link={link} size={iconSize} />
      <span className="max-w-16 truncate text-xs text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] group-hover:text-white/90">
        {link.title}
      </span>
    </a>
  )
}

function QuickLinks() {
  const { links, addLink, updateLink, removeLink, setLinks } = useQuickLinks()
  const { t } = useI18n()
  const { settings } = useSettingsContext()
  const [editing, setEditing] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [editLink, setEditLink] = useState<QuickLink | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    link: QuickLink
  } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

  const handleEdit = async () => {
    if (editLink && editLink.title && editLink.url) {
      let url = editLink.url
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      updateLink(editLink.id, { title: editLink.title, url })
      setEditLink(null)
      setShowEditForm(false)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, link: QuickLink) => {
    setContextMenu({ x: e.clientX, y: e.clientY, link })
  }

  const handleEditFromContextMenu = () => {
    if (contextMenu) {
      setEditLink(contextMenu.link)
      setShowEditForm(true)
    }
  }

  const handleDeleteFromContextMenu = () => {
    if (contextMenu) {
      removeLink(contextMenu.link.id)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id)
      const newIndex = links.findIndex((link) => link.id === over.id)
      const newLinks = arrayMove(links, oldIndex, newIndex)
      setLinks(newLinks)
    }
  }

  return (
    <div className="fixed bottom-20 left-1/2 z-20 -translate-x-1/2 select-none">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((l) => l.id)}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-wrap justify-center gap-3">
            {links.map((link) =>
              editing ? (
                <SortableItem
                  key={link.id}
                  link={link}
                  onRemove={removeLink}
                  iconSize={settings.linkIconSize}
                />
              ) : (
                <LinkItem
                  key={link.id}
                  link={link}
                  onContextMenu={handleContextMenu}
                  iconSize={settings.linkIconSize}
                />
              )
            )}

            {!editing && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex flex-col items-center gap-1 transition-transform duration-200 [backface-visibility:hidden] [will-change:transform] hover:scale-110"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-white/30 text-2xl text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] hover:border-white/50">
                  +
                </div>
                <span className="text-xs text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                  {t.quickLinks.add}
                </span>
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <button
        onClick={() => setEditing(!editing)}
        className="mt-4 block w-full text-center text-xs text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] hover:text-white/80"
      >
        {editing ? t.quickLinks.done : t.quickLinks.edit}
      </button>

      {showAddForm &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowAddForm(false)}
          >
            <div className="w-96" onClick={(e) => e.stopPropagation()}>
              <div className="glass p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-medium text-white">
                    {t.quickLinks.addTitle}
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                  >
                    <Icon icon="mdi:close" width="20" height="20" />
                  </button>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      {t.quickLinks.name}
                    </label>
                    <input
                      type="text"
                      placeholder={t.quickLinks.namePlaceholder}
                      value={newLink.title}
                      onChange={(e) =>
                        setNewLink({ ...newLink, title: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      {t.quickLinks.url}
                    </label>
                    <input
                      type="text"
                      placeholder={t.quickLinks.urlPlaceholder}
                      value={newLink.url}
                      onChange={(e) =>
                        setNewLink({ ...newLink, url: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-white/40"
                    />
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 rounded-xl bg-white/10 py-3 text-sm text-white/70 transition-colors hover:bg-white/20"
                  >
                    {t.quickLinks.cancel}
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={!newLink.title || !newLink.url}
                    className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t.quickLinks.add}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onEdit={handleEditFromContextMenu}
          onDelete={handleDeleteFromContextMenu}
          onClose={() => setContextMenu(null)}
          t={t}
        />
      )}

      {showEditForm &&
        editLink &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowEditForm(false)}
          >
            <div className="w-96" onClick={(e) => e.stopPropagation()}>
              <div className="glass p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-medium text-white">
                    {t.quickLinks.editTitle}
                  </h3>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                  >
                    <Icon icon="mdi:close" width="20" height="20" />
                  </button>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      {t.quickLinks.name}
                    </label>
                    <input
                      type="text"
                      placeholder={t.quickLinks.namePlaceholder}
                      value={editLink.title}
                      onChange={(e) =>
                        setEditLink({ ...editLink, title: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      {t.quickLinks.url}
                    </label>
                    <input
                      type="text"
                      placeholder={t.quickLinks.urlPlaceholder}
                      value={editLink.url}
                      onChange={(e) =>
                        setEditLink({ ...editLink, url: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors focus:border-white/40"
                    />
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="flex-1 rounded-xl bg-white/10 py-3 text-sm text-white/70 transition-colors hover:bg-white/20"
                  >
                    {t.quickLinks.cancel}
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={!editLink.title || !editLink.url}
                    className="flex-1 rounded-xl bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t.quickLinks.save}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default QuickLinks
