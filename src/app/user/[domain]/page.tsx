"use client";
import { useRouter } from "next/navigation";

const UserPage = ({ params }) => {
  const router = useRouter();
  const sharedDomain = params.domain;
  return <h1 className="text-white">HI THI IS {sharedDomain}</h1>;
};

export default UserPage;
