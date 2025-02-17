'use server'

import { db } from "@/db/client"
import { tasks, profileGroups as profileGroupsTable, socialProfiles } from "@/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { nanoid } from 'nanoid'
import { revalidatePath } from "next/cache"
import type { AdminTaskType, EngagementTaskType } from "@/types/database"

interface NewTask {
    id: string
    profile_id: string
    task_type: AdminTaskType | EngagementTaskType
    target_group_id?: number
    order: number
    action_count: number | null
}

interface AdminProfileGroup {
    profile_id: string
    group_id: number
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

        // Get all active profiles with their roles and groups
        const profilesWithGroups = await db
            .select({
                profile_id: socialProfiles.id,
                group_id: profileGroupsTable.group_id,
                role: profileGroupsTable.role,
            })
            .from(socialProfiles)
            .innerJoin(
                profileGroupsTable,
                eq(socialProfiles.id, profileGroupsTable.profile_id)
            )
            .where(
                eq(socialProfiles.active, true)
            )

        // Group profiles with their groups and roles
        const groupedProfiles = profilesWithGroups.reduce<Record<string, { role: 'admin' | 'engagement', groups: number[] }>>((acc, { profile_id, group_id, role }) => {
            if (!acc[profile_id]) {
                acc[profile_id] = { role, groups: [] }
            }
            if (group_id) acc[profile_id].groups.push(group_id)
            return acc
        }, {})

        // Prepare all tasks in a single array
        const allTasks: NewTask[] = []

        // Generate tasks for each profile
        Object.entries(groupedProfiles).forEach(([profile_id, { role, groups }]) => {
            if (role === 'admin') {
                // Generate admin tasks (existing logic)
                groups.forEach(group_id => {
                    allTasks.push(
                        {
                            id: nanoid(),
                            profile_id,
                            task_type: 'approve_post',
                            target_group_id: group_id,
                            order: Math.floor(Math.random() * 1000000),
                            action_count: null
                        },
                        {
                            id: nanoid(),
                            profile_id,
                            task_type: 'comment_group',
                            target_group_id: group_id,
                            order: Math.floor(Math.random() * 1000000),
                            action_count: getRandomNumber(2, 3)
                        },
                        {
                            id: nanoid(),
                            profile_id,
                            task_type: 'like_group_post',
                            target_group_id: group_id,
                            order: Math.floor(Math.random() * 1000000),
                            action_count: getRandomNumber(2, 4)
                        },
                        {
                            id: nanoid(),
                            profile_id,
                            task_type: 'like_comment',
                            target_group_id: group_id,
                            order: Math.floor(Math.random() * 1000000),
                            action_count: getRandomNumber(1, 3)
                        }
                    )
                })

                // Add non-group-specific admin tasks
                allTasks.push(
                    {
                        id: nanoid(),
                        profile_id,
                        task_type: 'schedule_post',
                        order: Math.floor(Math.random() * 1000000),
                        action_count: null
                    },
                    {
                        id: nanoid(),
                        profile_id,
                        task_type: 'answer_dm',
                        order: Math.floor(Math.random() * 1000000),
                        action_count: null
                    },
                    {
                        id: nanoid(),
                        profile_id,
                        task_type: 'like_feed',
                        order: Math.floor(Math.random() * 1000000),
                        action_count: getRandomNumber(3, 5)
                    }
                )
            } else {
                // Generate engagement tasks
                groups.forEach(group_id => {
                    allTasks.push(
                        {
                            id: nanoid(),
                            profile_id,
                            task_type: 'comment_posts',
                            target_group_id: group_id,
                            order: Math.floor(Math.random() * 1000000),
                            action_count: getRandomNumber(1, 3)
                        },
                        {
                            id: nanoid(),
                            profile_id,
                            task_type: 'answer_comments',
                            target_group_id: group_id,
                            order: Math.floor(Math.random() * 1000000),
                            action_count: getRandomNumber(1, 2)
                        },
                        {
                            id: nanoid(),
                            profile_id,
                            task_type: 'like_posts',
                            target_group_id: group_id,
                            order: Math.floor(Math.random() * 1000000),
                            action_count: getRandomNumber(2, 4)
                        },
                        {
                            id: nanoid(),
                            profile_id,
                            task_type: 'invite_friends',
                            target_group_id: group_id,
                            order: Math.floor(Math.random() * 1000000),
                            action_count: getRandomNumber(4, 6)
                        }
                    )
                })

                // Add general engagement tasks
                allTasks.push({
                    id: nanoid(),
                    profile_id,
                    task_type: 'add_friends',
                    order: Math.floor(Math.random() * 1000000),
                    action_count: getRandomNumber(3, 5)
                })
            }
        })

        // Insert all tasks in a single transaction
        // Split into chunks to avoid SQLite parameter limits
        const CHUNK_SIZE = 50
        await db.transaction(async (tx) => {
            for (let i = 0; i < allTasks.length; i += CHUNK_SIZE) {
                const chunk = allTasks.slice(i, i + CHUNK_SIZE)
                await tx.insert(tasks).values(chunk)
            }
        })

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