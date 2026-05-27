"use client";

import {
  fetchPersonDetails,
  fetchPersonExternals,
  fetchPersonCombinedCredits,
  fetchPersonImages,
} from "@/api/people";
import { PersonClient } from "./PersonClient";
import Loading from "@app/loading";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function PersonPage({ params }: Props) {
  const { id } = use(params);

  const {
    data: person,
    isLoading: personLoading,
    error: personError,
  } = useQuery({
    queryKey: ["person", id],
    queryFn: () => fetchPersonDetails(id),
    enabled: !!id,
  });

  const { data: externals, isLoading: externalsLoading } = useQuery({
    queryKey: ["externals", id],
    queryFn: () => fetchPersonExternals(id),
    enabled: !!id && !!person,
  });

  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ["credits", id],
    queryFn: () => fetchPersonCombinedCredits(id),
    enabled: !!id && !!person,
  });

  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ["images", id],
    queryFn: () => fetchPersonImages(id),
    enabled: !!id && !!person,
  });

  if (!person || personLoading) {
    return <Loading />;
  }

  if (personError) {
    return <div>Error loading person: {personError.message}</div>;
  }

  return (
    <PersonClient
      person={person || {}}
      externals={externals || {}}
      credits={credits || {}}
      images={images || {}}
      personId={id}
    />
  );
}
