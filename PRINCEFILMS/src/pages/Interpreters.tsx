import { Link } from "react-router-dom";
import { INTERPRETERS, TITLES, interpreterCounts } from "@/data/catalog";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLanguage } from "@/context/LanguageContext";

export function InterpretersPage() {
  const { t } = useLanguage();
  useDocumentTitle(t("interpreters"));

  return (
    <div className="page-shell pb-16 pt-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-[30px] leading-[1.05] text-text sm:text-[38px]">
          {t("interpreters")}
        </h1>
        <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
          {t("interpreterIntro")}
        </p>
        <p className="num mt-3 text-[12.5px] text-white/35">
          {INTERPRETERS.length} {t("interpreters")} · {TITLES.length} {t("titles")}
        </p>
      </header>

      <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INTERPRETERS.map((interpreter) => {
          const counts = interpreterCounts(interpreter.id);
          return (
            <li key={interpreter.id}>
              <Link
                to={`/interpreters/${interpreter.slug}`}
                className="group block min-h-[190px] rounded-2xl border border-brand-400/15 bg-gradient-to-br from-ink-850 via-ink-850 to-brand-900/20 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300/40 hover:shadow-[0_18px_42px_-24px_rgba(34,211,238,.38)] sm:p-8"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={interpreter.avatar}
                    alt={interpreter.name}
                    className="size-16 shrink-0 rounded-full object-cover ring-2 ring-inset ring-brand-300/25 sm:size-[72px]"
                  />
                  <div className="min-w-0">
                    <span className="block truncate font-display text-[20px] leading-tight text-text sm:text-[22px]">
                      {interpreter.name}
                    </span>
                    <span className="num mt-1 block text-[11.5px] text-white/40">
                      {interpreter.role}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="num text-[12px] text-white/50">
                    {counts.movies} {t("films")} · {counts.series} {t("series")}
                  </span>
                  <span className="num text-[12px] font-semibold text-brand-200">
                    {counts.total} {t("titles")}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 max-w-xl text-[12px] leading-relaxed text-white/30">
        {t("interpreterCredits")}
      </p>
    </div>
  );
}
