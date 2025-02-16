export type SocialProfile = {
  id: string
  adspower_id: string
  name: string
  gmail?: string | null
  proxy?: string | null
  facebook_url?: string | null
  reddit_url?: string | null
  youtube_url?: string | null
  instagram_url?: string | null
  pinterest_url?: string | null
  twitter_url?: string | null
  thread_url?: string | null
  active: boolean
}

export type FacebookGroup = {
  id: number;
  name: string;
  url: string;
}

export type ProfileGroup = {
  profile_id: string;
  group_id: number;
  role: 'admin' | 'engagement';
}

export type FBProfile = {
  id: number;
  profile_name: string;
  facebook_type: 'admin' | 'engagement';
  created_at: Date;
}

export type GroupAssignment = {
  group_id: number;
  role: 'admin' | 'engagement';
}

export type TaskStatus = 'pending' | 'completed'

export type AdminTaskType = 
  | 'approve_post'
  | 'comment_group'
  | 'like_group_post'
  | 'like_comment'
  | 'schedule_post'
  | 'answer_dm'
  | 'like_feed'

export type Task = {
  id: string
  profile_id: string
  task_type: AdminTaskType
  status: TaskStatus
  target_group_id: number | null
  target_url: string | null
  created_at: Date
  completed_at: Date | null
  profile_name: string | null
  adspower_id: string
  group_name: string | null
  action_count: number | null
}

export type Profile = {
  profile_id: string
  profile_name: string | null
  adspower_id: string
  tasks: Task[]
} 