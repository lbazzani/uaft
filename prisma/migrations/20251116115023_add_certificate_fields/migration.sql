-- AlterTable
ALTER TABLE "mail_domains" ADD COLUMN     "tlsCertEmail" TEXT,
ADD COLUMN     "tlsCertExpiry" TIMESTAMP(3),
ADD COLUMN     "tlsCertStatus" TEXT DEFAULT 'missing';
