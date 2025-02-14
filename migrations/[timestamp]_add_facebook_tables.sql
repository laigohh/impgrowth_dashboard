CREATE TABLE `facebook_groups` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `name` text NOT NULL,
  `url` text NOT NULL,
  UNIQUE(`url`)
);

CREATE TABLE `profile_groups` (
  `profile_id` text NOT NULL,
  `group_id` integer NOT NULL,
  `role` text NOT NULL CHECK(`role` IN ('admin', 'engagement')),
  PRIMARY KEY (`profile_id`, `group_id`),
  FOREIGN KEY (`profile_id`) REFERENCES `social_profiles`(`id`),
  FOREIGN KEY (`group_id`) REFERENCES `facebook_groups`(`id`)
); 