import type { Metadata } from "next";
import { AuthFlow } from "@/components/auth/AuthFlow";

export const metadata: Metadata = { title: "লগইন", robots: { index: false } };

export default async function Page(props: PageProps<"/login">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  return (
    <div className="mx-auto max-w-md px-4 pb-10 pt-8 md:pt-12">
      <AuthFlow mode="login" next={next} />
    </div>
  );
}
