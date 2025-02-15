'use client'

import { useState } from 'react'
import { completeTask } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'
import type { Task } from '@/types/database'
import { isFacebookAdminTask } from './types'

interface AdminTasksProps {
    tasks: Task[]
    profileId: string
}

interface GroupedTasks {
    [groupName: string]: Task[]
}

export default function AdminTasks({ tasks, profileId }: AdminTasksProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
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

    const handleComplete = async (taskId: string) => {
        try {
            setLoading(taskId)
            await completeTask(taskId)
            router.refresh()
        } catch (error) {
            console.error('Error completing task:', error)
            alert('Failed to complete task')
        } finally {
            setLoading(null)
        }
    }

    const getTaskDescription = (task: Task) => {
        switch (task.task_type) {
            case 'approve_post':
                return 'Approve posts'
            case 'comment_group':
                return 'Comment on posts'
            case 'like_group_post':
                return 'Like posts'
            case 'like_comment':
                return 'Like comments'
            case 'schedule_post':
                return 'Schedule posts'
            case 'answer_dm':
                return 'Answer direct messages'
            case 'like_feed':
                return 'Like posts and videos in feed'
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
                                className="flex justify-between items-center p-4 hover:bg-gray-50"
                            >
                                <span className="text-gray-600">
                                    {getTaskDescription(task)}
                                </span>
                                <button
                                    onClick={() => handleComplete(task.id)}
                                    disabled={loading === task.id}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-green-300"
                                >
                                    {loading === task.id ? 'Completing...' : 'Complete'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
} 