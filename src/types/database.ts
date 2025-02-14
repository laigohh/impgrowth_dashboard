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