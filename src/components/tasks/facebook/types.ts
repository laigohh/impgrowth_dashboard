import type { Task } from '@/types/database'

export type FacebookAdminTask = Task & {
    task_type: 'approve_post' | 'comment_group' | 'like_group_post' | 'like_comment' | 'schedule_post' | 'answer_dm' | 'like_feed'
}

export type FacebookEngagementTask = Task & {
    task_type: 'comment_posts' | 'answer_comments' | 'like_posts' | 'invite_friends' | 'add_friends'
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

export function isFacebookEngagementTask(task: Task): boolean {
    const engagementTaskTypes = [
        'comment_posts',
        'answer_comments',
        'like_posts',
        'invite_friends',
        'add_friends'
    ]
    return engagementTaskTypes.includes(task.task_type)
} 