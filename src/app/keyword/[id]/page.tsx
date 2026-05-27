"use client";

import { fetchItemsByKeyword, fetchKeyword } from "@/api/keywords";
import { KeywordClient } from "./KeywordClient";
import Loading from "@app/loading";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function KeywordPage({ params }: Props) {
  const { id } = use(params);
  const {
    data: keyword,
    isLoading: keywordLoading,
    error: keywordError,
  } = useQuery({
    queryKey: ["keyword", id],
    queryFn: () => fetchKeyword(id),
    enabled: !!id,
  });
  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["results", id],
    queryFn: () => fetchItemsByKeyword(id, 1),
    enabled: !!id && !!keyword,
  });

  if (keywordLoading || resultsLoading) {
    return <Loading />;
  }

  if (keywordError) {
    return <div>Error loading keyword: {keywordError.message}</div>;
  }

  return <KeywordClient initialResults={results} keyword={keyword} />;
}
