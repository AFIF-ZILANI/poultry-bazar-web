import type { Metadata } from "next";
import { Ban, Eye, Scale, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ProsePage } from "@/components/Prose";

export const metadata: Metadata = {
  title: "নিরাপদে মুরগী কেনাবেচা: প্রতারণা থেকে বাঁচার উপায়",
  description: "অনলাইনে মুরগী কেনাবেচায় প্রতারণা এড়াতে খামারি ও পাইকারদের জন্য সহজ নিয়ম। অগ্রিম টাকা নয়, খামারে গিয়ে দেখে ওজন মেপে কিনুন।",
  alternates: { canonical: "/safety" },
};

const RULES = [
  [Ban, "অগ্রিম টাকা পাঠাবেন না", "“ট্রাক ভাড়া”, “বুকিং মানি” বা “ভ্যাকসিন খরচ” বলে বিকাশ/নগদে টাকা চাওয়া সবচেয়ে সাধারণ প্রতারণা। মুরগী হাতে না পাওয়া পর্যন্ত টাকা দেবেন না।"],
  [Eye, "খামারে গিয়ে নিজে দেখুন", "ছবি পুরনো হতে পারে। শেডে গিয়ে মুরগীর অবস্থা, পায়খানা, চলাফেরা দেখে নিন।"],
  [Scale, "সবার সামনে ওজন মাপুন", "নিজের বা বাজারের ডিজিটাল পাল্লায় কয়েকটি খাঁচা মেপে গড় ওজন মিলিয়ে নিন।"],
  [ShieldCheck, "যাচাইকৃত বিক্রেতা দেখুন", "সবুজ ব্যাজ মানে নম্বর যাচাই হয়েছে এবং আগে অন্তত একটি বিক্রি হয়েছে। তবুও উপরের নিয়মগুলো মানুন।"],
] as const;

export default function SafetyPage() {
  return (
    <ProsePage eyebrow="খামারি ও পাইকার দুজনের জন্য" title="নিরাপদ কেনাবেচা" lead="Poultry BAZAR কোনো টাকা লেনদেন করে না। কেনাবেচা হয় সরাসরি আপনাদের মধ্যে, তাই এই চারটি নিয়ম মানলে বেশিরভাগ ঝামেলা এড়ানো যায়।">
      <ul className="!ml-0 grid gap-4 sm:grid-cols-2 [&>li]:!ml-0 [&>li]:list-none [&>li]:!pl-0">
        {RULES.map(([Icon, t, d]) => (
          <li key={t} className="rounded-2xl border border-line bg-surface p-5">
            <Icon className="size-6 text-brand-700" aria-hidden />
            <h2 className="!mt-3 !text-[19px]">{t}</h2>
            <p className="mt-1 text-[16px] leading-7 text-muted">{d}</p>
          </li>
        ))}
      </ul>
      <h2>সন্দেহজনক কিছু দেখলে</h2>
      <p>
        বিজ্ঞাপনের পাতায় “রিপোর্ট করুন” চাপুন, অথবা <Link href="/contact" className="font-semibold text-brand-700 underline">আমাদের জানান</Link>। আমরা ২৪ ঘণ্টার মধ্যে দেখি এবং প্রতারক অ্যাকাউন্ট বন্ধ করি।
      </p>
      <h2>বিক্রেতাদের জন্য</h2>
      <ul>
        <li>ক্রেতা “অনলাইনে আগে টাকা পাঠিয়েছি” বললে নিজের বিকাশ/ব্যাংক অ্যাপে নিজে দেখে নিন। SMS স্ক্রিনশট বিশ্বাস করবেন না।</li>
        <li>বিক্রি হলে বিজ্ঞাপনে “বিক্রি হয়েছে” চাপুন, যাতে আর কল না আসে।</li>
        <li>অসুস্থ মুরগী থাকলে সৎভাবে জানান। পরে ঝামেলার চেয়ে আগে বলা ভালো।</li>
      </ul>
    </ProsePage>
  );
}
