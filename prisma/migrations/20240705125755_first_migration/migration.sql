-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" VARCHAR(64) NOT NULL,
    "lastName" VARCHAR(64) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "phone" VARCHAR(64) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Organisation" (
    "orgId" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("orgId")
);

-- CreateTable
CREATE TABLE "OrgUser" (
    "user_Id" TEXT NOT NULL,
    "org_Id" TEXT NOT NULL,

    CONSTRAINT "OrgUser_pkey" PRIMARY KEY ("user_Id","org_Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "OrgUser" ADD CONSTRAINT "OrgUser_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgUser" ADD CONSTRAINT "OrgUser_org_Id_fkey" FOREIGN KEY ("org_Id") REFERENCES "Organisation"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
