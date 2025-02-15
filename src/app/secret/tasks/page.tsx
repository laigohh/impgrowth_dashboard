import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db/client"
import { tasks, socialProfiles, facebookGroups } from "@/db/schema"
import { eq, and, isNotNull } from "drizzle-orm"
import TasksContent from "@/components/TasksContent"

export default async function Tasks() {
    const session = await auth()
    if (!session) return redirect('/profile')

    try {
        const tasksList = await db
            .select({
                id: tasks.id,
                task_type: tasks.task_type,
                status: tasks.status,
                target_group_id: tasks.target_group_id,
                target_url: tasks.target_url,
                created_at: tasks.created_at,
                completed_at: tasks.completed_at,
                profile_id: tasks.profile_id,
                profile_name: socialProfiles.name,
                adspower_id: socialProfiles.adspower_id,
                group_name: facebookGroups.name,
            })
            .from(tasks)
            .leftJoin(socialProfiles, eq(tasks.profile_id, socialProfiles.id))
            .leftJoin(facebookGroups, eq(tasks.target_group_id, facebookGroups.id))
            .where(and(
                eq(tasks.status, 'pending'),
                isNotNull(socialProfiles.adspower_id)
            ))

        // Group tasks by profile
        const groupedTasks = tasksList.reduce((acc, task) => {
            if (!task.adspower_id) return acc // Skip if no adspower_id
            
            const profileId = task.profile_id
            if (!acc[profileId]) {
                acc[profileId] = {
                    profile_id: profileId,
                    profile_name: task.profile_name,
                    adspower_id: task.adspower_id,
                    tasks: []
                }
            }
            acc[profileId].tasks.push({
                id: task.id,
                task_type: task.task_type,
                status: task.status,
                target_group_id: task.target_group_id,
                target_url: task.target_url,
                created_at: task.created_at,
                completed_at: task.completed_at,
                profile_id: task.profile_id,
                profile_name: task.profile_name,
                adspower_id: task.adspower_id,
                group_name: task.group_name
            })
            return acc
        }, {} as Record<string, {
            profile_id: string;
            profile_name: string | null;
            adspower_id: string;
            tasks: Array<{
                id: string;
                task_type: string;
                status: string;
                target_group_id: number | null;
                target_url: string | null;
                created_at: Date;
                completed_at: Date | null;
                profile_id: string;
                profile_name: string | null;
                adspower_id: string;
                group_name: string | null;
            }>;
        }>)

        return <TasksContent profiles={Object.values(groupedTasks)} />
    } catch (error) {
        console.error('Error fetching tasks:', error)
        return <div>Error loading tasks</div>
    }
} 