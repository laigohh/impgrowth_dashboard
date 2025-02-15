import { Task } from '@/types/database'
import { isFacebookAdminTask } from './types'

interface AdminTasksProps {
    tasks: Task[]
    onComplete: (taskId: string) => Promise<void>
    loading: string | null
}

export default function AdminTasks({ tasks, onComplete, loading }: AdminTasksProps) {
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

    const adminTasks = tasks.filter(isFacebookAdminTask)

    if (adminTasks.length === 0) return null

    return (
        <div className="grid gap-3">
            {adminTasks.map(task => (
                <div
                    key={task.id}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded"
                >
                    <span className="text-gray-600">
                        {getTaskDescription(task)}
                    </span>
                    <button
                        onClick={() => onComplete(task.id)}
                        disabled={loading === task.id}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-green-300"
                    >
                        {loading === task.id ? 'Completing...' : 'Complete'}
                    </button>
                </div>
            ))}
        </div>
    )
} 