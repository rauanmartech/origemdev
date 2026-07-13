import React, { useEffect, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
  Code2,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  autofocus?: boolean;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    disabled={disabled}
    title={title}
    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 disabled:opacity-30"
    style={{
      background: active ? 'hsl(25 95% 53% / 0.2)' : 'transparent',
      color: active ? 'hsl(25 95% 53%)' : '#888',
    }}
    onMouseEnter={e => {
      if (!active) (e.currentTarget as HTMLButtonElement).style.background = '#2a2a2a';
    }}
    onMouseLeave={e => {
      if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
    }}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-5 mx-1 flex-shrink-0" style={{ background: '#2a2a2a' }} />
);

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Comece a escrever…',
  autofocus = false,
}) => {
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'os-link' } }),
      CharacterCount,
      TextStyle,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    autofocus,
    editorProps: {
      attributes: {
        class: 'os-editor-content',
        spellcheck: 'true',
      },
    },
    onUpdate: ({ editor }) => {
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        onChange(editor.getHTML());
      }, 500);
    },
  });

  // Sync external content changes (e.g. switching notes)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content ?? '', { emitUpdate: false });
    }
  }, [content, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do link:', previousUrl);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const characterCount = editor.storage.characterCount;

  return (
    <div className="flex flex-col h-full" style={{ background: '#161616' }}>
      {/* Toolbar */}
      <div
        className="flex items-center flex-wrap gap-0.5 px-4 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid #2a2a2a', background: '#1a1a1a' }}
      >
        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Desfazer">
          <Undo size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Refazer">
          <Redo size={13} />
        </ToolbarButton>
        <Divider />

        {/* Headings */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Título 1">
          <Heading1 size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título 2">
          <Heading2 size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Título 3">
          <Heading3 size={13} />
        </ToolbarButton>
        <Divider />

        {/* Inline marks */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito">
          <Bold size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico">
          <Italic size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Sublinhado">
          <UnderlineIcon size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado">
          <Strikethrough size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Destacar">
          <Highlighter size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Código inline">
          <Code size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Link">
          <LinkIcon size={13} />
        </ToolbarButton>
        <Divider />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
          <List size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
          <ListOrdered size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citação">
          <Quote size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Bloco de código">
          <Code2 size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divisor">
          <Minus size={13} />
        </ToolbarButton>
        <Divider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Alinhar à esquerda">
          <AlignLeft size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centralizar">
          <AlignCenter size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Alinhar à direita">
          <AlignRight size={13} />
        </ToolbarButton>
      </div>



      {/* Editor area */}
      <div className="flex-1 overflow-y-auto">
        <style>{`
          .os-editor-content {
            padding: 2rem;
            min-height: 100%;
            outline: none;
            color: #d4d4d4;
            font-size: 15px;
            line-height: 1.8;
            font-family: 'DM Sans', sans-serif;
          }
          .os-editor-content h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.5rem; color: #fff; font-family: 'Space Grotesk', sans-serif; }
          .os-editor-content h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; margin-top: 1.25rem; color: #eee; font-family: 'Space Grotesk', sans-serif; }
          .os-editor-content h3 { font-size: 1.15rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; color: #ddd; font-family: 'Space Grotesk', sans-serif; }
          .os-editor-content p { margin-bottom: 0.75rem; }
          .os-editor-content ul, .os-editor-content ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
          .os-editor-content li { margin-bottom: 0.25rem; }
          .os-editor-content blockquote { border-left: 3px solid hsl(25 95% 53%); padding-left: 1rem; margin: 1rem 0; color: #888; font-style: italic; }
          .os-editor-content code { background: #252525; border-radius: 6px; padding: 0.15em 0.4em; font-size: 0.875em; color: hsl(25 95% 65%); font-family: 'JetBrains Mono', monospace; }
          .os-editor-content pre { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 1rem; margin: 1rem 0; overflow-x: auto; }
          .os-editor-content pre code { background: none; padding: 0; color: #a8b2c1; }
          .os-editor-content hr { border: none; border-top: 1px solid #2a2a2a; margin: 1.5rem 0; }
          .os-editor-content mark { background: hsl(25 95% 53% / 0.3); color: inherit; border-radius: 3px; padding: 0 2px; }
          .os-link { color: hsl(25 95% 60%); text-decoration: underline; }
          .is-editor-empty:before { content: attr(data-placeholder); float: left; color: #444; pointer-events: none; height: 0; font-style: italic; }
          .os-editor-content strong { color: #fff; font-weight: 700; }
          .os-editor-content em { font-style: italic; }
          .os-editor-content s { text-decoration: line-through; color: #666; }
        `}</style>
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-end px-4 py-1.5 flex-shrink-0"
        style={{ borderTop: '1px solid #1f1f1f', background: '#131313' }}
      >
        <span className="text-[11px]" style={{ color: '#444' }}>
          {characterCount?.characters() ?? 0} caracteres · {characterCount?.words() ?? 0} palavras
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;
