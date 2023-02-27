import React from "react";
import Seo from "@/components/globals/Seo";
import Applayout from "@/components/_pages/Register";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const auth = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (auth?.token?.login) {
      router.replace("/profile");
    }
  }, []);

  return (
    <>
      <Seo title="Register" url="" />
      <main>
        <Applayout />
      </main>
    </>
  );
}

// Page Config
// Home.disabledLayout = true;
