import { Search } from "lucide-react";
import { getDistricts, getDivisions } from "@/lib/api";

/** Plain GET form: works without JavaScript and lands on a shareable /ads URL. */
export function SearchBox() {
  const divisions = getDivisions();
  const districts = getDistricts();
  return (
    <form action="/ads" method="get" role="search" className="rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-lift)]">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">কী খুঁজছেন</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <input
            name="q"
            type="search"
            placeholder="যেমন: ব্রয়লার, সোনালী, শ্রীপুর"
            className="h-12 w-full rounded-xl bg-paper pl-11 pr-3 text-[16px] outline-none placeholder:text-muted/80 focus:bg-surface focus:ring-2 focus:ring-brand-700"
          />
        </label>
        <label className="sm:w-48">
          <span className="sr-only">জেলা</span>
          <select
            name="district"
            defaultValue=""
            className="h-12 w-full rounded-xl bg-paper px-3 text-[16px] outline-none focus:ring-2 focus:ring-brand-700"
          >
            <option value="">সব জেলা</option>
            {divisions.map((dv) => (
              <optgroup key={dv.slug} label={`${dv.name} বিভাগ`}>
                {districts
                  .filter((d) => d.division === dv.slug)
                  .map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        <button type="submit" className="h-12 rounded-xl bg-brand-700 px-6 text-[16px] font-semibold text-white hover:bg-brand-800">
          খুঁজুন
        </button>
      </div>
    </form>
  );
}
