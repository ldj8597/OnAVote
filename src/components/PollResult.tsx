import { Option, PollQuestion } from "@prisma/client";
import React from "react";
import { trpc } from "../utils/trpc";
import clsx from "clsx";

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

type Props = {
  id: string;
};

const x = 3;
const y = 5;

function getPercent(
  option: Option & {
    _count: {
      votes: number;
    };
  },
  data: {
    question: PollQuestion & {
      options: (Option & {
        _count: {
          votes: number;
        };
      })[];
      _count: {
        votes: number;
      };
    };
    isOwner: boolean;
    voted: boolean;
  }
): number {
  return (option._count.votes / data.question._count.votes) * 100;
}

function PollResult({ id }: Props) {
  const { data, isLoading } = trpc.useQuery(["questions.by_id", { id }]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && !data) {
    return <div>Poll not found</div>;
  }

  return (
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
              <p className="text-slate-500">{`${getPercent(option, data)}% (${
                option._count.votes
              } votes)`}</p>
            </div>

            {/* Graph */}
            <div className="relative w-full h-8 border border-slate-400 rounded-lg">
              <div
                style={{ width: `${getPercent(option, data)}%` }}
                className={`rounded-lg h-full ${colors[index]}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PollResult;
