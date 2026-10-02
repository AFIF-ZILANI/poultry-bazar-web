import type { Metadata } from "next";
import { getCategories, getDistricts } from "@/lib/api";
import { RequireLogin } from "@/components/auth/RequireLogin";
import { WantedForm } from "@/components/wanted/WantedForm";

export const metadata: Metadata = {
  title: "চাহিদা পোস্ট করুন",
  robots: { index: false },
};

export default function NewWantedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-6 md:pt-10">
      <h1 className="text-[28px] font-extrabold text-field-900 sm:text-[34px]">কী কিনতে চান?</h1>
      <p className="mt-2 text-[16px] text-ink/80">খামারিরা আপনার চাহিদা দেখে সরাসরি কল করবেন। পোস্ট করা বিনামূল্যে।</p>
      <div className="mt-6">
        <RequireLogin next="/wanted/new" reason="চাহিদা পোস্ট করতে মোবাইল নম্বর যাচাই করা অ্যাকাউন্ট লাগবে, যাতে খামারিরা ভরসা পান।">
          <WantedForm categories={getCategories()} districts={getDistricts()} />
        </RequireLogin>
      </div>
    </div>
  );
}
