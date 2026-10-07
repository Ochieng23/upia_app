'use client'
import { useEffect, useRef, useState } from 'react'
import { useEditor, useEditorState, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube from '@tiptap/extension-youtube'
import {
  LuArrowLeft, LuBold, LuItalic, LuUnderline, LuStrikethrough, LuHeading2, LuHeading3, LuPilcrow,
  LuList, LuListOrdered, LuQuote, LuLink, LuUnlink, LuImagePlus, LuAlignLeft, LuAlignCenter,
  LuAlignRight, LuMinus, LuYoutube, LuUndo2, LuRedo2, LuUpload, LuTrash2, LuX, LuExternalLink,
} from 'react-icons/lu'
import { api } from '../lib/api'

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'
const isImageFile = (f) => /^image\/(jpeg|png|webp|gif)$/.test(f.type)

async function uploadImage(file) {
  const fd = new FormData()
  fd.append('image', file)
  const { url } = await api.post('/posts/upload-image', fd)
  return url
}

const fromPost = (p) => ({
  _id: p?._id,
  slug: p?.slug,
  title: p?.title || '',
  description: p?.description || '',
  body: p?.body || '',
  coverImage: p?.coverImage || '',
  categories: p?.categories || [],
  authorName: p?.author?.name || '',
  authorTitle: p?.author?.title || '',
  authorImageUrl: p?.author?.imageUrl || '',
  published: !!p?.published,
})

/* ─── Full-screen article editor ─────────────────────────────────────────── */

export function PostEditor({ post, onClose, onSaved }) {
  const [form, setForm] = useState(() => fromPost(post))
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState('')
  const titleRef = useRef(null)

  const update = (patch) => { setForm((f) => ({ ...f, ...patch })); setDirty(true) }

  const withUpload = async (file, onUrl) => {
    if (!isImageFile(file)) { setError('Only JPEG, PNG, WebP or GIF images can be uploaded'); return }
    setUploading((n) => n + 1); setError('')
    try { onUrl(await uploadImage(file)) }
    catch (err) { setError('Image upload failed: ' + err.message) }
    finally { setUploading((n) => n - 1) }
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        link: { openOnClick: false, autolink: true, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } },
      }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
      Youtube.configure({ nocookie: true, width: 640, height: 360 }),
    ],
    content: form.body,
    editorProps: {
      attributes: { class: 'post-prose prose prose-lg max-w-none min-h-[50vh] focus:outline-none' },
      // Pasted or dropped images are uploaded to storage instead of being inlined as base64
      handlePaste: (view, event) => insertImageFiles(view, event.clipboardData?.files),
      handleDrop: (view, event, _slice, moved) => !moved && insertImageFiles(view, event.dataTransfer?.files, event),
    },
    onUpdate: ({ editor }) => { setForm((f) => ({ ...f, body: editor.getHTML() })); setDirty(true) },
  })

  // Uses the ProseMirror view passed to the handler: editorProps are captured
  // once at creation, before `editor` exists.
  function insertImageFiles(view, fileList, dropEvent) {
    const files = Array.from(fileList || []).filter(isImageFile)
    if (!files.length) return false
    const pos = dropEvent ? view.posAtCoords({ left: dropEvent.clientX, top: dropEvent.clientY })?.pos : undefined
    files.forEach((file) => withUpload(file, (src) => {
      const node = view.state.schema.nodes.image.create({ src })
      const tr = pos != null ? view.state.tr.insert(pos, node) : view.state.tr.replaceSelectionWith(node)
      view.dispatch(tr)
    }))
    return true
  }

  // Auto-grow the title box
  useEffect(() => {
    const el = titleRef.current
    if (el) { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px` }
  }, [form.title])

  // Warn before losing unsaved work on tab close / reload
  useEffect(() => {
    const onBeforeUnload = (e) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const close = () => {
    if (dirty && !confirm('You have unsaved changes. Leave without saving?')) return
    onClose()
  }

  const save = async (published) => {
    if (!form.title.trim()) { setError('Add a title before saving'); titleRef.current?.focus(); return }
    if (uploading) { setError('Wait for images to finish uploading'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description,
        body: editor?.isEmpty ? '' : form.body,
        coverImage: form.coverImage,
        categories: form.categories,
        author: { name: form.authorName, title: form.authorTitle, imageUrl: form.authorImageUrl },
        published,
      }
      if (form._id) await api.put(`/posts/${form._id}`, payload)
      else await api.post('/posts', payload)
      setDirty(false)
      onSaved(published ? (form.published ? 'Post updated' : 'Post published') : 'Draft saved')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const words = editor ? editor.getText().trim().split(/\s+/).filter(Boolean).length : 0

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FBFAF7]">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-3 border-b border-[#E2DCDA] bg-white px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={close} className="flex items-center gap-1.5 rounded-[6px] px-2 py-1.5 text-sm font-medium text-[#5A5450] hover:bg-[#F8F5F3] hover:text-[#111111]">
            <LuArrowLeft className="h-4 w-4" /> Posts
          </button>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${form.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {form.published ? 'Published' : 'Draft'}
          </span>
          <span className="hidden truncate text-xs text-[#5A5450] sm:inline">
            {uploading ? 'Uploading image…' : dirty ? 'Unsaved changes' : form._id ? 'All changes saved' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {form.published && form.slug && (
            <a href={`/post/${form.slug}`} target="_blank" rel="noreferrer" className="hidden items-center gap-1 rounded-[6px] px-3 py-2 text-sm font-medium text-[#5A5450] hover:bg-[#F8F5F3] sm:flex">
              View <LuExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button type="button" disabled={saving} onClick={() => save(false)}
            className="rounded-[6px] border border-[#E2DCDA] bg-white px-3 py-2 text-sm font-medium text-[#111111] hover:bg-[#F8F5F3] disabled:opacity-50">
            {form.published ? 'Unpublish' : 'Save draft'}
          </button>
          <button type="button" disabled={saving} onClick={() => save(true)}
            className="rounded-[6px] bg-[#236331] px-4 py-2 text-sm font-medium text-white hover:bg-[#2B753A] disabled:opacity-50">
            {saving ? 'Saving…' : form.published ? 'Update' : 'Publish'}
          </button>
        </div>
      </header>

      {error && (
        <div className="flex items-center justify-between gap-3 bg-red-50 px-6 py-2 text-sm text-red-700">
          {error}
          <button type="button" onClick={() => setError('')} aria-label="Dismiss"><LuX className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Writing area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-8">
            <CoverImage
              url={form.coverImage}
              uploading={uploading > 0}
              onFile={(file) => withUpload(file, (url) => update({ coverImage: url }))}
              onRemove={() => update({ coverImage: '' })}
            />

            <textarea
              ref={titleRef}
              rows={1}
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="Article title"
              className="mt-8 w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-[34px] font-semibold leading-tight text-[#111111] placeholder:text-[#C9C2BE] focus:outline-none focus:ring-0"
            />
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Short summary shown on the news page and in link previews…"
              className="mt-3 w-full resize-none border-0 bg-transparent p-0 text-[17px] leading-relaxed text-[#5A5450] placeholder:text-[#C9C2BE] focus:outline-none focus:ring-0"
            />

            <div className="sticky top-0 z-10 -mx-2 mt-6 bg-[#FBFAF7]/95 px-2 py-2 backdrop-blur">
              <Toolbar editor={editor} onImageFile={(file) => withUpload(file, (src) => editor.chain().focus().setImage({ src }).run())} />
            </div>

            <div className="mt-4 rounded-[12px] border border-[#E2DCDA] bg-white px-6 py-6 sm:px-10">
              <EditorContent editor={editor} />
            </div>
            <p className="mt-2 text-right text-xs text-[#5A5450]">
              {words} word{words === 1 ? '' : 's'} · {Math.max(1, Math.round(words / 200))} min read
            </p>
          </div>
        </main>

        {/* Settings sidebar */}
        <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-[#E2DCDA] bg-white p-6 lg:block">
          <PostSettings form={form} update={update} withUpload={withUpload} />
        </aside>
      </div>

      {/* Settings below the editor on small screens */}
      <div className="max-h-[40vh] overflow-y-auto border-t border-[#E2DCDA] bg-white p-4 lg:hidden">
        <PostSettings form={form} update={update} withUpload={withUpload} />
      </div>
    </div>
  )
}

/* ─── Cover image (upload only) ──────────────────────────────────────────── */

function CoverImage({ url, uploading, onFile, onRemove }) {
  const inputRef = useRef(null)
  const [over, setOver] = useState(false)

  const pick = (e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }
  const drop = (e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f) }

  return (
    <div onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)} onDrop={drop}>
      <input ref={inputRef} type="file" accept={IMAGE_ACCEPT} className="hidden" onChange={pick} />
      {url ? (
        <div className="group relative overflow-hidden rounded-[12px]">
          <img src={url} alt="Cover" className="h-64 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()} className="flex items-center gap-1.5 rounded-[6px] bg-white px-3 py-2 text-sm font-medium text-[#111111]">
              <LuUpload className="h-4 w-4" /> Replace
            </button>
            <button type="button" onClick={onRemove} className="flex items-center gap-1.5 rounded-[6px] bg-white px-3 py-2 text-sm font-medium text-red-600">
              <LuTrash2 className="h-4 w-4" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-[12px] border-2 border-dashed text-sm transition-colors ${over ? 'border-[#236331] bg-[#EBF5EC] text-[#236331]' : 'border-[#E2DCDA] text-[#5A5450] hover:border-[#236331] hover:text-[#236331]'}`}
        >
          <LuImagePlus className="h-6 w-6" />
          <span className="font-medium">{uploading ? 'Uploading…' : 'Add a cover image'}</span>
          <span className="text-xs opacity-70">Click or drag an image here · JPEG, PNG, WebP or GIF, up to 8 MB</span>
        </button>
      )}
    </div>
  )
}

