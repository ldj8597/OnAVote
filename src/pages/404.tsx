import { ReactElement } from "react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";

const Custom404: NextPageWithLayout = () => {
  return (
    <div className="pt-28">
      <h1 className="text-3xl font-bold text-center font-mono">
        404 - Page Not Found
      </h1>
    </div>
  );
};

Custom404.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Custom404;
