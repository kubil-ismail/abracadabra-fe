import React from "react";
import Seo from "@/components/globals/Seo";
import Applayout from "@/components/_pages/Profile";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const auth = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (!auth?.token?.login) {
      router.replace("/sign-in");
    }
  }, []);

  return (
    <>
      <Seo title="Profile" url="" />
      <main>
        <Applayout />
      </main>
    </>
  );
}
