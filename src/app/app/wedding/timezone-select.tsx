import { ChevronDown } from "lucide-react";
import { TIMEZONES } from "@/lib/timezones";

interface TimezoneSelectProps {
  value: string;
  onChange: (v: string) => void;
}

export function TimezoneSelect({ value, onChange }: TimezoneSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 bg-[#f2efe9] rounded-xl px-4 pr-10 text-text font-medium appearance-none outline-none cursor-pointer focus:ring-2 focus:ring-cta/30"
      >
        {TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#866857] pointer-events-none"
      />
    </div>
  );
}
