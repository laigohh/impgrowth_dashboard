'use server'

import { db } from "@/db/client"
import { tasks, profileGroups, socialProfiles } from "@/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { nanoid } from 'nanoid'
import { revalidatePath } from "next/cache"
import type { AdminTaskType } from "@/types/database"

interface NewTask {
    id: string
    profile_id: string
    task_type: AdminTaskType
    target_group_id?: number
    order: number
    action_count: number | null
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

        // For each admin profile
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

            const profileTasks: NewTask[] = []
            
            // For each group, generate tasks with action counts
            for (const { group_id } of adminGroups) {
                // Generate group-specific tasks with counts
                profileTasks.push({
                    id: nanoid(),
                    profile_id: profile.id,
                    task_type: 'approve_post',
                    target_group_id: group_id,
                    order: Math.floor(Math.random() * 1000000),
                    action_count: null // Approval doesn't need a count
                })

                profileTasks.push({
                    id: nanoid(),
                    profile_id: profile.id,
                    task_type: 'comment_group',
                    target_group_id: group_id,
                    order: Math.floor(Math.random() * 1000000),
                    action_count: getRandomNumber(2, 3)
                })

                profileTasks.push({
                    id: nanoid(),
                    profile_id: profile.id,
                    task_type: 'like_group_post',
                    target_group_id: group_id,
                    order: Math.floor(Math.random() * 1000000),
                    action_count: getRandomNumber(2, 4)
                })

                profileTasks.push({
                    id: nanoid(),
                    profile_id: profile.id,
                    task_type: 'like_comment',
                    target_group_id: group_id,
                    order: Math.floor(Math.random() * 1000000),
                    action_count: getRandomNumber(1, 3)
                })
            }

            // Add non-group-specific tasks
            profileTasks.push({
                id: nanoid(),
                profile_id: profile.id,
                task_type: 'schedule_post',
                order: Math.floor(Math.random() * 1000000),
                action_count: null
            })

            profileTasks.push({
                id: nanoid(),
                profile_id: profile.id,
                task_type: 'answer_dm',
                order: Math.floor(Math.random() * 1000000),
                action_count: null
            })

            profileTasks.push({
                id: nanoid(),
                profile_id: profile.id,
                task_type: 'like_feed',
                order: Math.floor(Math.random() * 1000000),
                action_count: getRandomNumber(3, 5)
            })

            // Insert tasks
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

// Update this function to delete tasks instead of marking them completed
export async function completeAllProfileTasks(profileId: string) {
    try {
        await db
            .delete(tasks)
            .where(and(
                eq(tasks.profile_id, profileId),
                eq(tasks.status, 'pending')
            ))

        revalidatePath('/secret/tasks')
        return { success: true }
    } catch (error) {
        console.error('Error deleting profile tasks:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to delete profile tasks')
    }
} 