import type { ReactNode } from "react";

export function ProsePage({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-12 pt-8 md:px-6 md:pt-12">
      {eyebrow && <p className="text-[14px] font-semibold text-field-700">{eyebrow}</p>}
      <h1 className="mt-1 text-[32px] font-extrabold text-field-900 sm:text-[40px]">{title}</h1>
      {lead && <p className="mt-3 text-[18px] text-ink/80">{lead}</p>}
      <div className="mt-8 space-y-4 text-[17px] leading-8 [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">
        {children}
      </div>
    </div>
  );
}
