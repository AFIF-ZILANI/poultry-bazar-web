/** Brand mark: a hen in profile on a field-green tile. The comb is the only orange (docs/design.md). */
export function LogoMark({ className = "size-10", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <rect width="64" height="64" rx="15" fill="#17633A" />
      {/* comb sits behind the head */}
      <circle cx="35.5" cy="17.5" r="3.6" fill="#D2461B" />
      <circle cx="40.5" cy="15.2" r="3.9" fill="#D2461B" />
      <circle cx="45.4" cy="17.6" r="3.4" fill="#D2461B" />
      {/* tail */}
      <path d="M14 41 L8.5 22.5 Q8.2 20.6 10 21.6 L26 31 Z" fill="#F6F5EF" />
      {/* body */}
      <ellipse cx="29" cy="40.5" rx="17.5" ry="13" fill="#F6F5EF" />
      {/* neck + head */}
      <path d="M33 34 Q35 25 40.5 21 L46 26 Q45 33 41 38 Z" fill="#F6F5EF" />
      <circle cx="41" cy="26" r="8.6" fill="#F6F5EF" />
      {/* beak and wattle */}
      <path d="M48.8 23.6 L55.2 26.6 L48.8 29.6 Z" fill="#E8B547" />
      <ellipse cx="47.3" cy="32.6" rx="2.1" ry="2.8" fill="#D2461B" />
      {/* eye */}
      <circle cx="43.4" cy="24.6" r="1.7" fill="#0F3D24" />
      {/* wing */}
      <path d="M19 39.5 Q27 47 37 40" fill="none" stroke="#C5DCCB" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ compact = false, inverted = false }: { compact?: boolean; inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="size-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[21px] tracking-tight ${inverted ? "text-white" : "text-field-900"}`}>
          <span className="font-medium">Poultry</span> <span className="font-extrabold">BAZAR</span>
        </span>
        {!compact && (
          <span className={`mt-1 text-[12px] font-medium ${inverted ? "text-field-200" : "text-muted"}`}>পোল্ট্রি বাজার · খামার থেকে সরাসরি</span>
        )}
      </span>
    </span>
  );
}
