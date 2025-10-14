import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="bg-[#192231]-50 min-h-screen flex flex-col items-center justify-center font-roboto animate-fadeIn">
      <div className="flex flex-col items-center">
        <CircularProgress className="text-blue-400 w-24 h-24 mb-6" />
        <h1 className="text-white text-xl font-semibold mb-2 animate-pulse">
          Loading, please wait...
        </h1>
        <p className="text-slate-300 text-sm">Fetching your movie magic</p>
      </div>
    </div>
  );
}
