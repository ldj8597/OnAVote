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
          _count: {
            select: {
              votes: true,
            },
          },
          options: {
            include: {
              _count: {
                select: {
                  votes: true,
                },
              },
            },
          },
        },
      });
    },
  })
  .mutation("create", {
    input: z.object({
      question: z.string().min(5).max(600),
      options: z.object({ text: z.string() }).array().min(2),
    }),
    async resolve({ input }) {
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: {
            create: input.options,
          },
        },
      });
    },
  })
  .mutation("vote", {
    input: z.object({
      questionId: z.string(),
      optionId: z.string(),
      option: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.vote.create({
        data: {
          optionId: input.optionId,
          pollQuestionId: input.questionId,
        },
      });
    },
  });
