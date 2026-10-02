"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, Plus } from "lucide-react";
import { Sheet } from "../ui/Sheet";

const LINKS = [
  { href: "/", label: "হোম" },
  { href: "/ads", label: "সব বিজ্ঞাপন" },
  { href: "/rates", label: "আজকের দর" },
  { href: "/wanted", label: "কিনতে চাই (ক্রেতার চাহিদা)" },
  { href: "/account", label: "আমার বিজ্ঞাপন" },
  { href: "/app", label: "Android অ্যাপ ডাউনলোড" },
  { href: "/safety", label: "নিরাপদ কেনাবেচা" },
  { href: "/about", label: "আমাদের সম্পর্কে" },
  { href: "/contact", label: "যোগাযোগ" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="মেনু খুলুন"
        className="grid size-10 place-items-center rounded-full hover:bg-paper lg:hidden"
      >
        <Menu className="size-6" />
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="মেনু">
        <nav aria-label="মোবাইল মেনু" className="-mx-2 flex flex-col">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-[17px] font-medium hover:bg-paper"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/sell"
          onClick={() => setOpen(false)}
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-comb-600 py-3.5 text-[17px] font-semibold text-white"
        >
          <Plus className="size-5" aria-hidden /> বিক্রির বিজ্ঞাপন দিন
        </Link>
      </Sheet>
    </>
  );
}
