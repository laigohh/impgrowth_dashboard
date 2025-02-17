'use client'

import { useState } from 'react'
import type { Task } from '@/types/database'
import { isFacebookEngagementTask } from './types'

interface EngagementTasksProps {
    tasks: Task[]
    profileId: string
}

type GroupedTasks = Record<string, Task[]>

export default function EngagementTasks({ tasks, profileId }: EngagementTasksProps) {
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
    const filteredTasks = tasks.filter(isFacebookEngagementTask)

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
            case 'comment_posts':
                return `Comment on${count} posts`
            case 'answer_comments':
                return `Answer${count} comments`
            case 'like_posts':
                return `Like${count} posts`
            case 'invite_friends':
                return `Invite${count} friends to group`
            case 'add_friends':
                return `Add${count} friends`
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