"use client";
import RecordsList from "@/app/components/RecordsList/RecordsList";
import { useToastContext } from "@/hooks/useToastContext";
import { useTheme } from "next-themes";
import { useEffect } from "react";
type RecordsListPageParams = {
  domain: string;
};

export const RecordsListPage = ({
  params,
}: {
  params: RecordsListPageParams;
}) => {
  const domain: string = params.domain;

  const { theme } = useTheme();
  const { setLight } = useToastContext();

  useEffect(() => {
    if (theme === "light") {
      setLight(true);
    } else {
      setLight(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen bg-primary-bg overflow-auto">
      <RecordsList domain={domain} />
    </div>
  );
};
