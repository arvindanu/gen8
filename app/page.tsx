
import Link from "next/link";
import {
  ArrowRight, ChevronRight,
  Gamepad2, Sparkles, Zap
} from "lucide-react";
import GameDiscovery from "@/components/games/game-discovery";
const quickLinks = [
  {
    label: "Explore games",
    detail: "Find something new",
    href: "/discover",
    icon: Sparkles
  },
  {
    label: "Coming soon",
    detail: "See upcoming releases",
    href: "/upcoming",
    icon: Zap
  },
  {
    label: "Pick for me",
    detail: "Let fate decide",
    href: "/roulette",
    icon: Gamepad2
  }
];

export default function HomePage() {
  return (
    <div className="space-y-9">

      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-[26px] border border-[#E8E1E2] bg-white shadow-soft">
        <div className="soft-grid absolute inset-0 -z-20 opacity-60" />
        <div className="hero-orb absolute -right-20 -top-28 -z-10 h-[440px] w-[440px] rounded-full" />

        <div className="grid min-h-[330px] items-center gap-8 px-6 py-9 sm:px-10 lg:grid-cols-[1.15fr_.85fr] lg:px-14 lg:py-12">
          <div className="max-w-[650px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F0D2D3] bg-white/80 px-3 py-1.5 text-[9px] font-black tracking-[1.7px] text-gen8-red shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gen8-red" />
              YOUR GAMING UNIVERSE
            </div>

            <h1 className="mt-5 text-[clamp(2.4rem,5vw,4.7rem)] font-black leading-[.98] tracking-[-.065em] text-gen8-ink">
              Find your next
              <br />
              <span className="text-gen8-red">great adventure.</span>
            </h1>

            <p className="mt-5 max-w-[460px] text-sm leading-7 text-gen8-muted sm:text-[15px]">
              Explore games across every platform. Discover hidden favourites,
              build your collection and always know what to play next.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/discover"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-gen8-red px-5 text-xs font-extrabold text-white shadow-[0_8px_20px_rgba(215,25,32,.2)] transition hover:-translate-y-0.5 hover:bg-[#BD1118]"
              >
                Explore games <ArrowRight size={15} />
              </Link>

              <Link
                href="/roulette"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-gen8-line bg-white px-5 text-xs font-extrabold text-gen8-ink transition hover:border-gen8-red/40 hover:text-gen8-red"
              >
                Surprise me <Sparkles size={14} />
              </Link>
            </div>
          </div>

          {/* Decorative hero illustration */}
          <div className="relative hidden min-h-[230px] items-center justify-center lg:flex">
            <div className="absolute h-[230px] w-[230px] rounded-full border border-gen8-red/10" />
            <div className="absolute h-[180px] w-[180px] rounded-full border border-gen8-red/15" />
            <div className="absolute h-[130px] w-[130px] rounded-full bg-gradient-to-br from-[#FFF0F0] to-white shadow-[0_20px_70px_rgba(215,25,32,.12)]" />

            <div className="relative flex h-[104px] w-[104px] items-center justify-center rounded-[30px] bg-white shadow-[0_18px_50px_rgba(40,20,20,.12)] ring-1 ring-[#F1DADB]">
              <Gamepad2 size={52} strokeWidth={1.25} className="text-gen8-red" />
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gen8-red text-[10px] font-black text-white shadow-lg">
                8
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid gap-3 sm:grid-cols-3">
        {quickLinks.map(({ label, detail, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-3 rounded-2xl border border-gen8-line bg-white p-4 shadow-card transition duration-200 hover:-translate-y-1 hover:border-[#E9C5C6] hover:shadow-soft"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F0] text-gen8-red transition group-hover:bg-gen8-red group-hover:text-white">
              <Icon size={18} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-xs font-extrabold text-gen8-ink">
                {label}
              </span>
              <span className="mt-1 block text-[10px] text-gen8-muted">
                {detail}
              </span>
            </span>

            <ChevronRight
              size={16}
              className="text-[#B7B7BD] transition group-hover:translate-x-1 group-hover:text-gen8-red"
            />
          </Link>
        ))}
      </section>

      {/* Catalogue placeholder for the next phase */}
    {/* Live game discovery */}
<section>
  <GameDiscovery />
</section>
    </div>
  );
}
