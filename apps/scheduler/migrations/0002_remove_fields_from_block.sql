-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Block" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" BIGINT NOT NULL,
    "timestamp" BIGINT NOT NULL
);
INSERT INTO "new_Block" ("id", "number", "timestamp") SELECT "id", "number", "timestamp" FROM "Block";
DROP TABLE "Block";
ALTER TABLE "new_Block" RENAME TO "Block";
CREATE INDEX "Block_number_idx" ON "Block"("number");
CREATE INDEX "Block_timestamp_idx" ON "Block"("timestamp");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

