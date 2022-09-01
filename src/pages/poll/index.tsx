import { ReactElement } from "react";
import Layout from "../../components/Layout";
import { NextPageWithLayout } from "../_app";
import * as React from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
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
      question: "Favorite laptop",
      option: [{ text: "gram" }, { text: "Macbook" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "option",
    control,
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
      <h2 className="text-2xl font-bold mb-5">Create Poll</h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <label className="flex flex-col gap-3">
          <span>Question</span>
          <input
            // className="border px-3 py-2 rounded"
            type="text"
            id="question"
            {...register("question", {
              required: true,
            })}
          />
        </label>
        <div className="flex flex-col gap-3">
          <h3>Options</h3>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-3">
                <input
                  type="text"
                  //   placeholder="name"
                  {...register(`option.${index}.text` as const, {
                    required: true,
                  })}
                  // className="border rounded px-3 py-2 flex-1"
                />
                <button
                  className="border py-2 px-3 rounded"
                  type="button"
                  onClick={() => {
                    if (fields.length <= 2) {
                      console.log("at least 2 options are required");
                      return;
                    }
                    remove(index);
                  }}
                >
                  DELETE
                </button>
              </div>
            );
          })}
        </div>

        <button
          className=""
          type="button"
          onClick={() =>
            append({
              text: "",
            })
          }
        >
          APPEND
        </button>
        <input className="w-full" type="submit" />
      </form>
    </div>
  );
};

Create.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Create;
