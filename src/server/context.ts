import * as trpc from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
// import { decodeAndVerifyJwtToken } from "./somewhere/in/your/app/utils";

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  return {
    token: req.cookies["votey-token"],
  };
}
type Context = inferAsyncReturnType<typeof createContext>;

export function createRouter() {
  return trpc.router<Context>();
}
