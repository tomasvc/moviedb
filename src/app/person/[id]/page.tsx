import { fetchPersonDetails, fetchPersonExternals, fetchPersonCombinedCredits, fetchPersonImages } from "@/api";
import { PersonClient } from "./PersonClient";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const person = await fetchPersonDetails(id);
  
  return {
    title: person?.name || "Person",
    description: person?.biography?.slice(0, 150) || "Person details",
  };
}

export default async function PersonPage({ params }: Props) {
  const { id } = await params;
  const person = await fetchPersonDetails(id);
  const externals = await fetchPersonExternals(id);
  const credits = await fetchPersonCombinedCredits(id);
  const images = await fetchPersonImages(id);

  return (
    <PersonClient 
      person={person}
      externals={externals}
      credits={credits}
      images={images}
      personId={id}
    />
  );
}
