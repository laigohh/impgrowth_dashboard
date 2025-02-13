import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { socialProfiles } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { SocialProfile } from "@/types/database";
import SocialProfilesContent from "@/components/SocialProfilesContent";

export default async function SocialProfiles() {
    const session = await auth();
    if (!session) return redirect('/profile');

    try {
        const profiles = await db
            .select()
            .from(socialProfiles);

        return <SocialProfilesContent profiles={profiles} userEmail={session.user?.email ?? ''} />;
    } catch (error) {
        console.error('Error fetching profiles:', error);
        return <div>Error loading profiles</div>;
    }
} 