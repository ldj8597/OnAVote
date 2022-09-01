import { ReactElement } from "react";
import Layout from "../../components/Layout";
import { NextPageWithLayout } from "../_app";
import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

type FormValues = {
  question: string;
  option: {
    text: string;
  }[];
};

const Create: NextPageWithLayout = () => {
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
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-5 text-center">Create Poll</h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <label className="flex flex-col gap-3">
          <span>Title</span>
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
          <h3>Options</h3>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="relative flex gap-3">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  {...register(`option.${index}.text` as const, {
                    required: true,
                  })}
                  // className="border rounded px-3 py-2 flex-1"
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

        <input className="w-full font-semibold" type="submit" value="Create" />
      </form>
    </div>
  );
};

Create.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Create;
