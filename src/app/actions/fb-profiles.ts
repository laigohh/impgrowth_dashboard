'use server'

import { db } from "@/db/client"
import { profileGroups } from "@/db/schema"
import type { GroupAssignment } from "@/types/database"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

interface CreateFBProfileParams {
    profile_id: string
    groups: GroupAssignment[]
}

export async function createFBProfile({ profile_id, groups }: CreateFBProfileParams) {
    try {
        const session = await auth()
        if (!session) {
            throw new Error('Not authenticated')
        }

        // Insert the group assignments directly into profile_groups
        await db.transaction(async (tx) => {
            // Insert all group assignments
            await Promise.all(
                groups.map(group => 
                    tx.insert(profileGroups).values({
                        profile_id: profile_id,
                        group_id: group.group_id,
                        role: group.role
                    })
                )
            )
        })

        revalidatePath('/secret/social-profiles')
        return { success: true }
    } catch (error) {
        console.error('Error in createFBProfile:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to create Facebook profile')
    }
} 