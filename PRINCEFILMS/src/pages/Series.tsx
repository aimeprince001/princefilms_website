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
      description={t("seriesDescription")}
      baseTitles={SERIES}
      lockedKind="series"
    />
  );
}
