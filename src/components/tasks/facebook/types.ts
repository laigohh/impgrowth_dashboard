import type { Task } from '@/types/database'

export type FacebookAdminTask = Task & {
    task_type: 'approve_post' | 'comment_group' | 'like_group_post' | 'like_comment' | 'schedule_post' | 'answer_dm' | 'like_feed'
}

export const isFacebookAdminTask = (task: Task): task is FacebookAdminTask => {
    return ['approve_post', 'comment_group', 'like_group_post', 'like_comment', 'schedule_post', 'answer_dm', 'like_feed'].includes(task.task_type)
} 