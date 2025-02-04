"use client";

import axios from "axios";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Inbox, Loader2 } from "lucide-react";
import { uploadToSupabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

export default function FileUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      // IF file > 10 mb, show error msg
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File is too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToSupabase(file);
        console.log({ data });

        if (!data?.file_key || !data?.file_name) {
          return toast.error("Failed to upload file");
        }

        mutate(data, {
          onSuccess: ({ chatId }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chatId}`);
          },
          onError: (error) => {
            toast.error("Failed to create chat");
            console.error(error);
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps()}
        className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex flex-col justify-center items-center"
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
}
