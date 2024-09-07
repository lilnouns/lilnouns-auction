-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" BIGINT NOT NULL,
    "timestamp" BIGINT NOT NULL,
    "parentHash" TEXT,
    "author" TEXT,
    "difficulty" BIGINT NOT NULL,
    "totalDifficulty" BIGINT NOT NULL,
    "gasUsed" BIGINT NOT NULL,
    "gasLimit" BIGINT NOT NULL,
    "receiptsRoot" TEXT NOT NULL,
    "transactionsRoot" TEXT NOT NULL,
    "stateRoot" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "unclesHash" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Block_number_idx" ON "Block"("number");

-- CreateIndex
CREATE INDEX "Block_timestamp_idx" ON "Block"("timestamp");

