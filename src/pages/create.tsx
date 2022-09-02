import { ReactElement, useState, useEffect } from "react";
import Layout from "../components/Layout";
import { NextPageWithLayout } from "./_app";
import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import clsx from "clsx";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePollSchema,
  createPollSchema,
} from "../shared/create-poll-schema";

const Create: NextPageWithLayout = () => {
  const [endDateEnabled, setEndDateEnabled] = useState(false);
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreatePollSchema>({
    mode: "onBlur",
    defaultValues: {
      question: "",
      options: [{ text: "" }, { text: "" }],
      endsAt: null,
    },
    resolver: zodResolver(createPollSchema),
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control,
  });

  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      client.invalidateQueries("questions.all");
      reset();
      router.push(`/poll/${data.id}`);
    },
  });

  const onSubmit = (data: CreatePollSchema) => {
    mutate({
      question: data.question,
      options: data.options,
      endsAt: data.endsAt,
    });
  };

  useEffect(() => {
    if (!endDateEnabled) {
      setValue("endsAt", null);
    }
  }, [endDateEnabled, setValue]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5 text-center">Create Poll</h2>
      <form
        className="flex flex-col gap-6 px-9 py-9 bg-slate-800 rounded-md shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Title & Options */}
        <div className="flex flex-col gap-3">
          {/* Title */}
          <label className="flex flex-col gap-3">
            <span className="text-white">Title</span>
            <input
              type="text"
              id="question"
              placeholder="Type your question here"
              disabled={isLoading}
              {...register("question")}
            />
            {errors.question?.message && (
              <p className="text-red-300">{errors.question?.message}</p>
            )}
          </label>
          {/* Options */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white">Options</h3>
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <div className="relative flex flex-col">
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      disabled={isLoading}
                      {...register(`options.${index}.text` as const)}
                    />
                    {index > 1 && (
                      <button
                        className="absolute right-3 inset-y-1 w-6"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <div className="absolute w-2/3 h-px bg-slate-700 rotate-45" />
                        <div className="absolute w-2/3 h-px bg-slate-700 -rotate-45" />
                      </button>
                    )}
                  </div>
                  {errors.options?.[index] && (
                    <p className="text-red-300">
                      {errors.options?.[index]?.text?.message}
                    </p>
                  )}
                </div>
              );
            })}
            {errors.options?.message && (
              <p className="text-red-300">{errors.options?.message}</p>
            )}
            <button
              className="w-1/4 flex items-center justify-between"
              type="button"
              disabled={isLoading}
              onClick={() =>
                append({
                  text: "",
                })
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>

              <span>Add option</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-300 rounded-full" />

        {/* Settings */}
        <div className="w-1/2 mx-auto flex flex-col gap-3">
          <h3 className="text-center text-white">Settings</h3>
          {/* End Date */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-sm text-white">Set end date</p>
              <div
                className={clsx("relative w-12 h-6 rounded-full", {
                  "bg-indigo-500": endDateEnabled,
                  "bg-slate-500": !endDateEnabled,
                })}
                onClick={() => setEndDateEnabled(!endDateEnabled)}
              >
                <div
                  className={clsx(
                    "absolute left-0 inset-y-0 aspect-square rounded-full bg-white duration-300",
                    {
                      "translate-x-full": endDateEnabled,
                    }
                  )}
                />
              </div>
            </div>
            <input
              className={clsx({ hidden: !endDateEnabled })}
              {...register("endsAt", {
                valueAsDate: true,
              })}
              type="date"
            />
            {endDateEnabled && errors.endsAt?.message && (
              <p className="text-red-300">{errors.endsAt?.message}</p>
            )}
          </div>
        </div>

        {/* Create */}
        <button
          className="w-full font-semibold"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

Create.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Create;
