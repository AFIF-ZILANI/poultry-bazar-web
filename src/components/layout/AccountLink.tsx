"use client";
import Link from "next/link";
import { CircleUserRound, LogIn } from "lucide-react";
import { useDemo } from "@/lib/demo-store";

export function AccountLink() {
  const user = useDemo((s) => s.user);
  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-brand-800 hover:bg-paper"
      >
        <LogIn className="size-[18px]" aria-hidden />
        <span>লগইন</span>
      </Link>
    );
  }
  return (
    <Link
      href="/account"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3 text-[15px] font-medium hover:bg-paper"
    >
      <CircleUserRound className="size-5 text-brand-700" aria-hidden />
      <span className="hidden max-w-[10ch] truncate sm:inline">{user.name.split(" ").slice(-1)[0]}</span>
      <span className="sm:hidden">আমার</span>
    </Link>
  );
}
