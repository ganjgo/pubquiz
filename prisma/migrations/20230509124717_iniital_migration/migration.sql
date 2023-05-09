-- CreateTable
CREATE TABLE "Quizzes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "answer" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "questionData" TEXT,
    "resultId" INTEGER,
    CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserAnswer_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Results" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Results" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quizId" INTEGER,
    "quizName" TEXT,
    "username" TEXT,
    "playerName" TEXT NOT NULL,
    "resultDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Results_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quizzes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_QuestionsToQuizzes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_QuestionsToQuizzes_A_fkey" FOREIGN KEY ("A") REFERENCES "Questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_QuestionsToQuizzes_B_fkey" FOREIGN KEY ("B") REFERENCES "Quizzes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionsToQuizzes_AB_unique" ON "_QuestionsToQuizzes"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionsToQuizzes_B_index" ON "_QuestionsToQuizzes"("B");
