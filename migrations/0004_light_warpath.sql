DROP TABLE `fb_profiles`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profile_groups` (
	`profile_id` text NOT NULL,
	`group_id` integer NOT NULL,
	`role` text NOT NULL,
	PRIMARY KEY(`profile_id`, `group_id`),
	FOREIGN KEY (`profile_id`) REFERENCES `social_profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`group_id`) REFERENCES `facebook_groups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_profile_groups`("profile_id", "group_id", "role") SELECT "profile_id", "group_id", "role" FROM `profile_groups`;--> statement-breakpoint
DROP TABLE `profile_groups`;--> statement-breakpoint
ALTER TABLE `__new_profile_groups` RENAME TO `profile_groups`;--> statement-breakpoint
PRAGMA foreign_keys=ON;