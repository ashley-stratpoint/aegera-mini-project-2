DROP INDEX "clerk_id_idx";--> statement-breakpoint
ALTER TABLE "likes" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
CREATE INDEX "category_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "comment_post_id_idx" ON "comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "blog_id_idx" ON "posts" USING btree ("blog_id");--> statement-breakpoint
CREATE INDEX "clerk_id_idx" ON "users" USING btree ("clerk_id");