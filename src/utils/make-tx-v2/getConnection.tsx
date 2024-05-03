import { Connection } from "@solana/web3.js";
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT;

export const getConnection = () => {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    throw new Error("No auth token found");
  }
  const connection = new Connection(endpoint!);

  return connection;
};
