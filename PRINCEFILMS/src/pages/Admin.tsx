import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Film, LogOut, Save, Trash2 } from "lucide-react";

type FilmRow = { id:string; title:string; slug:string; year:number; synopsis:string; category_ids:string[]; interpreter_id:string; runtime:number; poster_url:string; trailer_url:string; video_url:string; audio_language:string; subtitles:string[]; quality:"HD"|"4K"; released_at:string; featured:boolean; published:boolean };
const url=(import.meta.env.VITE_SUPABASE_URL as string|undefined)?.replace(/\/$/,"");
const key=import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined;
const admin=(import.meta.env.VITE_ADMIN_EMAIL as string|undefined)?.toLowerCase();
const categories=["action","drama","comedy","thriller","adventure","crime","music","romance"];
const interpreters=[["rocky","Rocky Kimomo"],["junior","Junior Giti"],["sankara","Sankara Da Premier"],["gaheza","Gaheza Simba"],["yanga","Yanga"],["bthegreat","B The Great"],["masterp","Master P"],["savimbi","Savimbi"],["pk","Pk The Sound"],["senior","Senior"]];
const fresh=()=>({title:"",slug:"",year:new Date().getFullYear(),synopsis:"",category_ids:["action"],interpreter_id:"rocky",runtime:100,poster_url:"",trailer_url:"",video_url:"",audio_language:"Kinyarwanda",subtitles:["English"],quality:"HD" as const,released_at:new Date().toISOString().slice(0,10),featured:false,published:false});
type Draft=ReturnType<typeof fresh>;
export function AdminPage(){
 const [token,setToken]=useState(""); const [email,setEmail]=useState(admin??""); const [password,setPassword]=useState("");
 const [rows,setRows]=useState<FilmRow[]>([]); const [draft,setDraft]=useState<Draft>(fresh); const [edit,setEdit]=useState("");
 const [poster,setPoster]=useState<File|null>(null); const [video,setVideo]=useState<File|null>(null); const [busy,setBusy]=useState(false); const [notice,setNotice]=useState("");
 const ready=Boolean(url&&key&&admin);
 async function request(path:string,init:RequestInit={}){
  const r=await fetch(url+path,{...init,headers:{apikey:key!,Authorization:"Bearer "+token,"Content-Type":"application/json",...(init.headers??{})}});
  if(!r.ok)throw new Error(await r.text()); return r.status===204?null:r.json();
 }
 async function refresh(){setRows(await request("/rest/v1/films?select=*&order=created_at.desc"));}
 useEffect(()=>{if(token)refresh().catch(e=>setNotice(e.message));},[token]);
 async function login(e:FormEvent){e.preventDefault();setBusy(true);setNotice("");try{
  if(!ready)throw new Error("Configure Supabase URL, anon key and admin email first.");
  if(email.trim().toLowerCase()!==admin)throw new Error("This email is not the configured administrator.");
  const r=await fetch(url+"/auth/v1/token?grant_type=password",{method:"POST",headers:{apikey:key!,"Content-Type":"application/json"},body:JSON.stringify({email,password})});
  const data=await r.json();if(!r.ok)throw new Error(data.msg||data.message||"Sign-in failed.");
  if(data.user?.email?.toLowerCase()!==admin)throw new Error("Administrator account mismatch.");setToken(data.access_token);setPassword("");
 }catch(e){setNotice(e instanceof Error?e.message:"Sign-in failed.");}finally{setBusy(false);}}
 async function upload(file:File,folder:string){const path=folder+"/"+Date.now()+"-"+file.name.replace(/[^\w.-]/g,"_");const r=await fetch(url+"/storage/v1/object/film-media/"+path,{method:"POST",headers:{apikey:key!,Authorization:"Bearer "+token,"Content-Type":file.type},body:file});if(!r.ok)throw new Error(await r.text());return url+"/storage/v1/object/public/film-media/"+path;}
 function clear(){setDraft(fresh());setEdit("");setPoster(null);setVideo(null);}
 async function save(e:FormEvent){e.preventDefault();setBusy(true);setNotice("");try{
  if(!draft.title.trim()||!draft.synopsis.trim()||!draft.trailer_url.trim()||!draft.category_ids.length)throw new Error("Title, synopsis, trailer and category are required.");
  const d={...draft,slug:draft.slug.trim()||draft.title.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")};
  if(poster)d.poster_url=await upload(poster,"posters");if(video)d.video_url=await upload(video,"videos");
  if(!d.poster_url||!d.video_url)throw new Error("Provide a poster and full-film URL, or upload both files.");
  await request("/rest/v1/films"+(edit?"?id=eq."+encodeURIComponent(edit):""),{method:edit?"PATCH":"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify(d)});
  await refresh();clear();setNotice("Film saved to the catalogue database.");}catch(e){setNotice(e instanceof Error?e.message:"Could not save.");}finally{setBusy(false);}}
 async function remove(id:string){if(!confirm("Delete this film record?"))return;try{await request("/rest/v1/films?id=eq."+encodeURIComponent(id),{method:"DELETE",headers:{Prefer:"return=minimal"}});await refresh();setNotice("Film deleted.");}catch(e){setNotice(e instanceof Error?e.message:"Delete failed.");}}
 function editRow(r:FilmRow){setEdit(r.id);setDraft({...r});setPoster(null);setVideo(null);window.scrollTo({top:0,behavior:"smooth"});}
 async function publish(r:FilmRow){try{await request("/rest/v1/films?id=eq."+r.id,{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify({published:!r.published})});await refresh();}catch(e){setNotice(e instanceof Error?e.message:"Status change failed.");}}
 const field="admin-field";
 if(!token)return <section className="page-shell py-16"><div className="panel mx-auto max-w-md p-8"><ShieldCheck className="mb-4 text-brand-300" size={30}/><p className="text-xs uppercase tracking-[.2em] text-brand-300">PRINCEFILMS CONTROL ROOM</p><h1 className="mt-3 text-3xl">Admin sign in</h1><p className="mt-2 text-sm text-slate-400">Manage films, trailers, interpreters and publishing.</p>{!ready&&<p className="mt-4 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">Admin service is not configured. Follow ADMIN_SETUP.md.</p>}<form onSubmit={login} className="mt-6 space-y-4"><label className="block text-sm">Email<input className={field} type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label className="block text-sm">Password<input className={field} type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button disabled={busy} className="w-full rounded-xl bg-brand-500 p-3 font-semibold">{busy?"Signing in…":"Sign in"}</button></form>{notice&&<p role="status" className="mt-4 break-words text-sm text-brand-200">{notice}</p>}<Link to="/" className="mt-5 inline-block text-sm text-slate-400">← Back to site</Link></div></section>;
 return <section className="page-shell py-8"><header className="mb-6 flex flex-wrap justify-between gap-3"><div><p className="text-xs uppercase tracking-[.2em] text-brand-300">PRINCEFILMS STUDIO</p><h1 className="mt-2 text-3xl">Film administration</h1><p className="text-sm text-slate-400">{rows.length} titles · {rows.filter(r=>r.published).length} published · {rows.filter(r=>!r.published).length} drafts</p></div><button onClick={()=>setToken("")} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2"><LogOut size={16}/> Sign out</button></header>
 {notice&&<p role="status" className="mb-4 rounded-xl bg-brand-500/10 p-3 text-sm text-brand-100">{notice}</p>}
 <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]"><form onSubmit={save} className="panel space-y-4 p-5"><div className="flex justify-between"><h2 className="text-xl">{edit?"Edit film":"Add new film"}</h2>{edit&&<button type="button" onClick={clear} className="text-sm text-slate-400">Cancel</button>}</div>
 <div className="grid gap-3 sm:grid-cols-2">
 <label className="text-sm sm:col-span-2">Film title *<input className={field} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} required/></label>
 <label className="text-sm">Slug<input className={field} value={draft.slug} onChange={e=>setDraft({...draft,slug:e.target.value})} placeholder="Auto-generated"/></label>
 <label className="text-sm">Year<input className={field} type="number" value={draft.year} onChange={e=>setDraft({...draft,year:+e.target.value})} required/></label>
 <label className="text-sm">Release date<input className={field} type="date" value={draft.released_at} onChange={e=>setDraft({...draft,released_at:e.target.value})}/></label>
 <label className="text-sm">Runtime (minutes)<input className={field} type="number" min="1" value={draft.runtime} onChange={e=>setDraft({...draft,runtime:+e.target.value})}/></label>
 <label className="text-sm">Interpreter<select className={field} value={draft.interpreter_id} onChange={e=>setDraft({...draft,interpreter_id:e.target.value})}>{interpreters.map(([id,n])=><option key={id} value={id}>{n}</option>)}</select></label>
 <label className="text-sm">Audio language<input className={field} value={draft.audio_language} onChange={e=>setDraft({...draft,audio_language:e.target.value})}/></label>
 <label className="text-sm">Quality<select className={field} value={draft.quality} onChange={e=>setDraft({...draft,quality:e.target.value as "HD"|"4K"})}><option>HD</option><option>4K</option></select></label>
 <fieldset className="sm:col-span-2"><legend className="mb-2 text-sm">Categories *</legend><div className="flex flex-wrap gap-2">{categories.map(c=><label key={c} className="rounded-lg border border-white/10 px-3 py-2 text-xs capitalize"><input type="checkbox" checked={draft.category_ids.includes(c)} onChange={e=>setDraft({...draft,category_ids:e.target.checked?[...draft.category_ids,c]:draft.category_ids.filter(x=>x!==c)})}/> {c}</label>)}</div></fieldset>
 <label className="text-sm sm:col-span-2">Synopsis *<textarea className={field+" min-h-24"} value={draft.synopsis} onChange={e=>setDraft({...draft,synopsis:e.target.value})} required/></label>
 <label className="text-sm sm:col-span-2">Poster URL<input className={field} type="url" value={draft.poster_url} onChange={e=>setDraft({...draft,poster_url:e.target.value})}/></label>
 <label className="text-sm sm:col-span-2">Upload poster<input className={field} type="file" accept="image/*" onChange={e=>setPoster(e.target.files?.[0]??null)}/></label>
 <label className="text-sm sm:col-span-2">Trailer URL *<input className={field} type="url" value={draft.trailer_url} onChange={e=>setDraft({...draft,trailer_url:e.target.value})} placeholder="YouTube/Vimeo/MP4" required/></label>
 <label className="text-sm sm:col-span-2">Full film URL<input className={field} type="url" value={draft.video_url} onChange={e=>setDraft({...draft,video_url:e.target.value})}/></label>
 <label className="text-sm sm:col-span-2">Upload full film<input className={field} type="file" accept="video/*" onChange={e=>setVideo(e.target.files?.[0]??null)}/><span className="text-xs text-slate-500">Large films should be hosted on a video CDN.</span></label>
 <label className="text-sm sm:col-span-2">Subtitles, comma-separated<input className={field} value={draft.subtitles.join(", ")} onChange={e=>setDraft({...draft,subtitles:e.target.value.split(",").map(x=>x.trim()).filter(Boolean)})}/></label>
 </div><div className="flex flex-wrap gap-4 border-t border-white/10 pt-4"><label className="text-sm"><input type="checkbox" checked={draft.featured} onChange={e=>setDraft({...draft,featured:e.target.checked})}/> Featured</label><label className="text-sm"><input type="checkbox" checked={draft.published} onChange={e=>setDraft({...draft,published:e.target.checked})}/> Published</label></div><button disabled={busy} className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 font-semibold"><Save size={16}/>{busy?"Saving…":edit?"Update film":"Save film"}</button></form>
 <aside className="panel p-5"><h2 className="mb-4 text-xl">Catalogue</h2><div className="space-y-3">{rows.map(r=><article key={r.id} className="flex gap-3 rounded-xl border border-white/10 p-3">{r.poster_url?<img src={r.poster_url} alt="" className="h-20 w-14 rounded-lg object-cover"/>:<div className="flex h-20 w-14 items-center justify-center rounded-lg bg-white/5"><Film/></div>}<div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold">{r.title}</h3><p className="text-xs text-slate-400">{r.year} · {r.quality} · {r.runtime} min</p><p className="mt-1 text-xs">{r.published?"Published":"Draft"}</p><div className="mt-2 flex flex-wrap gap-3 text-xs"><button type="button" onClick={()=>editRow(r)} className="text-brand-200">Edit</button><button type="button" onClick={()=>publish(r)}>{r.published?"Unpublish":"Publish"}</button><button type="button" onClick={()=>remove(r.id)} className="text-rose-300"><Trash2 size={12} className="inline"/> Delete</button></div></div></article>)}{!rows.length&&<p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-slate-400">Your films will appear here after database setup.</p>}</div></aside></div></section>;
}
