import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
const connectionString = process.env.DATABASE_URL ?? "";

if (!connectionString) {
	throw new Error(
		"Missing DATABASE_URL environment variable. Set DATABASE_URL in your .env or environment and restart the server.",
	);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };