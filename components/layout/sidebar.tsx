
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House, Compass, Flame, CalendarDays, Gem,
  Bookmark, LibraryBig, Gamepad2, CircleCheck,
  ChartNoAxesCombined, Dices, GitCompareArrows,
  Search, Settings, ChevronRight
} from "lucide-react";
import { Gen8Logo } from "@/components/brand/gen8-logo";

const groups = [
  {
    title: "DISCOVER",
    items: [
      { label: "Home", href: "/", icon: House },
      { label: "Discover", href: "/discover", icon: Compass },
      { label: "Trending", href: "/trending", icon: Flame },
      { label: "Upcoming", href: "/upcoming", icon: CalendarDays },
      { label: "Hidden Gems", href: "/hidden-gems", icon: Gem }
    ]
  },
  {
    title: "YOUR GAMING SPACE",
    items: [
      { label: "Wishlist", href: "/wishlist", icon: Bookmark },
      { label: "My Collection", href: "/collection", icon: LibraryBig },
      { label: "Currently Playing", href: "/collection?status=playing", icon: Gamepad2 },
      { label: "Completed Games", href: "/collection?status=completed", icon: CircleCheck },
      { label: "Gaming Stats", href: "/stats", icon: ChartNoAxesCombined }
    ]
  },
  {
    title: "EXTRAS",
    items: [
      { label: "Game Roulette", href: "/roulette", icon: Dices },
      { label: "Compare Games", href: "/compare", icon: GitCompareArrows },
      { label: "Game Finder", href: "/finder", icon: Search },
      { label: "Settings", href: "/settings", icon: Settings }
    ]
  }
];

export function Sidebar({
  collapsed,
  onNavigate
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col overflow-y-auto px-3 pb-5">
      <div className={`hidden h-[76px] items-center border-b border-gen8-line px-2 lg:flex ${collapsed ? "justify-center" : ""}`}>
        <Gen8Logo compact={collapsed} />
      </div>

      <nav className="space-y-7 pt-6">
        {groups.map((group) => (
          <section key={group.title}>
            {!collapsed && (
              <h2 className="mb-2 px-3 text-[9px] font-extrabold tracking-[1.7px] text-[#A0A0A7]">
                {group.title}
              </h2>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href.split("?")[0]);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex h-10 items-center gap-3 rounded-xl px-3 text-[13px] font-semibold transition-all duration-200 ${
                      collapsed ? "justify-center px-0" : ""
                    } ${
                      active
                        ? "bg-[#FFF0F0] text-gen8-red"
                        : "text-[#77777F] hover:bg-[#F6F6F7] hover:text-gen8-ink"
                    }`}
                  >
                    {active && (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-gen8-red" />
                    )}

                    <Icon size={17} strokeWidth={active ? 2.3 : 1.8} />

                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {active && <ChevronRight size={14} className="opacity-60" />}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      {!collapsed && (
        <div className="mt-auto pt-8">
          <div className="rounded-2xl border border-[#F1D8D9] bg-gradient-to-br from-[#FFF7F7] to-white p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-gen8-red text-white">
              <Gamepad2 size={16} />
            </div>
            <p className="text-xs font-extrabold text-gen8-ink">
              Find your next favourite.
            </p>
            <p className="mt-1 text-[11px] leading-5 text-gen8-muted">
              Explore a world of games, all in one place.
            </p>
            <span className="mt-3 block text-[9px] font-black tracking-[1.5px] text-gen8-red">
              GEN8 · GAME DISCOVERY
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
