'use client';

import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import Menu from "@/components/tailwind/ui/menu";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { ApiKeyContext, ApiKeyContextProvider } from "@/providers/ApiKeyProvider";
import { BookOpen, GithubIcon } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";

export default function Page() {

  const { apiKey, setApiKey } = useContext(ApiKeyContext);

  const handleChange = (event) => {
    setApiKey(event.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">
      <div className="flex w-full max-w-screen-lg items-center gap-2 px-4 sm:mb-[calc(20vh)]">
        <Menu />
      </div>

      <div className="p-4">
        <label htmlFor="api-key" className="block text-lg font-medium text-gray-700">
          OpenAI API Key
        </label>
        <input
          type="text"
          id="api-key"
          value={apiKey}
          onChange={handleChange}
          className="mt-2 block w-full px-4 py-3 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-2 text-sm text-gray-500">
          Your API key will never be stored and will only be used in this session.
        </p>
      </div>

      <TailwindAdvancedEditor />
    </div>
  );
}
