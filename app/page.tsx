import { SearchHero } from "@/components/search-hero";
import { getFeaturedEntries, getTopContributors } from "@/lib/dictionary";

type HomePageProps = {
  searchParams?: Promise<{
    q?: string;
    pair?: "tr-fr" | "fr-tr";
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const [entries, contributors] = await Promise.all([
    getFeaturedEntries(),
    getTopContributors()
  ]);

  return (
    <SearchHero
      entries={entries}
      contributors={contributors}
      initialQuery={resolvedSearchParams?.q ?? ""}
      initialLanguagePair={resolvedSearchParams?.pair ?? "tr-fr"}
    />
  );
}
