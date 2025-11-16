-- AlterTable
ALTER TABLE "mail_domains" ADD COLUMN     "tlsAutoRenew" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tlsCertPath" TEXT,
ADD COLUMN     "tlsKeyPath" TEXT;
