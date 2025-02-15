'use server'

import { db } from "@/db/client"
import { tasks, profileGroups, socialProfiles } from "@/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { nanoid } from 'nanoid'
import { revalidatePath } from "next/cache"
import type { AdminTaskType } from "@/types/database"

// Generate tasks for all admin profiles
export async function generateDailyTasks() {
    try {
        // First, clear any pending tasks from previous day
        await db.delete(tasks)
            .where(eq(tasks.status, 'pending'))

        // Get all active profiles with admin role in any group
        const adminProfiles = await db
            .select({
                id: socialProfiles.id,
            })
            .from(socialProfiles)
            .innerJoin(
                profileGroups,
                eq(socialProfiles.id, profileGroups.profile_id)
            )
            .where(
                and(
                    eq(socialProfiles.active, true),
                    eq(profileGroups.role, 'admin')
                )
            )
            .groupBy(socialProfiles.id)

        // Define task types that need to be created for each admin
        const taskTypes: AdminTaskType[] = [
            'approve_post',
            'comment_group',
            'like_group_post',
            'like_comment',
            'schedule_post',
            'answer_dm',
            'like_feed'
        ]

        // Generate tasks for each admin profile
        for (const profile of adminProfiles) {
            // Get groups where this profile is admin
            const adminGroups = await db
                .select({
                    group_id: profileGroups.group_id
                })
                .from(profileGroups)
                .where(
                    and(
                        eq(profileGroups.profile_id, profile.id),
                        eq(profileGroups.role, 'admin')
                    )
                )

            // Create tasks
            await db.transaction(async (tx) => {
                for (const taskType of taskTypes) {
                    // For group-specific tasks, create one for each group
                    if (['approve_post', 'comment_group', 'like_group_post', 'like_comment', 'schedule_post'].includes(taskType)) {
                        for (const { group_id } of adminGroups) {
                            await tx.insert(tasks).values({
                                id: nanoid(),
                                profile_id: profile.id,
                                task_type: taskType,
                                target_group_id: group_id
                            })
                        }
                    } else {
                        // For non-group-specific tasks, create one per profile
                        await tx.insert(tasks).values({
                            id: nanoid(),
                            profile_id: profile.id,
                            task_type: taskType
                        })
                    }
                }
            })
        }

        revalidatePath('/secret/tasks')
        return { success: true }
    } catch (error) {
        console.error('Error generating tasks:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to generate tasks')
    }
}

export async function completeTask(taskId: string) {
    try {
        await db
            .update(tasks)
            .set({
                status: 'completed',
                completed_at: sql`CURRENT_TIMESTAMP`
            })
            .where(eq(tasks.id, taskId))

        revalidatePath('/secret/tasks')
        return { success: true }
    } catch (error) {
        console.error('Error completing task:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to complete task')
    }
} 