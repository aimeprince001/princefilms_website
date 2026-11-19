import { useEffect } from "react";

const BRAND = "PRINCEFILMS";

export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${BRAND}` : `${BRAND} · Kinyarwanda film and series`;
  }, [title]);
}
