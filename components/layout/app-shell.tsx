
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu, Search, PanelLeftClose,
  PanelLeftOpen, X
} from "lucide-react";

import { Sidebar } from "@/components/layout/sidebar";
import { Gen8Logo } from "@/components/brand/gen8-logo";

export function AppShell({
  children
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-gen8-line bg-white transition-[width] duration-300 lg:block ${
          collapsed ? "w-[86px]" : "w-[258px]"
        }`}
      >
        <Sidebar collapsed={collapsed} />

        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-[84px] flex h-7 w-7 items-center justify-center rounded-full border border-gen8-line bg-white text-gen8-muted shadow-sm transition hover:border-gen8-red hover:text-gen8-red"
        >
          {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </aside>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              aria-label="Close navigation"
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[285px] bg-white shadow-2xl lg:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <div className="flex h-[76px] items-center justify-between border-b border-gen8-line px-5">
                <Gen8Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-xl p-2 text-gen8-muted hover:bg-gen8-canvas"
                >
                  <X size={19} />
                </button>
              </div>

              <Sidebar
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main application */}
      <div
        className={`min-h-screen transition-[padding] duration-300 ${
          collapsed ? "lg:pl-[86px]" : "lg:pl-[258px]"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-gen8-line/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 xl:px-9">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="rounded-xl border border-gen8-line p-2.5 text-gen8-ink lg:hidden"
          >
            <Menu size={19} />
          </button>

          <div className="lg:hidden">
            <Gen8Logo compact />
          </div>

          <div className="relative hidden max-w-[480px] flex-1 md:block">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gen8-muted"
            />
            <input
              aria-label="Search games"
              placeholder="Search games, genres, platforms..."
              className="h-11 w-full rounded-xl border border-gen8-line bg-[#FAFAFB] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#A0A0A7] focus:border-gen8-red/50 focus:bg-white focus:ring-4 focus:ring-gen8-red/5"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs font-semibold tracking-wide text-gen8-muted sm:block">
              YOUR NEXT GAME STARTS HERE
            </span>
            <span className="h-2 w-2 rounded-full bg-gen8-red shadow-[0_0_0_4px_rgba(215,25,32,.09)]" />
          </div>
        </header>

        <main
          key={pathname}
          className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-9"
        >
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
