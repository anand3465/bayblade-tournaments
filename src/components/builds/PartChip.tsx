type PartChipProps = {
  label: string;
  value: string;
};

export default function PartChip({ label, value }: PartChipProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300/80">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}