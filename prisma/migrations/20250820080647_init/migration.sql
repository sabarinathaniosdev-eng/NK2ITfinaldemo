-- CreateTable
CREATE TABLE "public"."invoices" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "gstCents" INTEGER NOT NULL,
    "licenseKey" TEXT NOT NULL,
    "pdfFileName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);
