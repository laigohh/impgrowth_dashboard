'use client'

import { useState } from 'react'
import { completeTask, generateDailyTasks } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Task {
    id: string
    task_type: string
    status: string
    target_group_id: number | null
    target_url: string | null
    created_at: Date
    completed_at: Date | null
    profile_id: string
    profile_name: string | null
    adspower_id: string
    group_name: string | null
}

interface Profile {
    profile_id: string
    profile_name: string | null
    adspower_id: string
    tasks: Task[]
}

interface TasksContentProps {
    profiles: Profile[]
}

export default function TasksContent({ profiles }: TasksContentProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)

    const handleCompleteTask = async (taskId: string) => {
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

    const handleGenerateTasks = async () => {
        try {
            setLoading('generating')
            await generateDailyTasks()
            router.refresh()
        } catch (error) {
            console.error('Error generating tasks:', error)
            alert('Failed to generate tasks')
        } finally {
            setLoading(null)
        }
    }

    const getTaskDescription = (task: Task) => {
        const groupName = task.group_name || 'Unknown Group'
        
        switch (task.task_type) {
            case 'approve_post':
                return `Approve posts in ${groupName}`
            case 'comment_group':
                return `Comment on posts in ${groupName}`
            case 'like_group_post':
                return `Like posts in ${groupName}`
            case 'like_comment':
                return `Like comments in ${groupName}`
            case 'schedule_post':
                return `Schedule posts in ${groupName}`
            case 'answer_dm':
                return 'Answer direct messages'
            case 'like_feed':
                return 'Like posts and videos in feed'
            default:
                return task.task_type
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">ImpGrowth</h2>
                </div>
                <nav className="mt-4">
                    <Link 
                        href="/secret" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Dashboard
                    </Link>
                    <Link 
                        href="/secret/social-profiles" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Social Profiles
                    </Link>
                    <Link 
                        href="/secret/facebook-groups" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Facebook Groups
                    </Link>
                    <Link 
                        href="/secret/tasks" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                    >
                        Tasks
                    </Link>
                    <Link 
                        href="#" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Analytics
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Daily Tasks</h1>
                        <button
                            onClick={handleGenerateTasks}
                            disabled={loading === 'generating'}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading === 'generating' ? 'Generating...' : 'Generate Tasks'}
                        </button>
                    </div>

                    <div className="grid gap-6">
                        {profiles.map(profile => (
                            <div
                                key={profile.profile_id}
                                className="bg-white p-6 rounded-lg shadow"
                            >
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {profile.adspower_id} - {profile.profile_name || 'Unknown Profile'}
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-700">Facebook Tasks:</h3>
                                    <div className="grid gap-3">
                                        {profile.tasks.map(task => (
                                            <div
                                                key={task.id}
                                                className="flex justify-between items-center bg-gray-50 p-3 rounded"
                                            >
                                                <span className="text-gray-600">
                                                    {getTaskDescription(task)}
                                                </span>
                                                <button
                                                    onClick={() => handleCompleteTask(task.id)}
                                                    disabled={loading === task.id}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-green-300"
                                                >
                                                    {loading === task.id ? 'Completing...' : 'Complete'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {profiles.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No pending tasks. Click "Generate Tasks" to create new tasks.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 