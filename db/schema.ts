import { pgTable, serial, text, timestamp, varchar, integer, unique, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


export const users = pgTable('users', {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull(),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    content: text('content').notNull(),
    authorId: varchar('author_id', { length: 255 }).references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    authorId: varchar('author_id', { length: 255 }).references(() => users.id).notNull(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const likes = pgTable('likes', {
    userId: varchar('user_id', { length: 255 }).references(() => users.id).notNull(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
     pk: primaryKey({ columns: [table.userId, table.postId] }), // Composite PK prevents duplicate likes
}));

// RELATIONS

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, { fields: [posts.authorId], references: [users.id] }),
    comments: many(comments),
    likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, { fields: [comments.postId], references: [posts.id] }),
    author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
    post: one(posts, { fields: [likes.postId], references: [posts.id] }),
    user: one(users, { fields: [likes.userId], references: [users.id] }),
}));