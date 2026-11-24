import { FolderX } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  CATEGORIES,
  getCategoryBySlug,
  titlesInCategory,
} from "@/data/catalog";
import { CatalogueView } from "@/components/catalog/CatalogueView";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";\nimport { useLanguage } from "@/context/LanguageContext";

export function CategoryPage() {
  const { t } = useLanguage();\n  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;

  useDocumentTitle(category ? category.name : t("category"));

  if (!category) {
    return (
      <div className="page-shell py-16">
        <EmptyState
          icon={FolderX}
          title={t("categoryNotFound")}
          description={t("categoryNotFoundDesc")}
          action={
            <Link to="/" className="inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-[13px] font-semibold text-white hover:bg-brand-400">
              {t("backHome")}
            </Link>
          }
        />
      </div>
    );
  }

  const titles = titlesInCategory(category.id);

  return (
    <div>
      <div className="page-shell flex flex-wrap items-center gap-2 pt-6 text-[12px] text-white/35">
        <Link to="/" className="hover:text-white">
          {t("home")}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-white/60">{category.name}</span>
        <span aria-hidden="true">/</span>
        <Link to={`/category/${CATEGORIES[0].slug}`} className="hover:text-white">
          {t("allCategories")}
        </Link>
      </div>

      <CatalogueView
        heading={category.name}
        description={`${category.blurb} Films and series in this category, sorted by views by default.`}
        baseTitles={titles}
        showKindSwitch
      />
    </div>
  );
}
