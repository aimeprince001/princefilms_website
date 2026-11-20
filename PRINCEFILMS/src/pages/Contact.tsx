import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const CONTACT_INFO = [
  {
    icon: <Phone size={20} />,
    title: "Call us",
    value: "+250 788 621 000",
    href: "tel:+250788621000",
    subtitle: "Mon–Sat, 9 AM – 6 PM CAT",
  },
  {
    icon: <Mail size={20} />,
    title: "Email us",
    value: "hello@princefilms.rw",
    href: "mailto:hello@princefilms.rw",
    subtitle: "Reply within 24 hours",
  },
  {
    icon: <MapPin size={20} />,
    title: "Visit us",
    value: "KG 7 Ave, Kigali, Rwanda",
    href: "https://maps.google.com/?q=KG+7+Ave,+Kigali",
    subtitle: "Prince Films Studio",
  },
];

const DEPARTMENTS = [
  { id: "general", label: "General inquiry" },
  { id: "billing", label: "Billing & payments" },
  { id: "technical", label: "Technical support" },
  { id: "partnership", label: "Partnerships & dubbing" },
  { id: "feedback", label: "Feedback & suggestions" },
];

const FAQS = [
  {
    q: "How do I watch films on PRINCEFILMS?",
    a: "Create a free account, browse our catalogue of Kinyarwanda-dubbed films and series, and press play. Subtitles are available in English, French, and Swahili on every title.",
  },
  {
    q: "Can I download titles for offline viewing?",
    a: "Offline downloads are not currently available. You need an active internet connection to stream titles on PRINCEFILMS.",
  },
  {
    q: "Is my account data stored on a server?",
    a: "No. All accounts, saved lists, and playback positions are stored locally in your browser only. Nothing is uploaded to a server.",
  },
  {
    q: "How do I reset my password?",
    a: "Go to the Sign in page, click \"Forgot password?\", and follow the recovery steps. A 6-digit code will be sent to your email or phone.",
  },
  {
    q: "Can I become a dubbing interpreter?",
    a: "Yes! Select \"Partnerships & dubbing\" in the contact form and tell us about your experience. We&apos;re always looking for independent interpreters in Kigali.",
  },
];

