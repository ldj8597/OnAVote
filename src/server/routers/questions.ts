// This file contains the root router of tRPC-backend
import * as trpc from "@trpc/server";
import { resolve } from "path";
import { z } from "zod";
import { prisma } from "../../db/client";

export const questionRouter = trpc
  .router()
  .query("all", {
    async resolve(req) {
      return await prisma.pollQuestion.findMany();
    },
  })
  .query("by_id", {
    input: z.object({ id: z.string() }),
    async resolve({ input }) {
      return await prisma.pollQuestion.findUnique({
        where: {
          id: input.id,
        },
        include: {
          options: true,
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      question: z.string().min(5).max(600),
    }),
    async resolve({ input }) {
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
        },
      });
    },
  });
