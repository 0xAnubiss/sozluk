import { notFound } from "next/navigation";
import { ProfileOverview } from "@/components/profile-overview";
import { SessionProfile } from "@/components/session-profile";
import { getProfileByHandle } from "@/lib/dictionary";

type ProfilePageProps = {
  params: Promise<{
    handle: string;
  }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { handle } = await params;

  if (handle === "me") {
    return <SessionProfile />;
  }

  const profile = await getProfileByHandle(handle);

  if (!profile) {
    notFound();
  }

  return <ProfileOverview profile={profile} />;
}
