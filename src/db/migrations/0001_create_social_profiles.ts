import { sql } from "drizzle-orm"

export async function up(db: any): Promise<void> {
    await db.run(sql`
        CREATE TABLE social_profiles (
            id TEXT PRIMARY KEY,
            adspower_id TEXT NOT NULL,
            name TEXT NOT NULL,
            gmail TEXT,
            proxy TEXT,
            facebook_url TEXT,
            reddit_url TEXT,
            youtube_url TEXT,
            instagram_url TEXT,
            pinterest_url TEXT,
            twitter_url TEXT,
            thread_url TEXT,
            active INTEGER NOT NULL DEFAULT 1
        )
    `)
}

export async function down(db: any): Promise<void> {
    await db.run(sql`DROP TABLE social_profiles`)
} 