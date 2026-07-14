-- AlterTable
ALTER TABLE "user" ADD COLUMN     "blockedNotificationTypes" "ActivityType"[] DEFAULT ARRAY[]::"ActivityType"[];
