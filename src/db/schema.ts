import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const socialProfiles = sqliteTable('social_profiles', {
  id: text('id').primaryKey(),
  adspower_id: text('adspower_id').notNull(),
  name: text('name').notNull(),
  gmail: text('gmail'),
  proxy: text('proxy'),
  facebook_url: text('facebook_url'),
  reddit_url: text('reddit_url'),
  youtube_url: text('youtube_url'),
  instagram_url: text('instagram_url'),
  pinterest_url: text('pinterest_url'),
  twitter_url: text('twitter_url'),
  thread_url: text('thread_url'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true)
});

export const facebookGroups = sqliteTable('facebook_groups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  url: text('url').notNull().unique()
});

export const fbProfiles = sqliteTable('fb_profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  profile_name: text('profile_name').notNull().unique(),
  facebook_type: text('facebook_type', {
    enum: ['admin', 'engagement']
  }).notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`)
});

export const profileGroups = sqliteTable('profile_groups', {
  profile_id: text('profile_id')
    .notNull()
    .references(() => socialProfiles.id),
  group_id: integer('group_id')
    .notNull()
    .references(() => facebookGroups.id),
  role: text('role', { 
    enum: ['admin', 'engagement'] 
  }).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.profile_id, table.group_id] })
  }
}); 