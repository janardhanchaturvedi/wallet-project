import React from "react";
import SendCard from "../../../components/SendCard";
import { P2PTransactionCard } from "../../../components/P2PTransactionCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { Center } from "@repo/ui/center";

async function getP2PTransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  const transactions = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: userId,
    },
    include : {
      toUser: {
        select: {
          id: true,
          name: true,
        },
      },
    }
  });
  return transactions.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    to: t.toUserId,
    toUser : t.toUser.name,
  }));
}

export default async function P2PTransfers() {
  const p2pTransaction = await getP2PTransactions();
  return (
    <div className="h-[90vh] w-full">
      <Center>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
          <SendCard />
          <P2PTransactionCard transactions={p2pTransaction} />
        </div>
      </Center>
    </div>
  );
}
