'use client'

import type { Task } from '@/types/database'
import { isFacebookAdminTask } from './types'

interface AdminTasksProps {
    tasks: Task[]
    profileId: string
}

type GroupedTasks = Record<string, Task[]>

export default function AdminTasks({ tasks, profileId }: AdminTasksProps) {
    const filteredTasks = tasks.filter(isFacebookAdminTask)

    // Group tasks by group name
    const groupedTasks = filteredTasks.reduce((acc: GroupedTasks, task) => {
        const groupName = task.group_name || 'Other Tasks'
        if (!acc[groupName]) {
            acc[groupName] = []
        }
        acc[groupName].push(task)
        return acc
    }, {})

    const getTaskDescription = (task: Task) => {
        const count = task.action_count ? ` ${task.action_count}` : '';
        
        switch (task.task_type) {
            case 'approve_post':
                return 'Approve posts'
            case 'comment_group':
                return `Comment on${count} posts`
            case 'like_group_post':
                return `Like${count} posts`
            case 'like_comment':
                return `Like${count} comments`
            case 'schedule_post':
                return 'Schedule posts'
            case 'answer_dm':
                return 'Answer direct messages'
            case 'like_feed':
                return `Like${count} posts and videos in feed`
            default:
                return task.task_type
        }
    }

    if (filteredTasks.length === 0) return null

    return (
        <div className="space-y-6">
            {Object.entries(groupedTasks).map(([groupName, tasks]) => (
                <div key={groupName} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2">
                        <h3 className="font-medium text-gray-700">{groupName}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className="p-4 hover:bg-gray-50"
                            >
                                <span className="text-gray-600">
                                    {getTaskDescription(task)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
} 