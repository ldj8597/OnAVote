import Head from "next/head";
import React, { ReactElement } from "react";
import Header from "./Header";

interface Props {
  children: ReactElement;
}

function Layout({ children }: Props) {
  return (
    <div>
      <Head>
        <title>Votey</title>
      </Head>
      <div className="max-w-2xl mx-auto px-5 py-5">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}

export default Layout;
