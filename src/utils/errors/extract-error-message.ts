import axios from "axios";
import { WalletError } from "@solana/wallet-adapter-base";

export const extractErrorMessage = (
  err: any,
  { defaultMessage }: { defaultMessage?: string } = {}
) => {
  console.error(err);

  let errorMessage = defaultMessage;

  if (err instanceof WalletError) {
    errorMessage = err?.error?.message || errorMessage;
  } else if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data || errorMessage;
  }

  return errorMessage;
};
