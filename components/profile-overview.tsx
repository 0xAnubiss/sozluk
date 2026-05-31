import Image from "next/image";
import type { ContributorProfile } from "@/lib/types";
import type { ReactNode } from "react";
import { GlobeIcon, MedalIcon, ShieldIcon, SparkIcon, TrophyIcon, UsersIcon } from "@/components/ui-icons";

type ProfileOverviewProps = {
  profile: ContributorProfile;
  profileActions?: ReactNode;
  children?: ReactNode;
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function ProfileOverview({ profile, profileActions, children }: ProfileOverviewProps) {
  function languageLabel(language: string, index: number) {
    if (/\b(A1|A2|B1|B2|C1|C2)\b/.test(language)) {
      return language;
    }

    return `${language} (${index === 0 ? "C2" : index === 1 ? "C1" : "B2"})`;
  }

  return (
    <div className="page-shell">
      <section className="profile-hero">
        <div className="profile-portrait">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={`${profile.name} profil resmi`}
              width={420}
              height={320}
              className="profile-image"
              unoptimized
            />
          ) : (
            <div className="portrait-initials">{initials(profile.name)}</div>
          )}
        </div>

        <div className="profile-copy">
          <span className="section-kicker">Katkıcı profili</span>
          <h1>{profile.name}</h1>
          <p className="profile-role">{profile.profession}</p>
          <div className="profile-language-row">
            {profile.languages.map((language, index) => (
              <span key={language}>
                {languageLabel(language, index)}
              </span>
            ))}
          </div>
          <p className="profile-bio">{profile.bio}</p>
          <div className="profile-actions">
            {profileActions ?? (
              <button type="button" className="primary-button">
                Profili düzenle
              </button>
            )}
            <button type="button" className="ghost-button">
              Katkıları paylaş
            </button>
          </div>
          {children}
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-hero-card">
          <span className="section-kicker">İstatistikler</span>
          <h2>Topluluk katkısı</h2>
          <p>Katkı, yıldız ve madde oluşturma kayıtları ödül sistemi için tutulur.</p>
        </article>

        <article className="stat-mini-card">
          <span className="stat-mini-card-icon">
            <TrophyIcon />
          </span>
          <strong>{profile.stats.entriesCreated}</strong>
          <p>Oluşturulan madde</p>
        </article>

        <article className="stat-mini-card">
          <span className="stat-mini-card-icon">
            <SparkIcon />
          </span>
          <strong>{profile.stats.votesReceived}</strong>
          <p>Alınan yıldız</p>
        </article>
      </section>

      <section className="badge-row">
        <div>
          <h3>Rozetler</h3>
          <p>Meslek, dil bilgisi ve katkı sürekliliğine göre gösterilecek uzmanlık katmanları.</p>
        </div>
        <div className="badge-icons">
          <span aria-label="Küratör rozeti">
            <MedalIcon />
          </span>
          <span aria-label="Dil uzmanı rozeti">
            <GlobeIcon />
          </span>
          <span aria-label="Topluluk rozeti">
            <UsersIcon />
          </span>
          <span aria-label="Doğrulama rozeti">
            <ShieldIcon />
          </span>
        </div>
      </section>

      <section className="recent-section">
        <div className="results-toolbar">
          <h2>Son katkılar</h2>
          <span className="section-kicker">Tümü</span>
        </div>
        <div className="profile-contribution-list">
          {profile.recentContributions.map((contribution, index) => (
            <article key={`${contribution.entrySlug}-${index}`} className="profile-contribution-card">
              <div className="profile-contribution-head">
                <div>
                  <strong>{contribution.label}</strong>
                  <p>{contribution.summary}</p>
                </div>
                <span className="tiny-level-chip">{index === 0 ? "A2" : index === 1 ? "C1" : "B2"}</span>
              </div>
              <div className="profile-contribution-meta">
                <span>Skor {profile.stats.votesReceived + index * 12}</span>
                <span>{index === 0 ? "2 gün önce" : index === 1 ? "1 hafta önce" : "2 hafta önce"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
