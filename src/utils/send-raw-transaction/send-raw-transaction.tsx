import { Transaction, Connection, Commitment } from "@solana/web3.js";
import base58 from "bs58";
import { getToken } from "@bonfida/hooks";
import { tokenAuthFetchMiddleware } from "@strata-foundation/web3-token-auth";
import { sleep } from "@bonfida/utils";
const connections: Connection[] = [];

export const getAllConnections = (connections: Connection[]): Connection[] => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    connections.push(
      new Connection(process.env.NEXT_PUBLIC_ENDPOINT!, {
        wsEndpoint: process.env.NEXT_PUBLIC_WSS_URL,
        httpHeaders: { Authorization: `Bearer ${token}` },
        fetchMiddleware: tokenAuthFetchMiddleware({
          getToken,
          tokenExpiry: 2.5 * 60 * 1_000,
        }),
      })
    );
  }
  return connections;
};

const send = async (
  connection: Connection,
  tx: Transaction,
  skipPreflight: boolean,
  preflightCommitment: Commitment
) => {
  let success = false;
  let c = 0;
  let error: unknown = null;
  let result: string | null = null;

  while (!success && c < 10) {
    c += 1;
    try {
      const sig = await connection.sendRawTransaction(tx.serialize(), {
        skipPreflight,
        preflightCommitment,
      });
      success = true;
      result = sig;
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("already been processed")) {
          console.log("Tx already processed");
          success = true;
          return base58.encode(tx.signature!);
        }
      }
      console.log(`Retrying sending tx because of ${JSON.stringify(err)}`);
      error = err;
      // Sleep 400ms before retrying...
      await sleep(700);
    }
  }

  if (!success) {
    throw error;
  }

  if (!!result) {
    return result;
  }

  throw new Error("Error sending batch transaction");
};

export const sendRawTransaction = async (
  connection: Connection,
  tx: Transaction,
  skipPreflight = false,
  preflightCommitment = "processed" as Commitment
) => {
  const result = await Promise.all(
    [connection, ...getAllConnections(connections)].map((c) =>
      send(c, tx, skipPreflight, preflightCommitment)
    )
  );
  return result[0];
};