/* ─── Formatting toolbar ─────────────────────────────────────────────────── */

function Toolbar({ editor, onImageFile }) {
  const imageInputRef = useRef(null)
  const [prompt, setPrompt] = useState(null) // null | 'link' | 'youtube'
  const [value, setValue] = useState('')

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => e ? {
      bold: e.isActive('bold'), italic: e.isActive('italic'), underline: e.isActive('underline'), strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }), h3: e.isActive('heading', { level: 3 }), paragraph: e.isActive('paragraph'),
      bullet: e.isActive('bulletList'), ordered: e.isActive('orderedList'), quote: e.isActive('blockquote'), link: e.isActive('link'),
      left: e.isActive({ textAlign: 'left' }), center: e.isActive({ textAlign: 'center' }), right: e.isActive({ textAlign: 'right' }),
      canUndo: e.can().undo(), canRedo: e.can().redo(),
    } : {},
  }) || {}

  if (!editor) return <div className="h-11 rounded-[8px] border border-[#E2DCDA] bg-white" />
  const run = () => editor.chain().focus()

  const openPrompt = (kind) => {
    setValue(kind === 'link' ? editor.getAttributes('link').href || '' : '')
    setPrompt(kind)
  }
  const applyPrompt = (e) => {
    e.preventDefault()
    const url = value.trim()
    if (prompt === 'link') {
      if (url) run().extendMarkRange('link').setLink({ href: /^(https?:|mailto:|tel:)/.test(url) ? url : `https://${url}` }).run()
      else run().extendMarkRange('link').unsetLink().run()
      // Put the cursor after the link so further typing or inserts don't replace it
      editor.chain().focus().setTextSelection(editor.state.selection.to).unsetMark('link').run()
    } else if (url) {
      run().setYoutubeVideo({ src: url }).run()
    }
    setPrompt(null)
  }

  return (
    <div className="rounded-[8px] border border-[#E2DCDA] bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-0.5 p-1.5">
        <Btn title="Paragraph" active={state.paragraph && !state.h2 && !state.h3} onClick={() => run().setParagraph().run()} icon={LuPilcrow} />
        <Btn title="Heading" active={state.h2} onClick={() => run().toggleHeading({ level: 2 }).run()} icon={LuHeading2} />
        <Btn title="Subheading" active={state.h3} onClick={() => run().toggleHeading({ level: 3 }).run()} icon={LuHeading3} />
        <Sep />
        <Btn title="Bold (Ctrl+B)" active={state.bold} onClick={() => run().toggleBold().run()} icon={LuBold} />
        <Btn title="Italic (Ctrl+I)" active={state.italic} onClick={() => run().toggleItalic().run()} icon={LuItalic} />
        <Btn title="Underline (Ctrl+U)" active={state.underline} onClick={() => run().toggleUnderline().run()} icon={LuUnderline} />
        <Btn title="Strikethrough" active={state.strike} onClick={() => run().toggleStrike().run()} icon={LuStrikethrough} />
        <Sep />
        <Btn title="Bulleted list" active={state.bullet} onClick={() => run().toggleBulletList().run()} icon={LuList} />
        <Btn title="Numbered list" active={state.ordered} onClick={() => run().toggleOrderedList().run()} icon={LuListOrdered} />
        <Btn title="Quote" active={state.quote} onClick={() => run().toggleBlockquote().run()} icon={LuQuote} />
        <Btn title="Divider" onClick={() => run().setHorizontalRule().run()} icon={LuMinus} />
        <Sep />
        <Btn title="Align left" active={state.left} onClick={() => run().setTextAlign('left').run()} icon={LuAlignLeft} />
        <Btn title="Align center" active={state.center} onClick={() => run().setTextAlign('center').run()} icon={LuAlignCenter} />
        <Btn title="Align right" active={state.right} onClick={() => run().setTextAlign('right').run()} icon={LuAlignRight} />
        <Sep />
        <Btn title="Link" active={state.link || prompt === 'link'} onClick={() => openPrompt('link')} icon={LuLink} />
        {state.link && <Btn title="Remove link" onClick={() => run().extendMarkRange('link').unsetLink().run()} icon={LuUnlink} />}
        <Btn title="Insert image" onClick={() => imageInputRef.current?.click()} icon={LuImagePlus} />
        <Btn title="Embed YouTube video" active={prompt === 'youtube'} onClick={() => openPrompt('youtube')} icon={LuYoutube} />
        <div className="ml-auto flex items-center gap-0.5">
          <Btn title="Undo (Ctrl+Z)" disabled={!state.canUndo} onClick={() => run().undo().run()} icon={LuUndo2} />
          <Btn title="Redo (Ctrl+Shift+Z)" disabled={!state.canRedo} onClick={() => run().redo().run()} icon={LuRedo2} />
        </div>
        <input
          ref={imageInputRef} type="file" accept={IMAGE_ACCEPT} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onImageFile(f); e.target.value = '' }}
        />
      </div>

      {prompt && (
        <form onSubmit={applyPrompt} className="flex items-center gap-2 border-t border-[#E2DCDA] p-2">
          <input
            autoFocus value={value} onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') setPrompt(null) }}
            placeholder={prompt === 'link' ? 'Paste a link, e.g. https://upiaparty.com' : 'Paste a YouTube video link'}
            className="flex-1 rounded-[6px] border border-[#E2DCDA] px-3 py-1.5 text-sm focus:border-[#236331] focus:outline-none focus:ring-1 focus:ring-[#236331]"
          />
          <button type="submit" className="rounded-[6px] bg-[#236331] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#2B753A]">
            {prompt === 'link' ? 'Apply' : 'Embed'}
          </button>
          <button type="button" onClick={() => setPrompt(null)} className="rounded-[6px] px-2 py-1.5 text-sm text-[#5A5450] hover:bg-[#F8F5F3]">Cancel</button>
        </form>
      )}
    </div>
  )
}

