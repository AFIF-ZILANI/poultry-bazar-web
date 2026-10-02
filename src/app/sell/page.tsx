import type { Metadata } from "next";
import { getCategories, getDistricts, getDivisions, getRates } from "@/lib/api";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { SellWizard } from "@/components/sell/SellWizard";

export const metadata: Metadata = {
  title: "মুরগী বিক্রির বিজ্ঞাপন দিন",
  robots: { index: false },
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 pt-6 md:pt-10">
      <h1 className="text-[28px] font-extrabold text-brand-900 sm:text-[34px]">বিক্রির বিজ্ঞাপন দিন</h1>
      <p className="mt-1 text-[16px] text-muted">বিনামূল্যে, ৩ মিনিটে। ১০ দিন চালু থাকবে।</p>
      <div className="mt-6">
        <RequireLogin next="/sell" reason="বিজ্ঞাপনে আপনার যাচাই করা মোবাইল নম্বর দেখানো হয়, তাই আগে লগইন দরকার।">
          <SellWizard categories={getCategories()} divisions={getDivisions()} districts={getDistricts()} rates={getRates()} />
        </RequireLogin>
      </div>
    </div>
  );
}
