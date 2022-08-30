// This file contains the root router of tRPC-backend
import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db/client";

export const questionRouter = trpc.router().query("all", {
  async resolve(req) {
    return await prisma.pollQuestion.findMany();
  },
});
