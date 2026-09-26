import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section-pad flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="text-display-md font-serif text-ink mb-6">
        This trail leads nowhere
      </h1>
      <p className="text-lead text-stone mb-10 max-w-md">
        The page you are looking for may have moved or no longer exists.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-brand bg-pine px-8 py-3.5 text-sm font-semibold text-cloud transition-colors hover:bg-forest focus-visible:ring-2 focus-visible:ring-forest"
      >
        Back to home
      </Link>
    </section>
  );
}