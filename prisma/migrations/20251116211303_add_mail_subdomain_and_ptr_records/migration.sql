-- AlterTable
ALTER TABLE "mail_domains" ADD COLUMN     "aRecord" TEXT,
ADD COLUMN     "mailSubdomain" TEXT,
ADD COLUMN     "ptrRecord" TEXT,
ADD COLUMN     "serverIp" TEXT;
