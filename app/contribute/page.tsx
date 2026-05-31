import { Suspense } from "react";
import { ContributionComposer } from "@/components/contribution-composer";

export default function ContributePage() {
  return (
    <div className="page-shell">
      <section className="page-intro">
        <span className="section-kicker">Katkı ekranı</span>
        <h1>Madde ve anlam ekle</h1>
        <p>Yeni madde oluştur, var olan maddeye veri ekle ve her tanımı kendi düzeyiyle kaydet.</p>
      </section>

      <Suspense fallback={null}>
        <ContributionComposer />
      </Suspense>
    </div>
  );
}
