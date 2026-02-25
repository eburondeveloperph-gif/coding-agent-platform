ALTER TABLE "tasks" ALTER COLUMN "selected_agent" SET DEFAULT 'codemax';--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "max_duration" SET DEFAULT 300;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "enable_browser" boolean DEFAULT false;
