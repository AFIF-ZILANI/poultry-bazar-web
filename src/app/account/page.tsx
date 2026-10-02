import type { Metadata } from "next";
import { getCategories, getDistricts, getMyAds } from "@/lib/api";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = { title: "আমার বিজ্ঞাপন", robots: { index: false } };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 pb-12 pt-6 md:px-6 md:pt-10">
      <RequireLogin next="/account" reason="আপনার বিজ্ঞাপন, বিক্রির দর আর সেভ করা খোঁজ দেখতে লগইন করুন।">
        <AccountView seeded={getMyAds()} categories={getCategories()} districts={getDistricts()} />
      </RequireLogin>
    </div>
  );
}
