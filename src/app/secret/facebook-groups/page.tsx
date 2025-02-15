import { db } from "@/db/client"
import { facebookGroups, profileGroups, socialProfiles } from "@/db/schema"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { eq, and } from "drizzle-orm"

interface AdminProfile {
    profile_name: string;
}

interface GroupWithAdmins {
    id: number;
    name: string;
    url: string;
    admins: AdminProfile[];
}

export default async function FacebookGroups() {
    const session = await auth();
    if (!session) return redirect('/profile');

    // Fetch groups and their associated profiles with admin role
    const groups = await db
        .select({
            id: facebookGroups.id,
            name: facebookGroups.name,
            url: facebookGroups.url,
        })
        .from(facebookGroups);

    // Fetch admin profiles for each group
    const groupsWithAdmins: GroupWithAdmins[] = await Promise.all(
        groups.map(async (group) => {
            const admins = await db
                .select({
                    profile_name: socialProfiles.name,
                })
                .from(profileGroups)
                .innerJoin(
                    socialProfiles,
                    eq(socialProfiles.id, profileGroups.profile_id)
                )
                .where(
                    and(
                        eq(profileGroups.role, 'admin'),
                        eq(profileGroups.group_id, group.id)
                    )
                );

            return {
                ...group,
                admins,
            };
        })
    );

    return (
        <div className="flex-1 overflow-auto">
            <header className="bg-white shadow-sm">
                <div className="px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Facebook Groups</h1>
                        <span className="text-sm text-gray-500">
                            ({groupsWithAdmins.length} groups)
                        </span>
                    </div>
                </div>
            </header>

            <div className="p-8">
                <div className="grid gap-6">
                    {groupsWithAdmins.map(group => (
                        <div 
                            key={group.id} 
                            className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {group.name}
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium mr-2">Admins:</span>
                                                <span>
                                                    {group.admins.map(admin => admin.profile_name).join(', ') || 'No admins'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <a 
                                        href={group.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        Visit Group
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 