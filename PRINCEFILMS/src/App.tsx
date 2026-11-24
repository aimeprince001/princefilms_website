import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { LibraryProvider } from "@/context/LibraryContext";
import { SearchProvider } from "@/context/SearchContext";
import { PlayerProvider } from "@/context/PlayerContext";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { SearchCommand } from "@/components/search/SearchCommand";
import { Home } from "@/pages/Home";
import { MoviesPage } from "@/pages/Movies";
import { SeriesPage } from "@/pages/Series";
import { CategoryPage } from "@/pages/Category";
import { InterpretersPage } from "@/pages/Interpreters";
import { InterpreterDetail } from "@/pages/InterpreterDetail";
import { TitleDetail } from "@/pages/TitleDetail";
import { SearchResults } from "@/pages/SearchResults";
import { MyListPage } from "@/pages/MyList";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Contact } from "@/pages/Contact";
import { Profile } from "@/pages/Profile";
import { NotFound } from "@/pages/NotFound";

function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-ink-950"
    >
      {t("skip")}
    </a>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <LibraryProvider>
        <SearchProvider>
          <BrowserRouter>
            <PlayerProvider>
              <SkipLink />

              <div className="flex min-h-screen flex-col">
                <ScrollToTop />
                <SiteHeader />

                <main id="main" className="flex-1 pt-16 pb-4 lg:pt-[68px]">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<MoviesPage />} />
                    <Route path="/series" element={<SeriesPage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/interpreters" element={<InterpretersPage />} />
                    <Route path="/interpreters/:slug" element={<InterpreterDetail />} />
                    <Route path="/movie/:id" element={<TitleDetail />} />
                    <Route path="/series/:id" element={<TitleDetail />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/my-list" element={<MyListPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>

                <SiteFooter />
                <MobileTabBar />
                <SearchCommand />
              </div>
            </PlayerProvider>
          </BrowserRouter>
        </SearchProvider>
      </LibraryProvider>
    </AuthProvider>
    </LanguageProvider>
  );
}
