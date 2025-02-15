import type { Task } from '@/types/database'

export type FacebookAdminTask = Task & {
    task_type: 'approve_post' | 'comment_group' | 'like_group_post' | 'like_comment' | 'schedule_post' | 'answer_dm' | 'like_feed'
}

export function isFacebookAdminTask(task: Task): boolean {
    const adminTaskTypes = [
        'approve_post',
        'comment_group',
        'like_group_post',
        'like_comment',
        'schedule_post',
        'answer_dm',
        'like_feed'
    ]
    return adminTaskTypes.includes(task.task_type)
} 