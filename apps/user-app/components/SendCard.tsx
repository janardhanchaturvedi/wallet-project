"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import React, { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export default function SendCard() {
  const [p2pDetails, setP2PDetails] = useState({
    amount: 0,
    number: 0,
  });

  return (
    <Center>
      <Card title="Send Money">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <TextInput
              placeholder="Enter Amount"
              label="Amount"
              onChange={(value) => {
                setP2PDetails((prev) => ({
                  ...prev,
                  amount: Number(value),
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <TextInput
              placeholder="Enter Number"
              label="Number"
              onChange={(value) => {
                setP2PDetails((prev) => ({
                  ...prev,
                  number: Number(value),
                }));
              }}
            />
          </div>
          <Button onClick={() => {
            p2pTransfer(String(p2pDetails.number), p2pDetails.amount);
          }}>Send</Button>
        </div>
      </Card>
    </Center>
  );
}
