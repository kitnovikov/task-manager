-- CreateTable
CREATE TABLE "tokens" (
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("userId")
);
