import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres"; 
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/app_db";
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
