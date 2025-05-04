CREATE TABLE `fb_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_name` text NOT NULL,
	`facebook_type` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fb_profiles_profile_name_unique` ON `fb_profiles` (`profile_name`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`task_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`target_group_id` integer,
	`target_url` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` integer,
	`order` integer,
	`action_count` integer,
	FOREIGN KEY (`profile_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_group_id`) REFERENCES `facebook_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profile_groups` (
	`profile_id` text NOT NULL,
	`group_id` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`profile_id`, `group_id`),
	FOREIGN KEY (`profile_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`group_id`) REFERENCES `facebook_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_profile_groups`("profile_id", "group_id", "role") SELECT "profile_id", "group_id", "role" FROM `profile_groups`;--> statement-breakpoint
DROP TABLE `profile_groups`;--> statement-breakpoint
ALTER TABLE `__new_profile_groups` RENAME TO `profile_groups`;--> statement-breakpoint
PRAGMA foreign_keys=ON;