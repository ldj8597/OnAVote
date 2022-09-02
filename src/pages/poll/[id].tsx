import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import { NextPageWithLayout } from "../_app";

const colors = [
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-red-500",
  "bg-lime-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-emerald-500",
];

type FormValues = {
  questionId: string;
  optionId: string;
};

const PollPageContent = ({ id }: { id: string }) => {
  const client = trpc.useContext();

  const { mutate, isLoading: isVoting } = trpc.useMutation("questions.vote", {
    onSuccess: (data) => {
      client.invalidateQueries("questions.by_id");
    },
  });

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  const { data, isLoading } = trpc.useQuery([
    "questions.by_id",
    {
      id: !id || typeof id !== "string" ? "invalid-id" : id,
    },
  ]);

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
      {!data?.voted && (
        <form
          className="flex flex-col gap-6 px-9 py-9 bg-slate-800 rounded-md shadow-md"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-2xl text-white fonot-bold">
            {data?.question?.question}
          </h1>
          <input
            {...register("questionId")}
            type="hidden"
            value={data?.question?.id}
          />
          {data?.question?.options.map((option) => (
            <div key={option.id}>
              <label className="flex items-center gap-3" htmlFor="option">
                <input
                  className="text-indigo-500 focus:ring-indigo-500 bg-slate-300"
                  {...register("optionId", {
                    required: true,
                  })}
                  type="radio"
                  value={option.id}
                />
                <div className="flex gap-3">
                  <span className="text-white">{option.text}</span>
                </div>
              </label>
            </div>
          ))}
          <button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Voting..." : "Vote"}
          </button>
        </form>
      )}

      {/* Poll Result */}
      {data?.voted && (
        <div className="bg-slate-800 px-9 py-9 flex flex-col gap-7 rounded-lg">
          {/* Title */}
          <h2 className="text-white text-2xl">{data?.question.question}</h2>

          {/* Options */}
          <div className="flex flex-col gap-5">
            {data?.question.options.map((option, index) => (
              <div className="flex flex-col gap-2" key={option.id}>
                {/* Name */}
                <div className="flex justify-between">
                  <p className="text-white">{option.text}</p>
                  <p className="text-slate-500">{`${Math.round(
                    (option._count.votes / data.question._count.votes) * 100
                  )}% (${option._count.votes} votes)`}</p>
                </div>

                {/* Graph */}
                <div className="relative w-full h-8 border border-slate-400 rounded-lg">
                  <div
                    style={{
                      width: `${
                        (option._count.votes / data.question._count.votes) * 100
                      }%`,
                    }}
                    className={`rounded-lg h-full ${colors[index]}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PollPage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") {
    return <div>No id</div>;
  }

  return <PollPageContent id={id} />;
};

PollPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default PollPage;
