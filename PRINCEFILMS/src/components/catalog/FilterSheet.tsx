import { X } from "lucide-react";
import { useEffect } from "react";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import type { Filters } from "@/lib/catalogue";
import { FilterFields } from "@/components/catalog/FilterPanel";
import { useLanguage } from "@/context/LanguageContext";

export function FilterSheet({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  resultCount,
  showDuration,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onClear: () => void;
  resultCount: number;
  showDuration?: boolean;
}) {
  const { t } = useLanguage();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label={t("closeSearch")}
        onClick={onClose}
        className="absolute inset-0 bg-[#040308]/75 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("filters")}
        className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-2xl border-t border-white/10 bg-ink-900"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
          <h2 className="font-display text-[15px] text-text">{t("filters")}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeSearch")}
            className="grid size-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <FilterFields filters={filters} onChange={onChange} showDuration={showDuration} />
        </div>

        <div className="flex items-center gap-2 border-t border-white/[0.08] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClear}
            className="h-11 flex-1 rounded-xl border border-white/15 text-[13px] font-medium text-white/70 hover:bg-white/5"
          >
            {t("clearAll")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-[1.6] rounded-xl bg-brand-500 text-[13px] font-semibold text-white hover:bg-brand-400"
          >
            {t("showResults")} {resultCount} {t("title")}
          </button>
        </div>
      </div>
    </div>
  );
}
