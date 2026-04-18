import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export interface RsvCommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect?: () => void;
}

export interface RsvCommandGroup {
  heading: string;
  items: RsvCommandItem[];
}

export interface RsvCommandBarProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  groups?: RsvCommandGroup[];
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  "data-testid"?: string;
}

export function RsvCommandBar({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  groups = [],
  placeholder = "Buscar ou executar um comando...",
  emptyMessage = "Nenhum resultado encontrado.",
  className,
  "data-testid": testId = "rsv-command-bar",
}: RsvCommandBarProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  function setOpen(next: boolean) {
    setInternalOpen(next);
    onOpenChange?.(next);
  }

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
      >
        <div data-testid={testId} className={cn(className)}>
          <CommandInput
            data-testid={`${testId}-input`}
            placeholder={placeholder}
          />
          <CommandList data-testid={`${testId}-list`}>
            <CommandEmpty data-testid={`${testId}-empty`}>
              {emptyMessage}
            </CommandEmpty>
            {groups.map((group, gi) => (
              <React.Fragment key={gi}>
                {gi > 0 && <CommandSeparator />}
                <CommandGroup
                  data-testid={`${testId}-group-${gi}`}
                  heading={group.heading}
                >
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.id}
                      data-testid={`${testId}-item-${item.id}`}
                      value={item.label}
                      onSelect={() => {
                        item.onSelect?.();
                        setOpen(false);
                      }}
                    >
                      {item.icon && (
                        <span className="mr-2 h-4 w-4 flex items-center justify-center shrink-0">
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}

export function useRsvCommandBar() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { open, setOpen };
}

