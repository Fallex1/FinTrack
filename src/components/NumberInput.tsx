import { fmtNum, parseNum } from "@/lib/types";
import { useId } from "react";

type Props = {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  placeholder?: string;
  min?: number;
};
export default function NumberInput({ value, onChange, label, placeholder = "0", min = 0 }: Props) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-xs text-muted">{label}</label>}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        min={min}
        value={value > 0 ? fmtNum(value) : ""}
        onChange={(e) => onChange(parseNum(e.target.value))}
        className="w-full px-3 py-2 border border-light rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      />
    </div>
  );
}
