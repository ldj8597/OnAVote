// This file contains the root router of tRPC-backend
import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { resolve } from "path";
import { z } from "zod";
import { prisma } from "../../db/client";
import { createPollSchema } from "../../shared/create-poll-schema";
import { createRouter } from "../context";

export const questionRouter = createRouter()
  .query("all", {
    async resolve(req) {
      return await prisma.pollQuestion.findMany();
    },
  })
  .query("my-poll", {
    async resolve({ ctx }) {
      return await prisma.pollQuestion.findMany({
        where: {
          ownerToken: ctx.token || "no-tokens",
        },
      });
    },
  })
  .query("by_id", {
    input: z.object({ id: z.string() }),
    async resolve({ input, ctx }) {
      if (!ctx.token) {
        console.log("----------------------------------");
        console.log("               no token           ");
        console.log("----------------------------------");
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const question = await prisma.pollQuestion.findUnique({
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

      if (!question) return;

      const isOwner = question.ownerToken === ctx.token;

      const voted = Boolean(
        await prisma.vote.findFirst({
          where: {
            pollQuestionId: question.id,
            voterToken: ctx.token,
          },
        })
      );

      return {
        question,
        isOwner,
        voted,
      };
    },
  })
  .mutation("create", {
    // input: z.object({
    //   question: z.string().min(5).max(600),
    //   options: z.object({ text: z.string() }).array().min(2).max(20),
    //   endsAt: z.date().nullish(),
    // }),
    input: createPollSchema,
    async resolve({ input, ctx }) {
      if (!ctx.token) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          ownerToken: ctx.token,
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
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return await prisma.vote.create({
        data: {
          optionId: input.optionId,
          pollQuestionId: input.questionId,
          voterToken: ctx.token,
        },
      });
    },
  });
