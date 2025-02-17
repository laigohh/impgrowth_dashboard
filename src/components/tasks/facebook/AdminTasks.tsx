'use client'

import { useState } from 'react'
import type { Task } from '@/types/database'
import { isFacebookAdminTask } from './types'

interface AdminTasksProps {
    tasks: Task[]
    profileId: string
}

type GroupedTasks = Record<string, Task[]>

export default function AdminTasks({ tasks, profileId }: AdminTasksProps) {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
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

    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }))
    }

    if (filteredTasks.length === 0) return null

    return (
        <div className="space-y-2">
            {Object.entries(groupedTasks).map(([groupName, tasks]) => (
                <div key={groupName} className="border rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleGroup(groupName)}
                        className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                    >
                        <h3 className="font-medium text-gray-700">{groupName}</h3>
                        <span className="text-gray-400">
                            {expandedGroups[groupName] ? '▼' : '▶'}
                        </span>
                    </button>
                    {expandedGroups[groupName] && (
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
                    )}
                </div>
            ))}
        </div>
    )
} 