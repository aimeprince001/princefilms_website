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
                className="group block rounded-2xl border border-white/[0.07] bg-ink-850 p-5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.03]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={interpreter.avatar}
                    alt={interpreter.name}
                    className="size-14 shrink-0 rounded-full object-cover ring-2 ring-inset ring-white/10"
                  />
                  <div className="min-w-0">
                    <span className="block truncate font-display text-[18px] leading-tight text-text">
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
