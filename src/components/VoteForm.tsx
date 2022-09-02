import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

type Props = {
  id: string;
};

type FormValues = {
  questionId: string;
  optionId: string;
};

function VoteForm({ id }: Props) {
  const client = trpc.useContext();

  const { data } = trpc.useQuery(["questions.by_id", { id }]);

  const { mutate, isLoading } = trpc.useMutation("questions.vote", {
    onSuccess: (data) => {
      client.invalidateQueries("questions.by_id");
    },
  });

  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && !data) {
    return <div>Poll not found</div>;
  }

  return (
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
  );
}

export default VoteForm;
