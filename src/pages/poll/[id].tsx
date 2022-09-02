import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";

type FormValues = {
  questionId: string;
  optionId: string;
};

const QuestionPage: NextPageWithLayout = () => {
  const [voted, setVoted] = useState(false);
  const client = trpc.useContext();
  const { mutate } = trpc.useMutation("questions.vote", {
    onSuccess: (data) => {
      client.invalidateQueries("questions.by_id");
      setVoted(true);
    },
  });
  const { query } = useRouter();
  const { id } = query;
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit = (data: FormValues) => {
    // console.log(data);
    mutate(data);
  };

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
    <div className="space-y-5">
      {data.isOwner && (
        <div className="flex flex-col gap-3">
          <h3 className="bg-red-500 text-white py-2 text-center">
            You made this!
          </h3>
          <button className="w-full" type="button">
            Delete
          </button>
        </div>
      )}
      <form
        className="flex flex-col gap-6 px-5 py-5 bg-slate-800 rounded-md shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl text-white fonot-bold">
          {data.question?.question}
        </h1>
        <input
          {...register("questionId")}
          type="hidden"
          value={data.question?.id}
        />
        {data.question?.options.map((option) => (
          <div key={option.id}>
            <label className="flex items-center gap-3" htmlFor="option">
              {!voted && (
                <input
                  className="text-indigo-500 focus:ring-indigo-500 bg-slate-300"
                  {...register("optionId", {
                    required: true,
                  })}
                  type="radio"
                  value={option.id}
                />
              )}
              <div className="flex gap-3">
                <span className="text-white">{option.text}</span>
                {voted && (
                  <span className="text-slate-200">
                    {option._count?.votes}/{data.question?._count.votes}
                  </span>
                )}
              </div>
            </label>
          </div>
        ))}
        <button className="w-full" type="submit" disabled={voted}>
          Vote
        </button>
      </form>
    </div>
  );
};

QuestionPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default QuestionPage;
