import { useRouter } from "next/router";
import { ReactElement } from "react";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";

const QuestionPage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  const { data, isLoading } = trpc.useQuery(["questions.by_id", { id }]);

  if (!isLoading && !data) {
    return <div>Question not found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl fonot-bold">{data?.question}</h1>
      {data?.options.map((option) => (
        <p key={option.id}>{option.text}</p>
      ))}
    </div>
  );
};

QuestionPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default QuestionPage;
