import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandBarProps {
  items: CommandItem[];
  placeholder?: string;
  onClose?: () => void;
  open?: boolean;
  className?: string;
}

export const CommandBar = React.forwardRef<HTMLDivElement, CommandBarProps>(
  (
    {
      items,
      placeholder = 'Digite um comando...',
      onClose,
      open = true,
      className,
    },
    ref
  ) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredItems = items.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
    );

    const groupedItems: Record<string, CommandItem[]> = {};
    filteredItems.forEach((item) => {
      const group = item.group || 'Geral';
      if (!groupedItems[group]) {
        groupedItems[group] = [];
      }
      groupedItems[group].push(item);
    });

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose?.();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredItems.length - 1)
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          filteredItems[selectedIndex]?.onSelect();
        }
      };

      if (open) {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }
    }, [open, selectedIndex, filteredItems]);

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/50 backdrop-blur-sm',
          className
        )}
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl rounded-lg bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
            <Search size={18} className="text-slate-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={placeholder}
              className="flex-1 outline-none bg-transparent text-slate-900 placeholder-slate-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X size={18} className="text-slate-400" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-slate-600">Nenhum comando encontrado</p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([group, groupItems]) => (
                <div key={group}>
                  {group !== 'Geral' && (
                    <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                      {group}
                    </div>
                  )}
                  {groupItems.map((item, index) => {
                    const isSelected =
                      selectedIndex ===
                      filteredItems.findIndex((fi) => fi.id === item.id);

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.onSelect();
                          onClose?.();
                        }}
                        onMouseEnter={() =>
                          setSelectedIndex(
                            filteredItems.findIndex((fi) => fi.id === item.id)
                          )
                        }
                        className={cn(
                          'w-full px-4 py-3 flex items-center gap-3 transition-colors',
                          isSelected
                            ? 'bg-blue-50 border-l-2 border-blue-600'
                            : 'hover:bg-slate-50'
                        )}
                      >
                        {item.icon && (
                          <span className="flex-shrink-0 text-slate-600">
                            {item.icon}
                          </span>
                        )}
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-slate-900">
                            {item.label}
                          </p>
                          {item.description && (
                            <p className="text-xs text-slate-500">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.shortcut && (
                          <kbd className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded">
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {filteredItems.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500 flex items-center justify-between">
              <div className="flex gap-4">
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700 font-semibold">
                    ↑↓
                  </kbd>{' '}
                  Navegar
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700 font-semibold">
                    Enter
                  </kbd>{' '}
                  Selecionar
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-slate-700 font-semibold">
                    Esc
                  </kbd>{' '}
                  Fechar
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
CommandBar.displayName = 'CommandBar';
