"use client";
import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { useDemo } from "@/lib/demo-store";

const noop = () => () => {};

/** Shows children only to a signed-in (demo) user; otherwise a login prompt that returns here. */
export function RequireLogin({ next, reason, children }: { next: string; reason: string; children: ReactNode }) {
  const user = useDemo((s) => s.user);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  if (!mounted) return <div className="h-64" aria-busy="true" />;
  if (user) return <>{children}</>;
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface p-8 text-center">
      <LockKeyhole className="mx-auto size-8 text-brand-700" aria-hidden />
      <h2 className="mt-3 text-[22px] font-bold">আগে লগইন করুন</h2>
      <p className="mt-2 text-[15px] text-muted">{reason}</p>
      <div className="mt-5 flex flex-col gap-2">
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="rounded-full bg-brand-700 py-3 text-[16px] font-semibold text-white hover:bg-brand-800">
          লগইন করুন
        </Link>
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="rounded-full border border-line-strong py-3 text-[16px] font-semibold hover:border-brand-700">
          নতুন অ্যাকাউন্ট খুলুন
        </Link>
      </div>
    </div>
  );
}
