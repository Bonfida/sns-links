export const formatRecordValue = (value: string, record: string) => {
  const USERNAME_RECORDS = [
    "discord",
    "github",
    "reddit",
    "twitter",
    "telegram",
    "backpack",
  ];

  if (!value) return value;

  if (USERNAME_RECORDS.includes(record)) {
    return value.replace(/^@/, "");
  }

  return value;
};
