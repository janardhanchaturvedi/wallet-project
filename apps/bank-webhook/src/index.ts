import express, { Request, Response } from "express";
import db from "@repo/db/client";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/hdfcWebhook",  async (req: Request, res: Response): Promise<any>  => {
  // add zod validation
  //add check if the on ramp transaction is already processed

  const paymentInformation : {
    token: string;
    userId: number;
    amount: number;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: Number(req.body.amount),
  };
  try {
    const transaction = await db.onRampTransaction.findFirst({
      where : {
        userId : paymentInformation.userId
      }
    })
    if(!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }
    if(transaction.status === "Success") {
      return res.status(200).json({
        message: "Transaction already processed", 
      });  
    }
    
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: paymentInformation.userId,
        },
        data: {
          amount: {
            increment: paymentInformation.amount,
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    return res.json({
      message: "Captured",
    });
  } catch (error) {
    console.error(error);
    return res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3005, () => {
  console.log("Server is running on port 3007");
});
