import { NextPage } from "next";
import { ReactElement } from "react";
import Layout from "../../components/Layout";
import { NextPageWithLayout } from "../_app";

const QuestionPage: NextPageWithLayout = () => {
  return <h1>Question</h1>;
};

QuestionPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default QuestionPage;
