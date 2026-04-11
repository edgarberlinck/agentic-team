-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "initialPrompt" TEXT NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AgentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AgentToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_alias_key" ON "Agent"("alias");

-- CreateIndex
CREATE INDEX "_AgentToUser_B_index" ON "_AgentToUser"("B");

-- AddForeignKey
ALTER TABLE "_AgentToUser" ADD CONSTRAINT "_AgentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToUser" ADD CONSTRAINT "_AgentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
