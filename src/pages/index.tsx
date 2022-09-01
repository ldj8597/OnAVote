import Link from "next/link";
import { ReactElement } from "react";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const { data, isLoading } = trpc.useQuery(["questions.all"]);
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-14">
      <div>
        <h2 className="text-2xl font-bold mb-5">Active Polls</h2>
        <ul className="space-y-3 pl-5 list-disc">
          {data.map((q) => (
            <li key={q.id}>
              <Link href={`/poll/${q.id}`}>
                <a className="text-lg">{q.question}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
