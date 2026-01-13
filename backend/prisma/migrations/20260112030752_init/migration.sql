-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Partnership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "country" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "website" TEXT,
    "erasmusCode" TEXT,
    "areas" TEXT,
    "studentsStudyCount" TEXT,
    "studentsStudyMonths" TEXT,
    "studentsInternshipCount" TEXT,
    "studentsInternshipMonths" TEXT,
    "staffTeachingCount" TEXT,
    "staffTeachingDur" TEXT,
    "staffTrainingCount" TEXT,
    "staffTrainingDur" TEXT,
    "blendedIntensive" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Mobility" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "direction" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "school" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "candidateEmail" TEXT NOT NULL,
    "candidateFirstName" TEXT NOT NULL,
    "candidateLastName" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "receivingInstitution" TEXT NOT NULL,
    "sendingInstitution" TEXT NOT NULL,
    "partnershipId" INTEGER,
    CONSTRAINT "Mobility_partnershipId_fkey" FOREIGN KEY ("partnershipId") REFERENCES "Partnership" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
