import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <div className="page-shell py-16">
      <EmptyState
        icon={Compass}
        title="This page is not in the catalogue"
        description="The link is out of date, or the page was moved. The catalogue, the interpreter list and your saved titles are all one tap from the navigation."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/" className={buttonClass({ size: "md" })}>
              Back to home
            </Link>
            <Link to="/movies" className={buttonClass({ variant: "outline", size: "md" })}>
              Browse movies
            </Link>
          </div>
        }
      />
    </div>
  );
}
