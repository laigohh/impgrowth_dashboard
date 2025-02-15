import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { socialProfiles, facebookGroups } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { SocialProfile } from "@/types/database";
import SocialProfilesContent from "@/components/SocialProfilesContent";

export default async function SocialProfiles() {
    const session = await auth();
    if (!session) return redirect('/profile');

    try {
        const [profiles, groups] = await Promise.all([
            db.select().from(socialProfiles),
            db.select().from(facebookGroups)
        ]);

        return (
            <div className="flex-1">
                <SocialProfilesContent 
                    profiles={profiles} 
                    groups={groups}
                    userEmail={session.user?.email ?? ''} 
                />
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading profiles</div>;
    }
} 