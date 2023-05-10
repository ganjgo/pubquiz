-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quizzes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Quizzes" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Quizzes";
DROP TABLE "Quizzes";
ALTER TABLE "new_Quizzes" RENAME TO "Quizzes";
CREATE TABLE "new_Results" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quizId" INTEGER,
    "quizName" TEXT NOT NULL,
    "username" TEXT,
    "playerName" TEXT NOT NULL,
    "resultDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Results_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quizzes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Results" ("id", "playerName", "quizId", "quizName", "resultDate", "username") SELECT "id", "playerName", "quizId", "quizName", "resultDate", "username" FROM "Results";
DROP TABLE "Results";
ALTER TABLE "new_Results" RENAME TO "Results";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
