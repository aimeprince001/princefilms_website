import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, Film, LayoutDashboard, LogOut, Plus, RefreshCw, Search, ShieldCheck, Trash2, Pencil, Eye, EyeOff, Clapperboard, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import "./Admin.css";

const ENDPOINT = (import.meta.env.VITE_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1").replace(/\/$/, "");
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "6b06ada200214ac45e1c";
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";
const TABLE_ID = import.meta.env.VITE_APPWRITE_FILMS_TABLE_ID || "films";
const ADMIN_TEAM_ID = import.meta.env.VITE_APPWRITE_ADMIN_TEAM_ID || "";

type FilmRecord = {
  $id: string; $createdAt?: string; data: Record<string, unknown>;
};
type FilmForm = {
  title: string; description: string; genre: string; releaseYear: string; posterId: string;
  videoUrl: string; language: string; quality: string; published: boolean; duration: string;
  rating: string; director: string; cast: string; featured: boolean; trailerUrl: string;
  subtitleLanguages: string; views: string;
};
const emptyForm: FilmForm = {
  title: "", description: "", genre: "", releaseYear: "", posterId: "", videoUrl: "",
  language: "English", quality: "HD", published: false, duration: "", rating: "",
  director: "", cast: "", featured: false, trailerUrl: "", subtitleLanguages: "", views: "0",
};
const rowPath = (id = "") => "/tablesdb/" + encodeURIComponent(DATABASE_ID) + "/tables/" + encodeURIComponent(TABLE_ID) + "/rows" + (id ? "/" + encodeURIComponent(id) : "");

async function appwrite(path: string, method = "GET", body?: unknown) {
  const response = await fetch(ENDPOINT + path, {
    method, credentials: "include",
    headers: { "X-Appwrite-Project": PROJECT_ID, "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || result.type || "Appwrite request failed (" + response.status + ").");
  return result;
}

function toForm(record?: FilmRecord): FilmForm {
  const d = record?.data ?? {};
  const text = (key: string, fallback = "") => d[key] == null ? fallback : String(d[key]);
  return {
    ...emptyForm, title: text("title"), description: text("description"), genre: text("genre"),
    releaseYear: text("releaseYear"), posterId: text("posterId"), videoUrl: text("videoUrl"),
    language: text("language", "English"), quality: text("quality", "HD"),
    published: Boolean(d.published), duration: text("duration"), rating: text("rating"),
    director: text("director"), cast: Array.isArray(d.cast) ? d.cast.join(", ") : text("cast"),
    featured: Boolean(d.featured), trailerUrl: text("trailerUrl"),
    subtitleLanguages: Array.isArray(d.subtitleLanguages) ? d.subtitleLanguages.join(", ") : text("subtitleLanguages"),
    views: text("views", "0"),
  };
}
function toData(form: FilmForm, createdBy = "") {
  return {
    title: form.title.trim(), description: form.description.trim(), genre: form.genre.trim(),
    releaseYear: form.releaseYear ? Number(form.releaseYear) : null, posterId: form.posterId.trim(),
    videoUrl: form.videoUrl.trim(), language: form.language.trim(), quality: form.quality,
    published: form.published, duration: form.duration ? Number(form.duration) : null,
    rating: form.rating || "", director: form.director.trim(),
    cast: form.cast.trim(), featured: form.featured,
    trailerUrl: form.trailerUrl.trim(),
    subtitleLanguages: form.subtitleLanguages.trim(),
    views: Number(form.views || 0), createdBy,
  };
}

export function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [adminUserId, setAdminUserId] = useState("");
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [films, setFilms] = useState<FilmRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<FilmRecord | null>(null);
  const [form, setForm] = useState<FilmForm>(emptyForm);
  const [showEditor, setShowEditor] = useState(false);

  const loadFilms = useCallback(async () => {
    const query = "?queries[]=" + encodeURIComponent('limit(100)');
    const result = await appwrite(rowPath() + query);
    setFilms((result.rows || []) as FilmRecord[]);
  }, []);

  const verifyAdmin = useCallback(async () => {
    if (!DATABASE_ID || !ADMIN_TEAM_ID) {
      setError("Admin setup is incomplete. Set VITE_APPWRITE_DATABASE_ID and VITE_APPWRITE_ADMIN_TEAM_ID in your deployment environment.");
      setChecking(false);
      return;
    }
    try {
      const user = await appwrite("/account");\n      setAdminUserId(String(user.$id || ""));
      const query = "?queries[]=" + encodeURIComponent('equal(userId,"' + user.$id + '")');
      const memberships = await appwrite("/teams/" + encodeURIComponent(ADMIN_TEAM_ID) + "/memberships" + query);
      const allowed = (memberships.memberships || []).some((membership: { roles?: string[] }) =>
        (membership.roles || []).some((role) => role.toLowerCase() === "admin" || role.toLowerCase().includes("admin")),
      );
      if (!allowed) {
        setError("This account is not an administrator of the PRINCEFILMS admin team.");
        setSignedIn(false);
        return;
      }
      setSignedIn(true);
      setError("");
      await loadFilms();
    } catch {
      setSignedIn(false);
    } finally {
      setChecking(false);
    }
  }, [loadFilms]);

  useEffect(() => { void verifyAdmin(); }, [verifyAdmin]);

  const visibleFilms = useMemo(() => films.filter((film) => {
    const d = film.data || {};
    const matches = String(d.title || "").toLowerCase().includes(search.toLowerCase());
    const status = filter === "all" || (filter === "published" && d.published) || (filter === "draft" && !d.published);
    return matches && status;
  }), [films, search, filter]);

  const beginCreate = () => { setEditing(null); setForm(emptyForm); setShowEditor(true); setError(""); };
  const beginEdit = (film: FilmRecord) => { setEditing(film); setForm(toForm(film)); setShowEditor(true); setError(""); };
  const change = (key: keyof FilmForm, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const saveFilm = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) { setError("Film title is required."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      if (editing) {
        await appwrite(rowPath(editing.$id), "PATCH", { data: toData(form, String(editing.data.createdBy || adminUserId)) });
        setNotice("Film updated successfully.");
      } else {
        await appwrite(rowPath(), "POST", { rowId: "unique()", data: toData(form, adminUserId) });
        setNotice("Film added successfully.");
      }
      await loadFilms(); setShowEditor(false); setEditing(null);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save this film."); }
    finally { setBusy(false); }
  };

  const deleteFilm = async (film: FilmRecord) => {
    if (!window.confirm('Delete "' + String(film.data.title || "this film") + '" permanently?')) return;
    setBusy(true); setError(""); setNotice("");
    try { await appwrite(rowPath(film.$id), "DELETE"); await loadFilms(); setNotice("Film deleted."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete this film."); }
    finally { setBusy(false); }
  };

  const logout = async () => {
    try { await appwrite("/account/sessions/current", "DELETE"); } catch { /* Clear the view even if the session already expired. */ }
    setSignedIn(false); setFilms([]); setPassword("");
  };

  if (checking) return <div className="pf-admin-loading"><LoaderCircle className="animate-spin" /> Checking administrator access…</div>;

  if (!signedIn) return (
    <div className="pf-admin-login-wrap">
      <div className="pf-admin-login panel">
        <Link to="/" className="pf-admin-back"><ArrowLeft size={15} /> Back to PRINCEFILMS</Link>
        <div className="pf-admin-mark"><ShieldCheck size={27} /></div>
        <p className="pf-admin-eyebrow">RESTRICTED AREA</p>
        <h1>Admin sign in</h1>
        <p className="pf-admin-sub">Sign in with your Appwrite account. Only members with the admin role in the configured team can access the dashboard.</p>
        <form onSubmit={async (event) => {
          event.preventDefault(); setBusy(true); setError("");
          try {
            await appwrite("/account/sessions/email", "POST", { email, password });
            await verifyAdmin();
          } catch (caught) { setError(caught instanceof Error ? caught.message : "Sign in failed."); }
          finally { setBusy(false); }
        }} className="pf-admin-form">
          <label>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" placeholder="admin@example.com" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="Your Appwrite password" /></label>
          {error && <p className="pf-admin-error">{error}</p>}
          <button className="pf-admin-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in securely"}</button>
        </form>
        <p className="pf-admin-footnote">Admin access is verified against your Appwrite team membership.</p>
      </div>
    </div>
  );

  return (
    <div className="pf-admin-shell">
      <aside className="pf-admin-sidebar">
        <Link to="/" className="pf-admin-brand"><span><Clapperboard size={21} /></span><b>PRINCE<span>FILMS</span></b></Link>
        <div className="pf-admin-side-label">WORKSPACE</div>
        <div className="pf-admin-nav active"><LayoutDashboard size={17} /> Overview</div>
        <div className="pf-admin-nav"><Film size={17} /> Film library <span>{films.length}</span></div>
        <div className="pf-admin-side-bottom">
          <Link to="/" className="pf-admin-nav"><ArrowLeft size={17} /> View website</Link>
          <button className="pf-admin-nav" onClick={logout}><LogOut size={17} /> Sign out</button>
        </div>
      </aside>
      <main className="pf-admin-main">
        <header className="pf-admin-topbar">
          <div><p className="pf-admin-eyebrow">CONTENT MANAGEMENT</p><h1>Dashboard</h1></div>
          <div className="pf-admin-top-actions"><span className="pf-admin-live"><i /> Appwrite connected</span><button className="pf-admin-icon-btn" onClick={() => void loadFilms()} title="Refresh films"><RefreshCw size={17} /></button><button className="pf-admin-primary pf-admin-add" onClick={beginCreate}><Plus size={17} /> Add film</button></div>
        </header>
        {notice && <div className="pf-admin-notice">{notice}</div>}
        {error && <div className="pf-admin-error pf-admin-alert">{error}</div>}
        <section className="pf-admin-stats">
          <div className="pf-admin-stat"><span>Total films</span><strong>{films.length}</strong><small>Records in your Films table</small></div>
          <div className="pf-admin-stat"><span>Published</span><strong>{films.filter((f) => f.data.published).length}</strong><small>Visible in the catalogue</small></div>
          <div className="pf-admin-stat"><span>Drafts</span><strong>{films.filter((f) => !f.data.published).length}</strong><small>Not yet published</small></div>
          <div className="pf-admin-stat"><span>Featured</span><strong>{films.filter((f) => f.data.featured).length}</strong><small>Highlighted titles</small></div>
        </section>
        <section className="pf-admin-library panel">
          <div className="pf-admin-library-head"><div><h2>Film library</h2><p>Manage titles, streaming links and publication status.</p></div>
            <div className="pf-admin-search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search films…" /></div>
          </div>
          <div className="pf-admin-filters">{(["all", "published", "draft"] as const).map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? "selected" : ""}>{item === "all" ? "All titles" : item === "published" ? "Published" : "Drafts"}</button>)}</div>
          <div className="pf-admin-table-wrap"><table className="pf-admin-table"><thead><tr><th>Film</th><th>Genre</th><th>Year</th><th>Status</th><th>Featured</th><th>Actions</th></tr></thead><tbody>
            {visibleFilms.map((film) => <tr key={film.$id}><td><div className="pf-admin-film-title"><div className="pf-admin-poster"><Film size={18} /></div><div><b>{String(film.data.title || "Untitled")}</b><small>{String(film.data.language || "—")} · {String(film.data.quality || "—")}</small></div></div></td><td>{String(film.data.genre || "—")}</td><td>{String(film.data.releaseYear || "—")}</td><td><span className={"pf-admin-status " + (film.data.published ? "published" : "draft")}>{film.data.published ? <><Eye size={13} /> Published</> : <><EyeOff size={13} /> Draft</>}</span></td><td>{film.data.featured ? "Yes" : "—"}</td><td><div className="pf-admin-row-actions"><button onClick={() => beginEdit(film)} title="Edit film"><Pencil size={15} /></button><button onClick={() => void deleteFilm(film)} title="Delete film" disabled={busy}><Trash2 size={15} /></button></div></td></tr>)}
            {!visibleFilms.length && <tr><td colSpan={6} className="pf-admin-empty">No films found. Add a title to get started.</td></tr>}
          </tbody></table></div>
        </section>
        <p className="pf-admin-bottom-note">Changes are saved directly to your Appwrite Films table.</p>
      </main>

      {showEditor && <div className="pf-admin-modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowEditor(false); }}>
        <section className="pf-admin-editor panel" role="dialog" aria-modal="true" aria-labelledby="pf-editor-title">
          <header><div><p className="pf-admin-eyebrow">{editing ? "UPDATE TITLE" : "NEW TITLE"}</p><h2 id="pf-editor-title">{editing ? "Edit film" : "Add a film"}</h2></div><button className="pf-admin-icon-btn" onClick={() => setShowEditor(false)} aria-label="Close editor">×</button></header>
          <form onSubmit={saveFilm} className="pf-admin-editor-form">
            <label className="wide">Film title *<input value={form.title} onChange={(e) => change("title", e.target.value)} required maxLength={255} /></label>
            <label className="wide">Description<textarea value={form.description} onChange={(e) => change("description", e.target.value)} rows={3} maxLength={5000} /></label>
            <label>Genre<input value={form.genre} onChange={(e) => change("genre", e.target.value)} placeholder="Drama, Action…" /></label>
            <label>Release year<input type="number" min="1888" max="2100" value={form.releaseYear} onChange={(e) => change("releaseYear", e.target.value)} /></label>
            <label>Language<input value={form.language} onChange={(e) => change("language", e.target.value)} /></label>
            <label>Quality<select value={form.quality} onChange={(e) => change("quality", e.target.value)}><option>SD</option><option>HD</option><option>Full HD</option><option>4K</option></select></label>
            <label>Duration (minutes)<input type="number" min="0" value={form.duration} onChange={(e) => change("duration", e.target.value)} /></label>
            <label>Rating<input type="number" min="0" max="10" step="0.1" value={form.rating} onChange={(e) => change("rating", e.target.value)} /></label>
            <label>Director<input value={form.director} onChange={(e) => change("director", e.target.value)} /></label>
            <label>Cast (comma-separated)<input value={form.cast} onChange={(e) => change("cast", e.target.value)} /></label>
            <label className="wide">Poster storage file ID<input value={form.posterId} onChange={(e) => change("posterId", e.target.value)} placeholder="Appwrite Storage file ID" /></label>
            <label className="wide">Video URL<input type="url" value={form.videoUrl} onChange={(e) => change("videoUrl", e.target.value)} placeholder="https://…" /></label>
            <label className="wide">Trailer URL<input type="url" value={form.trailerUrl} onChange={(e) => change("trailerUrl", e.target.value)} placeholder="https://…" /></label>
            <label className="wide">Subtitle languages (comma-separated)<input value={form.subtitleLanguages} onChange={(e) => change("subtitleLanguages", e.target.value)} placeholder="English, Kinyarwanda, French" /></label>
            <div className="pf-admin-checks"><label><input type="checkbox" checked={form.published} onChange={(e) => change("published", e.target.checked)} /> Publish title</label><label><input type="checkbox" checked={form.featured} onChange={(e) => change("featured", e.target.checked)} /> Feature on homepage</label></div>
            {error && <p className="pf-admin-error wide">{error}</p>}
            <footer><button type="button" className="pf-admin-secondary" onClick={() => setShowEditor(false)}>Cancel</button><button className="pf-admin-primary" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create film"}</button></footer>
          </form>
        </section>
      </div>}
    </div>
  );
}
