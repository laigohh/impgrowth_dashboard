import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export async function up(db: any): Promise<void> {
    await db.run(sql`
        CREATE TABLE tasks (
            id TEXT PRIMARY KEY,
            profile_id TEXT NOT NULL REFERENCES social_profiles(id),
            task_type TEXT NOT NULL CHECK(task_type IN ('approve_post', 'comment_group', 'like_group_post', 'like_comment', 'schedule_post', 'answer_dm', 'like_feed')),
            status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
            target_group_id INTEGER REFERENCES facebook_groups(id),
            target_url TEXT,
            created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
            completed_at INTEGER
        )
    `)
}

export async function down(db: any): Promise<void> {
    await db.run(sql`DROP TABLE tasks`)
} 