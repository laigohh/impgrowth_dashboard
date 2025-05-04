CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`facebook_profile_url` text,
	`contact_profile` text,
	`email` text,
	`groups_purchased` text,
	`status` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `group_name_idx` ON `facebook_groups` (`name`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `profile_groups` (`role`);--> statement-breakpoint
CREATE INDEX `profile_id_idx` ON `profile_groups` (`profile_id`);--> statement-breakpoint
CREATE INDEX `group_id_idx` ON `profile_groups` (`group_id`);--> statement-breakpoint
CREATE INDEX `adspower_id_idx` ON `social_profiles` (`adspower_id`);--> statement-breakpoint
CREATE INDEX `active_idx` ON `social_profiles` (`active`);