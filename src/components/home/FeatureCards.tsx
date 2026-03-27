import GlassCard from "@/components/ui/GlassCard";

const features = [
  {
    title: "Add Your BeyBlade",
    text: "Mix blades, ratchets, and bits into powerful custom loadouts with stat-driven previews.",
  },
  {
    title: "Enter Tournaments",
    text: "Join upcoming events, track bracket capacity, and manage your registrations with ease.",
  },
  {
    title: "Own Your Profile",
    text: "Keep your builds, registrations, and player identity organized in one command center.",
  },
];

export default function FeatureCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {features.map((feature) => (
        <GlassCard
          key={feature.title}
          className="bey-card p-6"
          strong
        >
          <div className="mb-4 h-10 w-10 rounded-full border border-sky-400/20 bg-sky-400/10 shadow-[0_0_20px_rgba(56,189,248,0.12)]" />
          <h3 className="text-lg font-extrabold text-white">{feature.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
        </GlassCard>
      ))}
    </section>
  );
}