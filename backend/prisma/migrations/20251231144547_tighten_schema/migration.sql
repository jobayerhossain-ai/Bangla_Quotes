-- DropIndex
DROP INDEX "analytics_createdAt_idx";

-- DropIndex
DROP INDEX "analytics_event_idx";

-- DropIndex
DROP INDEX "categories_isActive_idx";

-- DropIndex
DROP INDEX "quotes_categoryId_idx";

-- DropIndex
DROP INDEX "quotes_createdAt_idx";

-- DropIndex
DROP INDEX "quotes_status_idx";

-- DropIndex
DROP INDEX "quotes_views_idx";

-- DropIndex
DROP INDEX "studio_assets_isActive_idx";

-- DropIndex
DROP INDEX "studio_assets_type_idx";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "studio_assets" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "analytics_event_createdAt_idx" ON "analytics"("event", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_ipAddress_idx" ON "analytics"("ipAddress");

-- CreateIndex
CREATE INDEX "categories_isActive_order_idx" ON "categories"("isActive", "order");

-- CreateIndex
CREATE INDEX "quotes_categoryId_status_idx" ON "quotes"("categoryId", "status");

-- CreateIndex
CREATE INDEX "quotes_status_createdAt_idx" ON "quotes"("status", "createdAt");

-- CreateIndex
CREATE INDEX "quotes_status_views_idx" ON "quotes"("status", "views");

-- CreateIndex
CREATE INDEX "studio_assets_type_isActive_order_idx" ON "studio_assets"("type", "isActive", "order");
