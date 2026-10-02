import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ProsePage } from "@/components/Prose";
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_WHATSAPP } from "@/lib/site";
import { phoneBn, toBnDigits } from "@/lib/format";

export const metadata: Metadata = pageMeta({
  title: "যোগাযোগ",
  description: "Poultry BAZAR-এর সাথে ফোন, হোয়াটসঅ্যাপ বা ইমেইলে যোগাযোগ করুন। বিজ্ঞাপন, অ্যাকাউন্ট বা প্রতারণা নিয়ে সাহায্য।",
  path: "/contact",
});

export default function ContactPage() {
  const cards = [
    { Icon: Phone, t: "ফোন", v: phoneBn(SUPPORT_PHONE), href: `tel:${SUPPORT_PHONE}`, d: "সকাল ৯টা – রাত ৮টা, প্রতিদিন" },
    { Icon: MessageCircle, t: "হোয়াটসঅ্যাপ", v: toBnDigits(`+${SUPPORT_WHATSAPP.slice(0, 3)} ${SUPPORT_WHATSAPP.slice(3)}`), href: `https://wa.me/${SUPPORT_WHATSAPP}`, d: "ছবি বা স্ক্রিনশট পাঠাতে সুবিধা" },
    { Icon: Mail, t: "ইমেইল", v: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}`, d: "২ কর্মদিবসের মধ্যে উত্তর" },
  ];
  return (
    <ProsePage title="যোগাযোগ" lead="বিজ্ঞাপন, অ্যাকাউন্ট, অ্যাপ ইনস্টল বা প্রতারণা নিয়ে যেকোনো সমস্যায় আমাদের জানান।">
      <ul className="!ml-0 grid gap-3 sm:grid-cols-3 [&>li]:!ml-0 [&>li]:list-none [&>li]:!pl-0">
        {cards.map(({ Icon, t, v, href, d }) => (
          <li key={t}>
            <a href={href} className="block h-full rounded-2xl border border-line bg-surface p-5 hover:border-brand-700">
              <Icon className="size-6 text-brand-700" aria-hidden />
              <span className="mt-3 block text-[15px] text-muted">{t}</span>
              <span className="num block break-all text-[18px] font-bold leading-snug">{v}</span>
              <span className="mt-1 block text-[14px] leading-6 text-muted">{d}</span>
            </a>
          </li>
        ))}
      </ul>
      <h2>অ্যাকাউন্ট মুছতে চাইলে</h2>
      <p>
        আপনার নিবন্ধিত মোবাইল নম্বর থেকে ফোন বা হোয়াটসঅ্যাপ করে জানান, তাতে আমরা নিশ্চিত হতে পারি অনুরোধটি আপনারই। আমরা ৭ কর্মদিবসের মধ্যে অ্যাকাউন্ট ও ব্যক্তিগত তথ্য মুছে SMS-এ নিশ্চিত করি।
      </p>
      <p className="text-[15px] text-muted">ডেমো সংস্করণ: এই পাতার নম্বরগুলো নমুনা।</p>
    </ProsePage>
  );
}
