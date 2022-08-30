import { PollQuestion } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.all"]);
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div>
      {data.map((q) => (
        <p key={q.id}>{q.question}</p>
      ))}
    </div>
  );
};

export default Home;
