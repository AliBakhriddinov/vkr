-- Replace last-seen timestamps with per-item seen id arrays
ALTER TABLE "User" DROP COLUMN "applicationsSeenAt";
ALTER TABLE "User" DROP COLUMN "testimonialsSeenAt";
ALTER TABLE "User" ADD COLUMN "seenApplicationIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "User" ADD COLUMN "seenTestimonialIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
