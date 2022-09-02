import { ReactElement, useState } from "react";
import Layout from "../../components/Layout";
import { NextPageWithLayout } from "../_app";
import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import clsx from "clsx";

type FormValues = {
  question: string;
  option: {
    text: string;
  }[];
  endsAt?: Date;
};

const Create: NextPageWithLayout = () => {
  const [endDateEnabled, setEndDateEnabled] = useState(false);
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      question: "",
      option: [{ text: "" }, { text: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "option",
    control,
    rules: {
      minLength: 2,
    },
  });

  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      // console.log("Success on creating Poll", data);
      client.invalidateQueries("questions.all");
      reset();
      router.replace(`/poll/${data.id}`);
    },
  });

  const onSubmit = (data: FormValues) => {
    // console.log(data);
    if (data.option.length < 2) {
      return console.log("at least 2 options are required");
    }
    mutate({
      question: data.question,
      options: data.option,
      endsAt: endDateEnabled ? data.endsAt : null,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5 text-center">Create Poll</h2>
      <form
        className="flex flex-col gap-6 px-5 py-3 bg-slate-800 rounded-md shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Title & Options */}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-3">
            <span className="text-white">Title</span>
            <input
              // className="border px-3 py-2 rounded"
              type="text"
              id="question"
              placeholder="Type your question here"
              {...register("question", {
                required: true,
              })}
            />
          </label>
          <div className="flex flex-col gap-3">
            <h3 className="text-white">Options</h3>
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="relative flex gap-3">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    {...register(`option.${index}.text` as const, {
                      required: true,
                    })}
                  />
                  {index > 1 && (
                    <button
                      className="absolute right-3 inset-y-1 w-6"
                      onClick={() => {
                        if (fields.length <= 2) {
                          console.log("at least 2 options are required");
                          return;
                        }
                        remove(index);
                      }}
                    >
                      <div className="absolute w-2/3 h-px bg-slate-700 rotate-45" />
                      <div className="absolute w-2/3 h-px bg-slate-700 -rotate-45" />
                    </button>
                  )}
                </div>
              );
            })}

            <button
              className="w-1/5"
              type="button"
              onClick={() =>
                append({
                  text: "",
                })
              }
            >
              Add option
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-slate-300 rounded-full" />

        {/* Settings */}
        <div className="w-1/2 mx-auto flex flex-col gap-3">
          <h3 className="text-center text-white">Settings</h3>
          {/* End Date */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <p className="text-sm text-white">Set end date</p>
              <button
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
              </button>
            </div>
            <input
              className={clsx({ hidden: !endDateEnabled })}
              {...register("endsAt", {
                valueAsDate: true,
              })}
              type="date"
            />
          </div>
        </div>

        {/* Create */}
        <input className="w-full font-semibold" type="submit" value="Create" />
      </form>
    </div>
  );
};

Create.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Create;
