"use client";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * In-page dialog built on native <dialog>: focus is trapped, Esc closes, focus returns to the opener.
 * Bottom sheet on phones, centred on larger screens. Replaces alert/confirm/prompt (docs/rules.md).
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className="flex max-h-[88dvh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <h2 id="sheet-title" className="text-lg font-bold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="বন্ধ করুন"
              className="grid size-10 place-items-center rounded-full text-muted hover:bg-paper"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">{children}</div>
        </div>
      )}
    </dialog>
  );
}
