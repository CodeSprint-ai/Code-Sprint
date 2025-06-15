/*
  Warnings:

  - Added the required column `userId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "user_account_provdiers" AS ENUM ('google', 'email');

-- CreateEnum
CREATE TYPE "user_verfication" AS ENUM ('email_verification');

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN DEFAULT false,
    "email_verifiedAt" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "last_password_change_At" TIMESTAMP(3),
    "last_login_At" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Account_Verification" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "user_verfication" NOT NULL DEFAULT 'email_verification',
    "user_id" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Account_Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Account_Providers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" "user_account_provdiers" NOT NULL DEFAULT 'email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Account_Providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Account_Verification_user_id_key" ON "User_Account_Verification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Account_Providers_user_id_key" ON "User_Account_Providers"("user_id");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Account_Verification" ADD CONSTRAINT "User_Account_Verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Account_Providers" ADD CONSTRAINT "User_Account_Providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
