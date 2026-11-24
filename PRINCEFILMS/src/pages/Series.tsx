import { SERIES } from "@/data/catalog";
import { CatalogueView } from "@/components/catalog/CatalogueView";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useLanguage } from "@/context/LanguageContext";

export function SeriesPage() {
  const { t } = useLanguage();
  useDocumentTitle(t("series"));

  return (
    <CatalogueView
      heading={t("series")}
      description="Long-form series with season and episode lists. Every episode is dubbed by the same interpreter."
      baseTitles={SERIES}
      lockedKind="series"
    />
  );
}
