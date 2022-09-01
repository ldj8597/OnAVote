import React, { ReactElement } from "react";
import Header from "./Header";

interface Props {
  children: ReactElement;
}

function Layout({ children }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-5">
      <Header />
      {children}
    </div>
  );
}

export default Layout;
