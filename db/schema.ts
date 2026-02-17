import { pgTable, serial, text, timestamp, varchar, integer, primaryKey, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
},
    (table) => [index('clerk_id_idx').on(table.clerkId), index('email_idx').on(table.email)],
);

export const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    color: varchar('color', { length: 7 }).default('#3b82f6'),
},
    (table) => [index('category_slug_idx').on(table.slug)],
);

export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    blogId: varchar('blog_id', { length: 255 }).notNull().unique(),
    categoryId: integer('category_id').references(()=> categories.id).notNull(),
    content: text('content').notNull(),
    imageUrl: text('image_url').notNull(),
    authorId: integer('author_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, 
    (table) => [index('blog_id_idx').on(table.blogId)],
);

export const comments = pgTable('comments', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    authorId: integer('author_id').references(() => users.id).notNull(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
},
    (table) => [index('comment_post_id_idx').on(table.postId)],
);

export const likes = pgTable('likes', {
    userId: integer('user_id').references(() => users.id).notNull(),
    postId: integer('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({pk: primaryKey({ columns: [table.userId, table.postId] }),
}));

// RELATIONS

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
    comments: many(comments),
    likes: many(likes),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    author: one(users, { fields: [posts.authorId], references: [users.id] }),
    category: one(categories, { fields: [posts.categoryId], references: [categories.id] }),
    comments: many(comments),
    likes: many(likes),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
    posts: many(posts),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    post: one(posts, { fields: [comments.postId], references: [posts.id] }),
    author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
    post: one(posts, { fields: [likes.postId], references: [posts.id] }),
    user: one(users, { fields: [likes.userId], references: [users.id] }),
}));