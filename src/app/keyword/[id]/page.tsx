import { fetchItemsByKeyword, fetchKeyword } from "@/api";
import { KeywordClient } from "./KeywordClient";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const keyword = await fetchKeyword(id);
  
  return {
    title: `${keyword?.name} Movies` || "Keyword",
    description: `Movies and TV shows related to ${keyword?.name}` || "Keyword results",
  };
}

export default async function KeywordPage({ params }: Props) {
  const { id } = await params;
  const results = await fetchItemsByKeyword(id, 1);
  const keyword = await fetchKeyword(id);

  return (
    <KeywordClient 
      initialResults={results}
      keyword={keyword}
      keywordId={id}
    />
  );
}
