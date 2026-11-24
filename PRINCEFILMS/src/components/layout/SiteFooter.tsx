import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { CATEGORIES, TITLES, INTERPRETERS } from "@/data/catalog";
import { Logo } from "@/components/layout/Logo";
import { useLanguage } from "@/context/LanguageContext";

const CONTACT = {
  phone: "+250 786030186",
  email: "aimprince21@gmail.com",
};

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 border-t border-white/[0.07] bg-ink-900/70 pb-16 md:pb-0">
      <div className="page-shell py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/45">
              {t("footerDescription")}
            </p>
            <ul className="mt-5 space-y-2 text-[12.5px] text-white/45">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-brand-300" aria-hidden="true" />
                Nyamata, Bugesera
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brand-300" aria-hidden="true" />
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-brand-300" aria-hidden="true" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-labelledby="footer-browse">
            <h2 id="footer-browse" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Browse
            </h2>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li>
                <Link to="/movies" className="text-white/60 transition-colors hover:text-white">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/series" className="text-white/60 transition-colors hover:text-white">
                  Series
                </Link>
              </li>
              <li>
                <Link to="/interpreters" className="text-white/60 transition-colors hover:text-white">
                  Interpreters
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-white/60 transition-colors hover:text-white">
                  Search
                </Link>
              </li>
              <li className="pt-1 text-[11.5px] text-white/30">
                {TITLES.length} titles · {INTERPRETERS.length} interpreters
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-categories">
            <h2
              id="footer-categories"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35"
            >
              Categories
            </h2>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-account">
            <h2 id="footer-account" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Account
            </h2>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li>
                <Link to="/my-list" className="text-white/60 transition-colors hover:text-white">
                  My List
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white/60 transition-colors hover:text-white">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-white/60 transition-colors hover:text-white">
                  Create an account
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/60 transition-colors hover:text-white">
                  Contact us
                </Link>
              </li>
            </ul>
            <p className="mt-5 text-[11.5px] leading-relaxed text-white/30">
              {t("subtitles")}
            </p>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/[0.07] pt-6 text-[11.5px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 PRINCEFILMS. All rights reserved.</p>
          <p>Made by : Cyuzuzo Aime Prince</p>
        </div>
      </div>
    </footer>
  );
}
