export const clone =
  typeof structuredClone !== "undefined"
    ? structuredClone
    : (obj: any) => JSON.parse(JSON.stringify(obj));
