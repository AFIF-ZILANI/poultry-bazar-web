import Link from "next/link";
import { Logo } from "../brand/Logo";
import { getCategories, getDistricts } from "@/lib/api";

export function SiteFooter() {
  const cats = getCategories();
  const dists = getDistricts().slice(0, 8);
  return (
    <footer className="mt-20 bg-field-900 text-field-100">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-6">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-4 text-[15px] leading-7 text-field-200">
            খামারি ও পাইকারের সরাসরি বাজার। বিজ্ঞাপন দেওয়া ও দেখা সম্পূর্ণ বিনামূল্যে। আমরা কোনো লেনদেনে টাকা নিই না,
            তাই অগ্রিম টাকা চাইলে সাবধান থাকুন।
          </p>
        </div>
        <FooterCol title="মুরগীর ধরন" links={cats.map((c) => ({ href: `/category/${c.slug}`, label: `${c.name} বিক্রি` }))} />
        <FooterCol title="জেলা" links={dists.map((d) => ({ href: `/district/${d.slug}`, label: `${d.name}` }))} />
        <FooterCol
          title="Poultry BAZAR"
          links={[
            { href: "/rates", label: "আজকের মুরগীর দর" },
            { href: "/app", label: "Android অ্যাপ" },
            { href: "/about", label: "আমাদের সম্পর্কে" },
            { href: "/contact", label: "যোগাযোগ" },
            { href: "/safety", label: "নিরাপদ কেনাবেচা" },
            { href: "/privacy", label: "গোপনীয়তা নীতি" },
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1200px] px-4 py-5 text-[13px] text-field-200 md:px-6">
          © ২০২৬ Poultry BAZAR · poultrybazarbd.com · এটি একটি ডেমো সংস্করণ, সব বিজ্ঞাপন ও দর নমুনা তথ্য।
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-[13px] font-semibold uppercase tracking-wider text-grain-400">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-[15px] text-field-100 hover:text-white hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
