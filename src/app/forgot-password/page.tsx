import type { Metadata } from "next";
import { AuthFlow } from "@/components/auth/AuthFlow";

export const metadata: Metadata = { title: "পাসওয়ার্ড ভুলে গেছেন", robots: { index: false } };

export default async function Page(props: PageProps<"/forgot-password">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;
  return (
    <div className="mx-auto max-w-md px-4 pb-10 pt-8 md:pt-12">
      <AuthFlow mode="forgot" next={next} />
    </div>
  );
}
