-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "PrePurchaseEnabled" BOOLEAN DEFAULT false,
    "PostPurchaseEnabled" BOOLEAN DEFAULT false
);
INSERT INTO "new_Session" ("PostPurchaseEnabled", "PrePurchaseEnabled", "accessToken", "expires", "id", "isOnline", "scope", "shop", "state", "userId") SELECT "PostPurchaseEnabled", "PrePurchaseEnabled", "accessToken", "expires", "id", "isOnline", "scope", "shop", "state", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
