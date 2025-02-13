CREATE TABLE `social_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_email` text NOT NULL,
	`adspower_id` text NOT NULL,
	`name` text NOT NULL,
	`gmail` text,
	`proxy` text,
	`facebook_url` text,
	`reddit_url` text,
	`youtube_url` text,
	`instagram_url` text,
	`pinterest_url` text,
	`twitter_url` text,
	`thread_url` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
