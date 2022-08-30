import { PollQuestion } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { prisma } from "../db/client";

interface Props {
  questions: PollQuestion[];
}

const Home: NextPage<Props> = ({ questions }) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main>
        <h1 className="text-2xl font-bold">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <ul>
          {questions.map((q) => (
            <li key={q.id}>{q.question}</li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const questions = await prisma.pollQuestion.findMany();
  return {
    props: {
      questions: JSON.parse(JSON.stringify(questions)),
    },
  };
};

export default Home;
