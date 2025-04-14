"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function CreateOnRampTransaction(
  provider: string,
  amount: number
) {
  const session = await getServerSession(authOptions);
  // This token will ideally come from the hdfc server to corresponding amount
  const token = Math.random().toString();
  const userId = session?.user?.id;
  if (!userId) {
    return {
      message: "User not logged in",
    };
  }
  await prisma.onRampTransaction.create({
    data: {
      userId: Number(userId),
      amount: amount,
      status: "Processing",
      startTime: new Date(),
      provider,
      token: token,
    },
  });

  return {
    messages: "On ramp transcation added",
  };
}
