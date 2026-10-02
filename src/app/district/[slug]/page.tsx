import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getDistrict, getDistricts, getDivision, searchAds } from "@/lib/api";
import { bn } from "@/lib/format";
import { SITE_URL } from "@/lib/site";
import { ListingsView } from "@/components/listings/ListingsView";
import { JsonLd } from "@/components/JsonLd";
import { SellFab } from "@/components/SellFab";

export function generateStaticParams() {
  return getDistricts().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/district/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const d = getDistrict(slug);
  if (!d) return {};
  const total = searchAds({ district: d.slug }).total;
  return pageMeta({
    title: `${d.name} জেলায় মুরগী বিক্রি ও দাম`,
    description: `${d.name} জেলার ${d.upazilas.join(", ")} থেকে ${bn(total)}টি চালু বিজ্ঞাপন: ব্রয়লার, সোনালী, দেশি মুরগী ও হাঁস। দর, ওজন ও বয়স দেখে খামার থেকে সরাসরি কিনুন।`,
    path: `/district/${d.slug}`,
    noindex: total === 0,
  });
}

export default async function DistrictPage(props: PageProps<"/district/[slug]">) {
  const { slug } = await props.params;
  const d = getDistrict(slug);
  if (!d) notFound();
  const div = getDivision(d.division)!;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${d.name} জেলায় মুরগী বিক্রি`,
          url: `${SITE_URL}/district/${d.slug}`,
          about: { "@type": "Place", name: `${d.nameEn}, Bangladesh` },
        }}
      />
      <ListingsView
        f={{ district: d.slug }}
        heading={`${d.name} জেলায় মুরগী বিক্রি`}
        intro={
          <div className="mt-3 space-y-2">
            <p className="text-[16px] text-ink/80">{d.blurb}</p>
            <p className="text-[15px] text-muted">
              {div.name} বিভাগ · উপজেলা: {d.upazilas.join(", ")}
            </p>
          </div>
        }
      />
      <SellFab />
    </>
  );
}
