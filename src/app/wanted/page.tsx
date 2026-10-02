import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getWanted } from "@/lib/api";
import { bn } from "@/lib/format";
import { WantedCard } from "@/components/WantedCard";
import { LocalWanted } from "@/components/wanted/LocalWanted";

export const metadata: Metadata = pageMeta({
  title: "পাইকারের চাহিদা: কে কোন মুরগী কিনতে চান",
  description: "পাইকার, আড়তদার ও রেস্তোরাঁ কোন জেলায় কত মুরগী কিনতে চান। আপনার ব্যাচ মিললে সরাসরি যোগাযোগ করুন।",
  path: "/wanted",
});

export default function WantedPage() {
  const list = getWanted();
  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-[30px] font-extrabold text-brand-900 sm:text-[36px]">কিনতে চাই</h1>
          <p className="mt-2 text-[16px] text-ink/80">
            পাইকার ও আড়তদাররা এখানে জানান তাঁদের কোন মুরগী, কত পিছ, কোন ওজনে লাগবে। খামারি হিসেবে আপনার ব্যাচ মিললে বিজ্ঞাপনে চাহিদার নম্বর দিয়ে যোগাযোগ করুন।
          </p>
        </div>
        <Link href="/wanted/new" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-[16px] font-semibold text-white hover:bg-brand-800">
          <Plus className="size-5" aria-hidden /> চাহিদা পোস্ট করুন
        </Link>
      </div>
      <p className="mt-6 text-[15px] text-muted">
        <span className="num font-bold text-ink">{bn(list.length)}</span>টি চালু চাহিদা
      </p>
      <LocalWanted />
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((w) => (
          <WantedCard key={w.id} w={w} />
        ))}
      </div>
    </div>
  );
}
