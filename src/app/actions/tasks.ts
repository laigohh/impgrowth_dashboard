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

            // Create all tasks for this profile first
            const profileTasks = []
            
            // Create group-specific tasks
            for (const taskType of taskTypes) {
                if (['approve_post', 'comment_group', 'like_group_post', 'like_comment', 'schedule_post'].includes(taskType)) {
                    for (const { group_id } of adminGroups) {
                        profileTasks.push({
                            id: nanoid(),
                            profile_id: profile.id,
                            task_type: taskType,
                            target_group_id: group_id,
                            order: Math.floor(Math.random() * 1000000) // Random order between 0 and 999999
                        })
                    }
                } else {
                    profileTasks.push({
                        id: nanoid(),
                        profile_id: profile.id,
                        task_type: taskType,
                        order: Math.floor(Math.random() * 1000000) // Random order between 0 and 999999
                    })
                }
            }

            // No need to shuffle since we're using random order numbers
            await db.transaction(async (tx) => {
                for (const task of profileTasks) {
                    await tx.insert(tasks).values(task)
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

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
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