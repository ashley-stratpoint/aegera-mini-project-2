import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    throw new Error("DATABASE_URL is missing from .env.local");
}

const sql = neon(dbUrl);
const db = drizzle(sql);

const main = async () => {
    try {
        await migrate(db, {
            migrationsFolder: "db/migrations",
        });

        console.log("Migration successful!");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

main();