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
      description={t("movieDescription")}
      baseTitles={MOVIES}
      lockedKind="movie"
    />
  );
}
