import * as z from "zod";

export const createPollSchema = z.object({
  question: z
    .string()
    .min(5, { message: "Title must be 5 or more characters long" })
    .max(600, { message: "Title must be 600 or fewer characters long" }),
  options: z
    .object({
      text: z
        .string()
        .min(1, { message: "Option must be 1 or more characters long" })
        .max(200, { message: "Option must be 200 or more characters long" }),
    })
    .array()
    .min(2, { message: "Poll Must have 2 or more options" })
    .max(20, { message: "Poll must have 20 or fewer options" }),
  endsAt: z
    .date()
    .min(new Date(), { message: "End date can not be before today" })
    .nullish(),
});

export type CreatePollSchema = z.infer<typeof createPollSchema>;
