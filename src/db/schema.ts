import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  done: integer('done', { mode: 'boolean' }).default(false),
});