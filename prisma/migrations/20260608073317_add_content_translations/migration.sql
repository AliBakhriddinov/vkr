-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "contentEn" TEXT,
ADD COLUMN     "excerptEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "PortfolioItem" ADD COLUMN     "clientNameEn" TEXT,
ADD COLUMN     "descriptionEn" TEXT,
ADD COLUMN     "summaryEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "fullDescriptionEn" TEXT,
ADD COLUMN     "shortDescriptionEn" TEXT,
ADD COLUMN     "titleEn" TEXT;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "authorNameEn" TEXT,
ADD COLUMN     "authorRoleEn" TEXT,
ADD COLUMN     "quoteEn" TEXT;
