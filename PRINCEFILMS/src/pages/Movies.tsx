import { MOVIES } from "@/data/catalog";
import { CatalogueView } from "@/components/catalog/CatalogueView";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLanguage } from "@/context/LanguageContext";

export function MoviesPage() {
  const { t } = useLanguage();
  useDocumentTitle(t("movies"));

  return (
    <CatalogueView
      heading={t("movies")}
      description="Feature films dubbed in Kinyarwanda. Filter by interpreter, category, release year or length."
      baseTitles={MOVIES}
      lockedKind="movie"
    />
  );
}
