export type Wallet = { id: string; name: string; balance: number; color: string };
export type TxType = "income" | "expense";
export type Transaction = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  type: TxType;
  amount: number;
  category: string;
  walletId: string;
  note: string;
};
export type Category = { id: string; name: string; type: TxType; color: string; icon?: string };
export type Debt = { id: string; person: string; total: number; paid: number; note: string; direction: "hutang" | "piutang" };
export type Subscription = { id: string; name: string; amount: number; cycle: string; note: string };
export type Saving = { id: string; name: string; goal: number; saved: number; note?: string };
export type Profile = { name: string; avatar: string | null };

export type Period = "minggu" | "bulan" | "tahun";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "c1", name: "Gaji", type: "income", color: "#8686f8" },
  { id: "c2", name: "Makan", type: "expense", color: "#f97316" },
  { id: "c3", name: "Transport", type: "expense", color: "#3b82f6" },
  { id: "c4", name: "Belanja", type: "expense", color: "#ec4899" },
  { id: "c5", name: "Hiburan", type: "expense", color: "#a855f7" },
];

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const today = () => new Date().toISOString().slice(0, 10);
export const fmtRp = (n: number) =>
  "Rp " + Math.round(n).toLocaleString("id-ID");

export const fmtNum = (n: number) => Math.round(n).toLocaleString("id-ID");

export const parseNum = (s: string) => {
  const n = parseFloat(s.replace(/\./g, "").replace(/[^\d-]/g, ""));
  return isNaN(n) ? 0 : n;
};
