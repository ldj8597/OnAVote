import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import PollResult from "../../components/PollResult";
import VoteForm from "../../components/VoteForm";
import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";

type FormValues = {
  questionId: string;
  optionId: string;
};

const QuestionPage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No ID</div>;
  }

  const { data, isLoading } = trpc.useQuery(["questions.by_id", { id }]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && !data) {
    return <div>Poll not found</div>;
  }

  return (
    <div className="space-y-5">
      {/* Owner? */}
      {data?.isOwner && (
        <div className="flex flex-col gap-3">
          <h3 className="bg-red-500 text-white py-2 text-center w-1/6 rounded-full">
            Your Poll
          </h3>
          <button className="w-full" type="button">
            Delete
          </button>
        </div>
      )}

      {/* Vote Form */}
      {!data?.voted && <VoteForm id={id} />}

      {/* Poll Result */}
      {data?.voted && <PollResult id={id} />}
    </div>
  );
};

QuestionPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default QuestionPage;
