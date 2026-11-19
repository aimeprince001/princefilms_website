import { SERIES } from "@/data/catalog";
import { CatalogueView } from "@/components/catalog/CatalogueView";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function SeriesPage() {
  useDocumentTitle("Series");

  return (
    <CatalogueView
      heading="Series"
      description="Long-form series with season and episode lists. Every episode is dubbed by the same interpreter."
      baseTitles={SERIES}
      lockedKind="series"
    />
  );
}
