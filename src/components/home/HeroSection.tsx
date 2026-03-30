import BeyButton from "@/components/ui/BeyButton";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_35%),linear-gradient(180deg,rgba(15,23,42,0.94),rgba(2,6,23,0.96))] px-6 py-16 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-10 lg:px-14">
      <div className="pointer-events-none absolute -right-16 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full border border-sky-400/20 lg:block">
        <div className="absolute inset-6 rounded-full border border-amber-300/20 animate-[spinSlow_14s_linear_infinite]" />
        <div className="absolute inset-14 rounded-full border border-sky-300/20 animate-[spinSlow_8s_linear_infinite_reverse]" />
      </div>

      <div className="max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-sky-300/80">
          Beyblade X Tournament Platform
        </p>

        <h1 className="bey-title text-5xl leading-tight text-white sm:text-6xl lg:text-7xl">
          Build the perfect combo.
          <span className="mt-2 block bg-gradient-to-r from-sky-300 via-white to-amber-200 bg-clip-text text-transparent">
            Enter the league.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Create custom builds, join tournaments, track your registrations, and
          bring your Beyblade lineups to life with a modern battle-ready
          platform.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <BeyButton href="/tournaments">Browse Tournaments</BeyButton>
          <BeyButton href="/builds/create" variant="gold">
            Create Build
          </BeyButton>
          <BeyButton href="/builds" variant="ghost">
            View Builds
          </BeyButton>
        </div>
      </div>
    </section>
  );
}