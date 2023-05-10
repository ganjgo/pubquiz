/*
  Warnings:

  - Made the column `quizId` on table `Results` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quizName` on table `Results` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Results" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quizId" INTEGER NOT NULL,
    "quizName" TEXT NOT NULL,
    "username" TEXT,
    "playerName" TEXT NOT NULL,
    "resultDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Results_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quizzes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Results" ("id", "playerName", "quizId", "quizName", "resultDate", "username") SELECT "id", "playerName", "quizId", "quizName", "resultDate", "username" FROM "Results";
DROP TABLE "Results";
ALTER TABLE "new_Results" RENAME TO "Results";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
