CREATE TABLE `facebook_groups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `facebook_groups_url_unique` ON `facebook_groups` (`url`);--> statement-breakpoint
CREATE TABLE `fb_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_name` text NOT NULL,
	`facebook_type` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `fb_profiles_profile_name_unique` ON `fb_profiles` (`profile_name`);--> statement-breakpoint
CREATE TABLE `profile_groups` (
	`profile_id` integer NOT NULL,
	`group_id` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`profile_id`, `group_id`),
	FOREIGN KEY (`profile_id`) REFERENCES `fb_profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_id`) REFERENCES `facebook_groups`(`id`) ON UPDATE no action ON DELETE no action
);
