import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// Types
// =====================================================
export interface KanbanItem {
  id: string;
  [key: string]: unknown;
}

export interface KanbanColumnDef {
  id: string;
  label: string;
  color: string;
  accent: string;
  items: KanbanItem[];
}

interface KanbanBoardProps {
  columns: KanbanColumnDef[];
  renderCard: (item: KanbanItem, columnId: string) => React.ReactNode;
  onDragEnd: (itemId: string, fromColumn: string, toColumn: string, newIndex: number) => void;
  onAddCard?: (columnId: string) => void;
  addLabel?: string;
}

// =====================================================
// Droppable Column
// =====================================================
interface DroppableColumnProps {
  column: KanbanColumnDef;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  isDraggingOver?: boolean;
}

function DroppableColumn({ column, children, onAdd, addLabel, isDraggingOver }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col rounded-2xl overflow-hidden flex-shrink-0 w-72"
      style={{
        background: isDraggingOver ? '#252525' : '#1a1a1a',
        border: `1px solid ${isDraggingOver ? column.accent : '#2a2a2a'}`,
        transition: 'all 0.2s ease',
        minHeight: 200,
      }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #2a2a2a' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: column.accent }} />
          <span className="text-sm font-semibold text-white">{column.label}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${column.accent}20`, color: column.accent }}
          >
            {column.items.length}
          </span>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
            title={addLabel ?? 'Adicionar'}
          >
            <Plus size={13} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        <SortableContext
          items={column.items.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {children}
          </AnimatePresence>
        </SortableContext>

        {column.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#222' }}>
              <div className="w-4 h-0.5 rounded" style={{ background: '#333' }} />
            </div>
            <p className="text-xs" style={{ color: '#444' }}>Nenhum item</p>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// Sortable Card Wrapper
// =====================================================
interface SortableCardProps {
  id: string;
  children: React.ReactNode;
}

export function SortableCard({ id, children }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

// =====================================================
// Main Kanban Board
// =====================================================
const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  renderCard,
  onDragEnd,
  onAddCard,
  addLabel,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const findColumn = (id: string): KanbanColumnDef | undefined => {
    // check if id is a column id
    const col = columns.find(c => c.id === id);
    if (col) return col;
    // find which column contains this item
    return columns.find(c => c.items.some(item => item.id === id));
  };

  const activeItem = activeId
    ? columns.flatMap(c => c.items).find(i => i.id === activeId)
    : null;
  const activeColumn = activeId ? findColumn(activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over ? String(event.over.id) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const itemId = String(active.id);
    const overId = String(over.id);

    const fromCol = findColumn(itemId);
    const toCol = findColumn(overId);

    if (!fromCol || !toCol) return;

    let newIndex = toCol.items.findIndex(i => i.id === overId);
    if (newIndex === -1) newIndex = toCol.items.length;

    onDragEnd(itemId, fromCol.id, toCol.id, newIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {columns.map(col => (
          <DroppableColumn
            key={col.id}
            column={col}
            onAdd={onAddCard ? () => onAddCard(col.id) : undefined}
            addLabel={addLabel}
            isDraggingOver={overId === col.id || col.items.some(i => i.id === overId && col.id !== (activeColumn?.id))}
          >
            {col.items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <SortableCard id={item.id}>
                  {renderCard(item, col.id)}
                </SortableCard>
              </motion.div>
            ))}
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay>
        {activeId && activeItem && activeColumn ? (
          <div style={{ opacity: 0.9, transform: 'scale(1.03)', cursor: 'grabbing' }}>
            {renderCard(activeItem, activeColumn.id)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