export function Contact() {
  useDocumentTitle("Contact us");
  const navigate = useNavigate();

  const [department, setDepartment] = useState("general");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<Set<string>>(new Set());

  const toggleFaq = (id: string) => {
    const next = new Set(openFaq);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenFaq(next);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 1500));
      setSubmitting(false);
      setSubmitted(true);
    },
    [],
  );

  if (submitted) {
    return (
      <div className="page-shell py-20 lg:py-24">
        <div className="max-w-[600px] mx-auto text-center">
          <CheckCircle2 size={48} className="mx-auto mb-6 text-mint-400" aria-hidden="true" />
          <h1 className="font-display text-[36px] leading-none text-text">Message sent!</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Thanks for reaching out. We&apos;ve received your message and will respond as soon as
            possible — usually within 24 hours.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className={buttonClass({ size: "md" })}
            >
              Back to home
            </button>
            <button
              type="button"
              onClick={() => navigate("/movies")}
              className={buttonClass({ variant: "secondary", size: "md" })}
            >
              Browse movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-12 lg:py-16">
      {/* Contact Info Cards */}
      <section aria-labelledby="contact-info-heading" className="mb-16">
        <h2 id="contact-info-heading" className="font-display text-[28px] leading-none text-text mb-10">
          Get in touch
        </h2>
        <div className="grid gap-4 sm:grid-cols-3 lg:gap-6">
          {CONTACT_INFO.map((item, i) => (
            <a
              key={i}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={cn(
                "flex flex-col items-start gap-2 rounded-[20px] border border-white/10 bg-ink-850 p-6 hover:border-brand-500/40 hover:bg-brand-500/5 transition-colors duration-300 block",
              )}
            >
              <div className="grid size-10 place-items-center rounded-xl bg-white/5">
                {item.icon}
              </div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-white/40">
                {item.title}
              </span>
              <span className="font-medium text-text">{item.value}</span>
              <span className="mt-0.5 text-[11.5px] text-white/40">{item.subtitle}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section aria-labelledby="contact-form-heading" className="mb-16">
        <div className="grid lg:grid-cols-2 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-[24px] border border-white/10 bg-ink-850 p-8 lg:p-10">
              <h2 id="contact-form-heading" className="font-display text-[24px] leading-none text-text mb-6">
                Send us a message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-3">
                  <label className="block text-[12.5px] font-medium text-white/70">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-11 rounded-xl border border-white/12 bg-ink-850 px-3.5 text-[14px] text-text focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400/40"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-[12.5px] font-medium text-white/70">
                    Full name
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Uwase Aline"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 rounded-xl border border-white/12 bg-ink-850 px-3.5 text-[14px] text-text focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400/40"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[12.5px] font-medium text-white/70">
                    Email address
                  </label>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 rounded-xl border border-white/12 bg-ink-850 px-3.5 text-[14px] text-text focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400/40"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[12.5px] font-medium text-white/70">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="What is this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-11 rounded-xl border border-white/12 bg-ink-850 px-3.5 text-[14px] text-text focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400/40"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[12.5px] font-medium text-white/70">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full min-h-[120px] rounded-xl border border-white/12 bg-ink-850 px-3.5 py-3 text-[14px] text-text focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400/40"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[12.5px] font-medium text-white/70">
                    Attachment (screenshot, invoice, etc.)
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*,.pdf,.txt"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setAttachment(e.target.files[0]);
                      }}
                    />
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-2 rounded-xl border border-white/12 bg-ink-850 px-3.5 py-2.5 text-[13px] text-white transition hover:bg-white/5 hover:border-white/20",
                        attachment && "border-brand-400/40 bg-brand-500/10",
                      )}
                    >
                      {attachment ? (
                        <>
                          <CheckCircle2 size={14} className="text-mint-400" aria-hidden="true" />
                          {attachment.name}
                        </>
                      ) : (
                        <>
                          <span className="text-white/60">Choose file</span>
                          <span className="text-[10px] text-white/30">(optional)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !name || !email || !subject || !message}
                  className={buttonClass({ size: "lg", className: "w-full" })}
                >
                  {submitting ? "Sending…" : "Send message"}
                  {!submitting && <Send size={16} aria-hidden="true" />}
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-1">
            <div className="rounded-[24px] border border-white/10 bg-ink-850 p-8 lg:p-10">
              <h2 className="font-display text-[20px] leading-none text-text mb-6">
                Frequently asked questions
              </h2>
              <div className="space-y-3">
                {FAQS.map((faq, i) => {
                  const isOpen = openFaq.has(faq.q);
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-white/8 bg-ink-800/50 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.q)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] font-medium text-white hover:text-white focus-visible:ring-2 focus-visible:ring-brand-400/60"
                      >
                        <span>{faq.q}</span>
                        <span className={cn("text-white/40 transition-transform", isOpen && "rotate-180")}>
                          <ArrowRight size={14} />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-[12.5px] text-white/50 border-t border-white/5">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="mb-16">
        <div className="rounded-[24px] border border-white/10 bg-ink-850 p-8 lg:p-10 aspect-[16/9] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-4">
                <MapPin size={14} className="text-brand-300" aria-hidden="true" />
                <span className="text-[11px] font-medium text-white/60">KG 7 Ave, Kigali</span>
              </div>
              <div className="w-full h-[300px] rounded-xl border border-white/10 bg-ink-750 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.03)_0%,_transparent_70%)]"></div>
                <div className="absolute inset-0 [background-image:radial-gradient(circle_at_25%_30%,_rgba(149,82,227,0.15)_0%,_transparent_40%),radial-gradient(circle_at_75%_70%,_rgba(149,82,227,0.1)_0%,_transparent_40%)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="grid size-14 place-items-center rounded-full border border-brand-500/40 bg-brand-500/10">
                      <MapPin size={18} className="text-brand-400" aria-hidden="true" />
                    </div>
                    <span className="text-[12px] font-medium text-white/70">PRINCEFILMS Studio</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[12.5px] text-white/40">
                Interactive map coming soon — visit us at KG 7 Ave, Kigali.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}