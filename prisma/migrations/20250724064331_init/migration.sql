-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Admin', 'Player');

-- AlterTable
ALTER TABLE "public"."Prediction" ADD COLUMN     "points" INTEGER;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'Player';
