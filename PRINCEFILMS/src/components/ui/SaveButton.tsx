import { Bookmark, BookmarkCheck } from "lucide-react";
import { useLibrary } from "@/context/LibraryContext";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/Button";

export function SaveButton({
  titleId,
  title,
  variant = "icon",
  className,
}: {
  titleId: string;
  title?: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { isSaved, toggleSaved } = useLibrary();
  const saved = isSaved(titleId);
  const label = saved ? "Remove from My List" : "Save to My List";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggleSaved(titleId)}
        aria-pressed={saved}
        className={buttonClass({ variant: saved ? "secondary" : "outline", size: "md", className })}
      >
        {saved ? (
          <BookmarkCheck size={17} aria-hidden="true" />
        ) : (
          <Bookmark size={17} aria-hidden="true" />
        )}
        {saved ? "In My List" : "Add to My List"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleSaved(titleId)}
      aria-pressed={saved}
      aria-label={title ? `${label}: ${title}` : label}
      title={label}
      className={cn(
        buttonClass({
          variant: "secondary",
          size: "sm",
          className: "!size-9 !px-0 backdrop-blur-md",
        }),
        saved && "!border-brand-400/60 !bg-brand-600 text-white",
        className,
      )}
    >
      {saved ? (
        <Bookmark size={15} className="fill-current" aria-hidden="true" />
      ) : (
        <Bookmark size={15} aria-hidden="true" />
      )}
    </button>
  );
}
