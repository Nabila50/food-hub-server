-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'ACTIVE',
ALTER COLUMN "emailVerified" DROP NOT NULL;
