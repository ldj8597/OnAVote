import Link from "next/link";
import { ReactElement, useRef } from "react";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";

const QuestionCreator: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      console.log("Success on creating poll", data);
      client.invalidateQueries("questions.all");
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
    onError: () => {
      console.log("Fail to create poll");
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">Create Poll</h2>
      <form
        className="max-w-xl flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();

          const $question: HTMLInputElement = (e as any).target.elements
            .question;

          mutate({
            question: $question.value,
          });
          // console.log($question.value);
          // $question.value = "";
        }}
      >
        <label className="flex flex-col gap-1">
          <span>Question</span>
          <input
            ref={inputRef}
            className="border rounded py-2 px-3"
            id="question"
            name="question"
            type="text"
            disabled={isLoading}
          />
        </label>
        <button
          className="py-2 bg-slate-500 text-white rounded hover:bg-slate-400"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

const Home: NextPageWithLayout = () => {
  const { data, isLoading } = trpc.useQuery(["questions.all"]);
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-14">
      <div>
        <h2 className="text-2xl font-bold mb-5">Active Polls</h2>
        <ul className="space-y-3">
          {data.map((q) => (
            <li key={q.id}>
              <Link href={`/question/${q.id}`}>
                <a>{q.question}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <QuestionCreator />
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
