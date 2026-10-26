"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { SiGithub } from "react-icons/si";
import { FiMenu, FiX } from "react-icons/fi";
import { gsap, useGSAP } from "@/lib/animations/gsap";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isGenerator = pathname === "/";
  const isTemplates = pathname === "/templates";
  const isSystemStates = pathname === "/system-states";

  useGSAP(
    () => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: -16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    },
    { scope: headerRef }
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#0D0E0C] border-b border-[#21231D] select-none"
    >
      {/* Main Navbar Container */}
      <div className="h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#171815] border border-[#2A2D23] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Hello-md Logo"
                className="w-4 h-4 object-contain"
              />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">
              Hello-md
            </span>
          </Link>
        </div>

        {/* Center Nav: Clean Text Tabs */}
        <nav className="hidden lg:flex items-center bg-[#151712] p-1 rounded-md border border-[#262820]">
          <Link
            href="/#how-it-works"
            className="px-3 py-1 rounded text-xs font-medium text-[#9EAA96] hover:text-white transition-colors"
          >
            How it works
          </Link>

          <Link
            href="/#features"
            className="px-3 py-1 rounded text-xs font-medium text-[#9EAA96] hover:text-white transition-colors"
          >
            Features
          </Link>

          <Link
            href="/#generator"
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              isGenerator
                ? "bg-[#23271D] text-white font-semibold"
                : "text-[#9EAA96] hover:text-white"
            }`}
          >
            Generator
          </Link>

          <Link
            href="/#faq"
            className="px-3 py-1 rounded text-xs font-medium text-[#9EAA96] hover:text-white transition-colors"
          >
            FAQ
          </Link>

          <Link
            href="/templates"
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              isTemplates
                ? "bg-[#23271D] text-white font-semibold"
                : "text-[#9EAA96] hover:text-white"
            }`}
          >
            Templates
          </Link>

          <Link
            href="/system-states"
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              isSystemStates
                ? "bg-[#23271D] text-white font-semibold"
                : "text-[#9EAA96] hover:text-white"
            }`}
          >
            Status
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#A0A299] hidden sm:inline">
                @{session.user.login || session.user.name}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="h-8 px-2.5 bg-[#151712] hover:bg-[#1D2018] text-[#D0D2C9] hover:text-white border border-[#272921] rounded-md transition-colors text-xs font-medium cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signIn("github")}
              className="h-8 px-3 bg-accent hover:bg-accent-hover text-[#0D0E0C] font-semibold rounded-md transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-xs"
            >
              <SiGithub className="w-3.5 h-3.5 text-[#0D0E0C]" />
              <span>Sign in</span>
            </button>
          )}

          <a
            href="https://github.com/SajithNuski/Hello-md"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 bg-[#151712] hover:bg-[#1D2018] text-[#D0D2C9] hover:text-white border border-[#272921] rounded-md transition-colors flex items-center gap-2 text-xs font-medium"
          >
            <SiGithub className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Repo</span>
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md bg-[#151712] border border-[#272921] text-[#D0D2C9] hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <FiX className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-[#0D0E0C] border-b border-[#21231D] p-5 flex flex-col gap-3 shadow-lg">
          <nav className="flex flex-col gap-1">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-xs font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              How it works
            </Link>
            <Link
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-xs font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#generator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-xs font-medium text-white hover:bg-white/[0.05] transition-colors"
            >
              Generator
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-xs font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-xs font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/system-states"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md text-xs font-medium text-[#A5A89D] hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              Status
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#21231D] flex flex-col gap-2">
            {session?.user ? (
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-mono text-[#A0A299]">
                  @{session.user.login || session.user.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="text-xs text-red-400 hover:underline"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signIn("github");
                }}
                className="h-9 px-4 bg-[#1C2017] hover:bg-[#252B1E] border border-[#2E3524] text-white font-medium rounded-md flex items-center justify-center gap-2 text-xs"
              >
                <SiGithub className="w-3.5 h-3.5 text-accent" />
                <span>Sign in with GitHub</span>
              </button>
            )}

            <Link
              href="/#generator"
              onClick={() => setMobileMenuOpen(false)}
              className="h-9 px-4 bg-accent text-[#0D0E0C] font-semibold rounded-md flex items-center justify-center text-xs"
            >
              <span>Create README</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
