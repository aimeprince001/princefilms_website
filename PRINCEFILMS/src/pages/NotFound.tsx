import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";\nimport { useLanguage } from "@/context/LanguageContext";

export function NotFound() {
  const { t } = useLanguage();\n  useDocumentTitle(t("pageNotFound"));

  return (
    <div className="page-shell py-16">
      <EmptyState
        icon={Compass}
        title={t("pageNotFound")}
        description={t("pageNotFoundDesc")}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/" className={buttonClass({ size: "md" })}>
              {t("backHome")}
            </Link>
            <Link to="/movies" className={buttonClass({ variant: "outline", size: "md" })}>
              {t("browseMovies")}
            </Link>
          </div>
        }
      />
    </div>
  );
}
