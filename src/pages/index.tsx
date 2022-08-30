import { PollQuestion } from "@prisma/client";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const { mutate, isLoading } = trpc.useMutation("questions.create");

  return (
    <div>
      <h2 className="text-2xl font-bold">Create Poll</h2>
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault();

          const $question: HTMLInputElement = (e as any).target.elements
            .question;

          mutate({
            question: $question.value,
          });
        }}
      >
        <label htmlFor="question">Question:</label>
        <input id="question" name="question" type="text" />
        <input type="submit" />
      </form>
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.all"]);
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-5 py-5 flex flex-col gap-10">
      <div>
        <h2 className="text-2xl font-bold">Polls</h2>
        <ul>
          {data.map((q) => (
            <li key={q.id}>{q.question}</li>
          ))}
        </ul>
      </div>

      <QuestionCreator />
    </div>
  );
};

export default Home;
