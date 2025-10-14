import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#192231] text-white font-roboto">
      <div className="flex flex-col items-center gap-6 px-8 py-12 bg-[#232d43] rounded-lg shadow-lg border border-[#373e55] animate-fadeInScaleUp">
        <div className="flex items-center gap-3">
          <h1 className="text-5xl font-bold tracking-tight">404</h1>
        </div>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="mb-6 text-lg text-slate-200 text-center max-w-sm">
          Oops! It seems the page you're looking for doesn't exist or has been
          moved.
        </p>
        <Link
          href="/"
          className="bg-[#5937ef] hover:bg-[#6a49ff] text-white px-8 py-3 rounded-full transition duration-300 text-md font-semibold shadow"
          replace
        >
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
}
