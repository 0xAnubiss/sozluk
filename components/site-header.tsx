"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { LogInIcon, SearchIcon, UserIcon } from "@/components/ui-icons";

type SessionUser = {
  name: string;
  email: string;
  profession?: string;
  languages?: string;
};

const SESSION_KEY = "kalem-sozluk-current-user";

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as SessionUser | null;
  } catch {
    return null;
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    function syncSession() {
      setUser(readSession());
    }

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("kalem-auth-change", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("kalem-auth-change", syncSession);
    };
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      router.push("/");
      return;
    }

    router.push(`/?q=${encodeURIComponent(normalizedQuery)}`);
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("kalem-auth-change"));
    setUser(null);
  }

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand-wordmark">
          Kale&apos;m Sözlük
        </Link>

        <nav className="topbar-nav" aria-label="Birincil gezinme">
          <Link href="/" className={pathname === "/" ? "nav-link is-active" : "nav-link"}>
            Sözlük
          </Link>
          <Link href="/contribute" className={pathname.startsWith("/contribute") ? "nav-link is-active" : "nav-link"}>
            Katkı
          </Link>
          <Link href={user ? "/profile/me" : "/profile/selin-arda"} className={pathname.startsWith("/profile") ? "nav-link is-active" : "nav-link"}>
            Profil
          </Link>
        </nav>

        <div className="topbar-tools">
          <form className="topbar-search" aria-label="Sözlükte ara" onSubmit={submitSearch}>
            <span className="topbar-search-icon">
              <SearchIcon />
            </span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Kelime ara" />
          </form>

          {user ? (
            <div className="header-user">
              <span>{user.name.split(" ")[0]}</span>
              <button type="button" onClick={logout}>
                Çık
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="header-action">
                <LogInIcon />
                Giriş
              </Link>
              <Link href="/register" className="topbar-account" aria-label="Kayıt ol">
                <UserIcon />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
