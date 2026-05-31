import Link from "next/link";
import { InstagramIcon, WhatsappIcon, XIcon, YouTubeIcon } from "@/components/ui-icons";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <strong>Kale&apos;m Sözlük</strong>
          <p>Türkçe-Fransızca ve Fransızca-Türkçe maddeler için topluluk katkılı MVP sözlük.</p>
          <span>© 2026 Kale&apos;m Sözlük</span>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <strong>Sözlük</strong>
            <Link href="/">Arama</Link>
            <Link href="/entry/kitap">Örnek madde</Link>
            <Link href="/contribute">Katkı yap</Link>
          </div>
          <div className="footer-column">
            <strong>Üyelik</strong>
            <Link href="/login">Giriş yap</Link>
            <Link href="/register">Kayıt ol</Link>
            <Link href="/profile/selin-arda">Profil</Link>
          </div>
        </div>

        <div className="footer-social" aria-label="Sosyal medya">
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
            <YouTubeIcon />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">
            <XIcon />
          </a>
          <a href="https://www.whatsapp.com/" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <WhatsappIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
