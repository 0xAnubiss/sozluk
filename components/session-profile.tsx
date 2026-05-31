"use client";

import { useEffect, useMemo, useState } from "react";
import { ProfileOverview } from "@/components/profile-overview";
import type { ContributorProfile } from "@/lib/types";

type SessionUser = {
  name: string;
  email: string;
  profession?: string;
  languages?: string;
  avatarUrl?: string;
};

const SESSION_KEY = "kalem-sozluk-current-user";

function splitLanguages(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function SessionProfile() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [draft, setDraft] = useState({ name: "", profession: "", languages: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null") as SessionUser | null;
      setUser(storedUser);
      if (storedUser) {
        setDraft({
          name: storedUser.name ?? "",
          profession: storedUser.profession ?? "",
          languages: storedUser.languages ?? ""
        });
      }
    } catch {
      setUser(null);
    }
  }, []);

  const profile = useMemo<ContributorProfile | null>(() => {
    if (!user?.name) {
      return null;
    }

    const languages = splitLanguages(user.languages);

    return {
      id: `profile-${user.email || "local"}`,
      handle: "me",
      name: user.name,
      profession: user.profession?.trim() || "Katkı kullanıcısı",
      bio: "Kayıtlı kullanıcı profili. Katkı yaptıkça istatistikler ve son katkılar burada görünür.",
      avatarUrl: user.avatarUrl,
      languages: languages.length > 0 ? languages : ["Türkçe", "Fransızca"],
      focusAreas: ["sözlük katkısı", "örnek tümce", "yıldızlı oylama"],
      stats: {
        entriesCreated: 0,
        contributions: 0,
        votesReceived: 0
      },
      recentContributions: [
        {
          entrySlug: "kitap",
          label: "Henüz katkı yok",
          summary: "Yeni madde veya anlam eklediğinde bu liste güncellenecek."
        }
      ]
    };
  }, [user]);

  function updateAvatar(file?: File) {
    if (!file || !user) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      const nextUser = { ...user, avatarUrl: reader.result };
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
      window.dispatchEvent(new Event("kalem-auth-change"));
      setUser(nextUser);
      setMessage("Profil resmi güncellendi.");
    };
    reader.readAsDataURL(file);
  }

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !draft.name.trim()) {
      return;
    }

    const nextUser = {
      ...user,
      name: draft.name.trim(),
      profession: draft.profession.trim(),
      languages: draft.languages.trim()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    window.dispatchEvent(new Event("kalem-auth-change"));
    setUser(nextUser);
    setIsEditing(false);
    setMessage("Profil bilgileri güncellendi.");
  }

  if (!profile) {
    return (
      <div className="page-shell">
        <section className="auth-panel">
          <span className="section-kicker">Profil</span>
          <h1>Oturum bulunamadı</h1>
          <p>Profilini görmek için önce giriş yapman veya kayıt olman gerekiyor.</p>
        </section>
      </div>
    );
  }

  return (
    <ProfileOverview
      profile={profile}
      profileActions={
        <>
          <button type="button" className="primary-button" onClick={() => setIsEditing((current) => !current)}>
            Profili düzenle
          </button>
          <label className="ghost-button profile-upload-button">
            Profil resmi yükle
            <input type="file" accept="image/*" onChange={(event) => updateAvatar(event.target.files?.[0])} />
          </label>
        </>
      }
    >
      {isEditing ? (
        <form className="profile-edit-form" onSubmit={saveProfile}>
          <label className="field">
            <span>Ad soyad</span>
            <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} />
          </label>
          <label className="field">
            <span>Meslek</span>
            <input value={draft.profession} onChange={(event) => setDraft((current) => ({ ...current, profession: event.target.value }))} />
          </label>
          <label className="field field-wide">
            <span>Diller</span>
            <input value={draft.languages} onChange={(event) => setDraft((current) => ({ ...current, languages: event.target.value }))} />
          </label>
          <div className="form-actions">
            <button type="button" className="ghost-button" onClick={() => setIsEditing(false)}>
              Vazgeç
            </button>
            <button type="submit" className="primary-button">
              Kaydet
            </button>
          </div>
        </form>
      ) : null}
      {message ? <p className="form-feedback success">{message}</p> : null}
    </ProfileOverview>
  );
}
