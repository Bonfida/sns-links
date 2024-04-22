export async function retry<T>(fn: () => Promise<T>) {
  let success = false;
  let c = 0;
  let error: any = null;
  let result: T | null = null;
  while (!success && c < 4) {
    c += 1;
    try {
      result = await fn();
      success = true;
    } catch (err) {
      console.log(`Retrying sending tx because of ${JSON.stringify(err)}`);
      error = err;
      console.log(err);
    }
  }
  if (!success) {
    throw error;
  }
  if (!!result) {
    return result;
  }
  throw new Error("Error sending transaction");
}
