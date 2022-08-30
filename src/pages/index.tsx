import { PollQuestion } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { prisma } from "../db/client";
import { trpc } from "../utils/trpc";

interface Props {
  questions: PollQuestion[];
}

const Home: NextPage<Props> = ({ questions }) => {
  const { data, isLoading } = trpc.useQuery(["hello"]);
  if (isLoading || !data) return <div>Loading...</div>;

  return <div>{data.greeting}</div>;
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
