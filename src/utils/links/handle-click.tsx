export const copyItems = [
  "SOL",
  "ETH",
  "BTC",
  "LTC",
  "DOGE",
  "INJ",
  "BSC",
  "Backpack",
  "ARWV",
  "email",
  "discord",
  "telegram",
  "SHDW",
  "POINT",
];

export const handleLink = (linkName: string, linkValue: string) => {
  console.log("linkName", linkName);
  if (copyItems.includes(linkName)) {
    navigator.clipboard.writeText(`${linkValue}`);
  } else if (linkName === "twitter" || linkName === "github") {
    window.open(`https://${linkName}.com/${linkValue}`, "_blank");
  } else if (linkName === "reddit") {
    window.open(`https://www.reddit.com/user/${linkValue}`);
  } else if (linkName === "url") {
    window.open(linkValue);
  } else {
    console.error("Link not recognized");
  }
};
