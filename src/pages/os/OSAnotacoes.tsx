import React, { useState, useEffect } from 'react';
import { useOSContext } from './components/OSLayout';
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote, useToggleFavorite } from '@/hooks/origin-os/useNotes';
import { useAutoSaveDraft } from '@/hooks/useAutoSaveDraft';
import RichTextEditor from './components/RichTextEditor';
import { Plus, Trash2, Star, Search, Loader2 } from 'lucide-react';
import type { Note } from '@/types/origin-os';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OSAnotacoes: React.FC = () => {
  const { userId } = useOSContext();
  const { data: notes = [], isLoading } = useNotes(userId);
  const createNote = useCreateNote(userId);
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const toggleFav = useToggleFavorite();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const activeNote = notes.find(n => n.id === activeId);

  useEffect(() => {
    if (!isLoading && notes.length > 0 && !activeId) {
      setActiveId(notes[0].id);
    }
  }, [isLoading, notes, activeId]);

  const handleCreate = async () => {
    const newNote = await createNote.mutateAsync({});
    setActiveId(newNote.id);
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAutoSave = async (data: { title: string; content: string }) => {
    if (!activeId) return;
    await updateNote.mutateAsync({ id: activeId, payload: data });
  };

  const { data: draft, setData: setDraft } = useAutoSaveDraft(
    `os-draft-note-${activeId || 'none'}`,
    { title: activeNote?.title ?? '', content: activeNote?.content ?? '' },
    handleAutoSave,
    1000
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} className="animate-spin" style={{ color: 'hsl(25 95% 53%)' }} />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Sidebar de anotações */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r" style={{ background: '#161616', borderColor: '#2a2a2a' }}>
        <div className="p-4 flex-shrink-0 border-b" style={{ borderColor: '#2a2a2a' }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Anotações</h1>
            <button
              onClick={handleCreate}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'hsl(25 95% 53%)', color: '#fff' }}
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#666' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar anotações…"
              className="w-full rounded-xl pl-9 pr-3 py-2 text-sm text-white outline-none"
              style={{ background: '#252525', border: '1px solid #333' }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <p className="text-center text-xs p-4" style={{ color: '#555' }}>Nenhuma anotação encontrada.</p>
          ) : (
            filteredNotes.map(note => (
              <button
                key={note.id}
                onClick={() => setActiveId(note.id)}
                className="w-full text-left p-3 rounded-xl transition-all"
                style={{
                  background: activeId === note.id ? 'hsl(25 95% 53% / 0.1)' : 'transparent',
                  border: `1px solid ${activeId === note.id ? 'hsl(25 95% 53% / 0.2)' : 'transparent'}`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm truncate pr-2" style={{ color: activeId === note.id ? 'hsl(25 95% 53%)' : '#eee' }}>
                    {note.title || 'Sem título'}
                  </p>
                  {note.is_favorite && <Star size={12} className="flex-shrink-0" fill="hsl(45 93% 47%)" color="hsl(45 93% 47%)" />}
                </div>
                <p className="text-xs truncate" style={{ color: '#666' }}>
                  {note.content?.replace(/<[^>]*>?/gm, '') || 'Vazia…'}
                </p>
                <p className="text-[10px] mt-1.5" style={{ color: '#444' }}>
                  {format(new Date(note.updated_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor principal */}
      <div className="flex-1 flex flex-col h-full bg-[#111]">
        {activeNote ? (
          <>
            {/* Toolbar Header */}
            <div className="flex items-center justify-between p-4 flex-shrink-0 border-b" style={{ borderColor: '#2a2a2a' }}>
              <input
                value={draft.title}
                onChange={e => setDraft({ ...draft, title: e.target.value })}
                placeholder="Título da anotação"
                className="text-xl font-bold bg-transparent outline-none flex-1 text-white placeholder:text-gray-600"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFav.mutate({ id: activeNote.id, isFavorite: !activeNote.is_favorite })}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: activeNote.is_favorite ? 'hsl(45 93% 47% / 0.1)' : '#222', color: activeNote.is_favorite ? 'hsl(45 93% 47%)' : '#666' }}
                >
                  <Star size={14} fill={activeNote.is_favorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => {
                    deleteNote.mutate(activeNote.id);
                    setActiveId(null);
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors text-gray-600 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            {/* Rich Text */}
            <div className="flex-1 overflow-hidden">
              <RichTextEditor
                content={draft.content}
                onChange={(html) => setDraft({ ...draft, content: html })}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-4" style={{ background: '#1e1e1e', border: '1px solid #2a2a2a' }}>
              <Plus size={24} style={{ color: '#444' }} />
            </div>
            <p className="text-white font-semibold">Nenhuma anotação selecionada</p>
            <p className="text-sm mt-1" style={{ color: '#666' }}>Crie ou selecione uma anotação na lateral.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OSAnotacoes;
