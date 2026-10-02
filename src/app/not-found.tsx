import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <p className="num text-[64px] font-extrabold leading-none text-field-200">৪০৪</p>
      <h1 className="mt-2 text-[28px] font-extrabold text-field-900">পাতাটি পাওয়া যায়নি</h1>
      <p className="mt-2 text-[16px] text-muted">বিজ্ঞাপনটি হয়তো মুছে ফেলা হয়েছে বা লিংকটি ভুল। নিচে খুঁজে দেখুন।</p>
      <div className="mt-6 text-left">
        <SearchBox />
      </div>
      <p className="mt-6 flex justify-center gap-4 text-[15px] font-semibold text-field-700">
        <Link href="/" className="hover:underline">হোম</Link>
        <Link href="/rates" className="hover:underline">আজকের দর</Link>
        <Link href="/ads" className="hover:underline">সব বিজ্ঞাপন</Link>
      </p>
    </div>
  );
}
