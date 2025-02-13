import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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