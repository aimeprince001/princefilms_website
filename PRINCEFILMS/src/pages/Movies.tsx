import { MOVIES } from "@/data/catalog";
import { CatalogueView } from "@/components/catalog/CatalogueView";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function MoviesPage() {
  useDocumentTitle("Movies");

  return (
    <CatalogueView
      heading="Movies"
      description="Feature films dubbed in Kinyarwanda. Filter by interpreter, category, release year or length."
      baseTitles={MOVIES}
      lockedKind="movie"
    />
  );
}
