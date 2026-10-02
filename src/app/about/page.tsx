import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ProsePage } from "@/components/Prose";

export const metadata: Metadata = pageMeta({
  title: "আমাদের সম্পর্কে",
  description: "Poultry BAZAR বাংলাদেশের খামারি ও পাইকারদের সরাসরি বাজার। কেন বানিয়েছি, কীভাবে চলে, আর আজকের দর কোথা থেকে আসে।",
  path: "/about",
});

export default function AboutPage() {
  return (
    <ProsePage eyebrow="Poultry BAZAR" title="খামার আর বাজারের মাঝখানের দূরত্ব কমাতে" lead="একটা ব্যাচ তুলতে খামারির দেড় মাস লাগে, আর দাম ঠিক হয় এক ফোন কলে। সেই ফোন কলটা যেন ন্যায্য হয়, সেজন্যই Poultry BAZAR।">
      <h2>আমরা কী করি</h2>
      <p>
        খামারিরা তাঁদের তৈরি ব্যাচের সংখ্যা, ওজন, বয়স আর এলাকা দিয়ে বিনামূল্যে বিজ্ঞাপন দেন। পাইকার, আড়তদার আর রেস্তোরাঁ সেগুলো দেখে সরাসরি কল করেন।
        আমরা মাঝখানে কোনো টাকা নিই না, কমিশন নিই না।
      </p>
      <h2>আজকের দর কোথা থেকে আসে</h2>
      <p>
        ব্যাচ বিক্রি হলে বিক্রেতা জানান কেজিপ্রতি কত দরে বিক্রি করলেন। গত ২৪ ঘণ্টার এমন সব দরের গড়ই <Link href="/rates" className="font-semibold text-brand-700 underline">আজকের দর</Link>।
        কোনো এলাকায় ৩টির কম বিক্রি হলে সেখানে দর দেখাই না, যাতে একজনের দামে পুরো এলাকার দাম ভুল না দেখায়।
      </p>
      <h2>যাঁদের জন্য</h2>
      <ul>
        <li>ব্রয়লার, সোনালী, লেয়ার, দেশি মুরগী, হাঁস ও কোয়েল খামারি</li>
        <li>পাইকার ও আড়তদার, যাঁরা প্রতিদিন কয়েকটা খামার থেকে মাল তোলেন</li>
        <li>রেস্তোরাঁ, ক্যাটারিং ও মাংস সরবরাহকারী</li>
      </ul>
      <h2>যোগাযোগ</h2>
      <p>
        প্রশ্ন, পরামর্শ বা অভিযোগ থাকলে <Link href="/contact" className="font-semibold text-brand-700 underline">যোগাযোগ পাতা</Link> দেখুন।
      </p>
    </ProsePage>
  );
}
