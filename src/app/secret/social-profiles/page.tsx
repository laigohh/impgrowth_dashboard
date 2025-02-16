import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { socialProfiles, facebookGroups, profileGroups } from "@/db/schema";
import { desc, sql, eq } from "drizzle-orm";
import type { SocialProfile } from "@/types/database";
import SocialProfilesContent from "@/components/SocialProfilesContent";

export default async function SocialProfiles() {
    const session = await auth();
    if (!session) return redirect('/profile');

    try {
        const groupsWithCounts = await db
            .select({
                id: facebookGroups.id,
                name: facebookGroups.name,
                url: facebookGroups.url,
                admin_count: sql<number>`
                    COUNT(CASE WHEN ${profileGroups.role} = 'admin' THEN 1 END)
                `.as('admin_count'),
                engagement_count: sql<number>`
                    COUNT(CASE WHEN ${profileGroups.role} = 'engagement' THEN 1 END)
                `.as('engagement_count'),
            })
            .from(facebookGroups)
            .leftJoin(profileGroups, eq(facebookGroups.id, profileGroups.group_id))
            .groupBy(facebookGroups.id);

        const profiles = await db.select().from(socialProfiles);

        return (
            <div className="flex-1">
                <SocialProfilesContent 
                    profiles={profiles} 
                    groups={groupsWithCounts}
                    userEmail={session.user?.email ?? ''} 
                />
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading profiles</div>;
    }
} 