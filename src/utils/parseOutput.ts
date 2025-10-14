export const parseOutput = (str: string) => {
  const normalizedStr = str.replace(/- /g, "").trim();

  const sections = normalizedStr
    .split("\n\n")
    .reduce((acc: Record<string, string[]>, section) => {
      const titleEndIndex = section.indexOf(":");
      let title = section
        .substring(0, titleEndIndex)
        .replace(/\s+/g, "_")
        .toLowerCase()
        .replace("(", "")
        .replace(")", "")
        .replace("-", "_")
        .replace("**", "")
        .replace("###", "");

      const content = section
        .substring(titleEndIndex + 1)
        .trim()
        .split("\n")
        .map((line) =>
          line
            .replace(/^\s*\d+\.\s*/, "")
            .replace(/\*/g, "")
            .replace(/\s*\([^)]*\)/, "")
            .trim()
        );
      acc[title] = content;
      return acc;
    }, {} as Record<string, string[]>);

  const movies = sections["movie_titles"] || [];
  const people = sections["people"] || [];

  return { movies: Array.from(new Set(movies)), people };
};
