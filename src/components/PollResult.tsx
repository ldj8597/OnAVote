import { Option, PollQuestion } from "@prisma/client";
import React from "react";
import { trpc } from "../utils/trpc";

const colors = [
  "green",
  "orange",
  "pink",
  "yellow",
  "blue",
  "red",
  "lime",
  "violet",
  "cyan",
  "amber",
  "indigo",
  "emerald",
];

type Props = {
  id: string;
};

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

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!isLoading && !data) {
  //   return <div>Poll not found</div>;
  // }

  return (
    <div className="bg-slate-800 px-9 py-9 flex flex-col gap-7 rounded-lg">
      <h2 className="text-white text-2xl">{data?.question.question}</h2>

      <div className="flex flex-col gap-5">
        {data?.question.options.map((option, index) => (
          <div className="space-y-1" key={option.id}>
            <div className="flex justify-between">
              <p className="text-white">{option.text} votes</p>
              <p className="text-slate-500">{`${getPercent(option, data)}% (${
                option._count.votes
              } votes)`}</p>
            </div>
            <div className="w-full h-8 border border-slate-400 rounded-lg">
              <div
                className={`rounded-lg h-full w-[${getPercent(
                  option,
                  data
                )}%] bg-${colors[index]}-500`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PollResult;
