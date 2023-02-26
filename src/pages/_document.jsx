import Document, { Html, Head, Main, NextScript } from "next/document";
import Favicon from "@/components/globals/Favicons";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <Favicon />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