function Btn({ icon: Icon, title, active, disabled, onClick }) {
  return (
    <button
      type="button" title={title} aria-label={title} aria-pressed={!!active} disabled={disabled}
      onMouseDown={(e) => e.preventDefault()} // keep the editor selection
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-[6px] transition-colors disabled:opacity-30 ${active ? 'bg-[#EBF5EC] text-[#236331]' : 'text-[#5A5450] hover:bg-[#F8F5F3] hover:text-[#111111]'}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

const Sep = () => <span className="mx-1 h-5 w-px bg-[#E2DCDA]" />

/* ─── Sidebar: categories and author ─────────────────────────────────────── */

function PostSettings({ form, update, withUpload }) {
  const [catInput, setCatInput] = useState('')
  const photoRef = useRef(null)

  const addCategory = () => {
    const names = catInput.split(',').map((c) => c.trim()).filter(Boolean)
    const next = [...form.categories]
    names.forEach((n) => { if (!next.some((c) => c.toLowerCase() === n.toLowerCase())) next.push(n) })
    update({ categories: next }); setCatInput('')
  }

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450]">Categories</h3>
        <div className="flex flex-wrap gap-1.5">
          {form.categories.map((c) => (
            <span key={c} className="flex items-center gap-1 rounded-full bg-[#FBF0F0] py-1 pl-3 pr-1.5 text-xs font-medium text-[#C25757]">
              {c}
              <button type="button" aria-label={`Remove ${c}`} onClick={() => update({ categories: form.categories.filter((x) => x !== c) })} className="rounded-full p-0.5 hover:bg-[#C25757]/10">
                <LuX className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          value={catInput}
          onChange={(e) => setCatInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addCategory() } }}
          onBlur={addCategory}
          placeholder="Type a category and press Enter"
          className={`${fieldCls} mt-2`}
        />
      </section>

      <section>
        <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450]">Author</h3>
        <div className="flex items-center gap-3">
          <input ref={photoRef} type="file" accept={IMAGE_ACCEPT} className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) withUpload(f, (url) => update({ authorImageUrl: url })); e.target.value = '' }} />
          <button type="button" onClick={() => photoRef.current?.click()} title="Upload author photo"
            className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F8F5F3] text-[#5A5450] ring-1 ring-[#E2DCDA] hover:ring-[#236331]">
            {form.authorImageUrl ? <img src={form.authorImageUrl} alt="Author" className="h-full w-full object-cover" /> : <LuUpload className="h-4 w-4" />}
          </button>
          <div className="text-xs text-[#5A5450]">
            <button type="button" onClick={() => photoRef.current?.click()} className="font-medium text-[#236331] hover:underline">
              {form.authorImageUrl ? 'Change photo' : 'Upload photo'}
            </button>
            {form.authorImageUrl && (
              <> · <button type="button" onClick={() => update({ authorImageUrl: '' })} className="hover:underline">Remove</button></>
            )}
          </div>
        </div>
        <label className="mt-4 block text-xs font-medium text-[#5A5450]">Name
          <input value={form.authorName} onChange={(e) => update({ authorName: e.target.value })} placeholder="e.g. Arbe Galgallo" className={`${fieldCls} mt-1`} />
        </label>
        <label className="mt-3 block text-xs font-medium text-[#5A5450]">Title
          <input value={form.authorTitle} onChange={(e) => update({ authorTitle: e.target.value })} placeholder="e.g. Secretary General" className={`${fieldCls} mt-1`} />
        </label>
      </section>

      <section className="rounded-[8px] bg-[#F8F5F3] p-4 text-xs leading-relaxed text-[#5A5450]">
        <p className="mb-1 font-medium text-[#111111]">Tips</p>
        Paste or drag images straight into the article. Select text to make it a link. Use Heading and Subheading to break up long articles.
      </section>
    </div>
  )
}

const fieldCls = 'block w-full rounded-[6px] border border-[#E2DCDA] px-3 py-2 text-sm focus:border-[#236331] focus:outline-none focus:ring-1 focus:ring-[#236331]'
