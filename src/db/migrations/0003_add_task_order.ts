import { sql } from 'drizzle-orm'
import { sqliteTable, integer } from 'drizzle-orm/sqlite-core'
import { tasks } from '../schema'

export async function up(db: any): Promise<void> {
    await db.run(sql`
        ALTER TABLE tasks 
        ADD COLUMN order INTEGER;
    `)
}

export async function down(db: any): Promise<void> {
    // SQLite doesn't support dropping columns
    // We would need to recreate the table to remove a column
    console.log('Down migration not supported for SQLite column removal')
} 