-- CreateTable
CREATE TABLE "Seed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "background" BIGINT NOT NULL,
    "body" BIGINT NOT NULL,
    "accessory" BIGINT NOT NULL,
    "head" BIGINT NOT NULL,
    "glasses" BIGINT NOT NULL,
    "nounId" BIGINT NOT NULL,
    "blockId" TEXT NOT NULL,
    CONSTRAINT "Seed_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Seed_background_idx" ON "Seed"("background");

-- CreateIndex
CREATE INDEX "Seed_body_idx" ON "Seed"("body");

-- CreateIndex
CREATE INDEX "Seed_accessory_idx" ON "Seed"("accessory");

-- CreateIndex
CREATE INDEX "Seed_head_idx" ON "Seed"("head");

-- CreateIndex
CREATE INDEX "Seed_glasses_idx" ON "Seed"("glasses");

-- CreateIndex
CREATE INDEX "Seed_nounId_idx" ON "Seed"("nounId");

-- CreateIndex
CREATE INDEX "Seed_blockId_idx" ON "Seed"("blockId");

-- CreateIndex
CREATE INDEX "Block_id_idx" ON "Block"("id");

