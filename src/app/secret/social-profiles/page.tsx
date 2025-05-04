import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { socialProfiles, facebookGroups, profileGroups } from "@/db/schema";
import { desc, sql, eq } from "drizzle-orm";
import type { SocialProfile } from "@/types/database";
import SocialProfilesContent from "@/components/SocialProfilesContent";
import { cache } from "react";
import { unstable_cache } from 'next/cache';

// Default page size for pagination
const PAGE_SIZE = 10;

// Cache group counts for 1 minute to avoid frequent recalculations
const getGroupsWithCounts = unstable_cache(
    async () => {
        return db
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
    },
    ['groups-with-counts'],
    { revalidate: 60 } // Cache for 60 seconds
);

// Cache total count for profiles
const getTotalProfileCount = unstable_cache(
    async () => {
        const totalCountResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(socialProfiles);
        return totalCountResult[0].count;
    },
    ['social-profiles-total-count'],
    { revalidate: 60 } // Cache for 60 seconds
);

export default async function SocialProfiles({
    searchParams,
}: {
    searchParams: { page?: string }
}) {
    const session = await auth();
    if (!session) return redirect('/profile');

    // Get current page from query params or default to 1
    const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
    const offset = (currentPage - 1) * PAGE_SIZE;

    try {
        // Use cached group counts
        const groupsWithCounts = await getGroupsWithCounts();
        
        // Get total count from cache
        const totalCount = await getTotalProfileCount();
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);

        // Create prepared statement for pagination query
        const profiles = await db
            .select()
            .from(socialProfiles)
            .where(
                totalCount > 100 
                ? eq(socialProfiles.active, true) // Only active profiles if we have many
                : undefined
            )
            .limit(PAGE_SIZE)
            .offset(offset);

        return (
            <div className="flex-1">
                <SocialProfilesContent 
                    profiles={profiles} 
                    groups={groupsWithCounts}
                    userEmail={session.user?.email ?? ''} 
                    pagination={{
                        currentPage,
                        totalPages,
                        totalCount
                    }}
                />
            </div>
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading profiles</div>;
    }
} 