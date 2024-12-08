export const parseOutput = (str: string) => {
  const normalizedStr = str.replace(/- /g, "").trim();

  const sections = normalizedStr.split("\n\n").reduce((acc, section) => {
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
          .replace(/^\s*\d+\.\s*/, "") // Remove numeric prefixes if present
          .replace(/^\s*-\s*/, "") // Remove dash prefixes if present
          .replace(/\*/g, "") // Remove asterisks within content
          .replace(/\s*\([^)]*\)/, "") // Remove parentheses with content
          .trim()
      );
    acc[title] = content;
    console.log(acc);
    return acc;
  }, {});

  const movies = sections["movie_titles"] || [];
  const people = sections["people"] || [];

  return { movies: Array.from(new Set(movies)), people };
};
