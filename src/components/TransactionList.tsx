import { useState } from "react";
import {
  IconBriefcase,
  IconUtensils,
  IconArrowLeftRight,
  IconShoppingBag,
  IconPiggyBank,
  IconTicket,
} from "@/components/Icons";

type Row = {
  id: number;
  name: string;
  cat: string;
  date: string;
  amount: string;
  icon: React.ReactNode;
  type: "income" | "expense";
};

const ROWS: Row[] = [
  {
    id: 1,
    name: "Gaji Bulanan",
    cat: "Income",
    date: "03 Oct",
    amount: "+Rp 3.500.000",
    icon: <IconBriefcase className="w-5 h-5" />,
    type: "income",
  },
  {
    id: 2,
    name: "Cafe Market",
    cat: "Food and Drink",
    date: "12 Oct",
    amount: "-Rp 25.000",
    icon: <IconUtensils className="w-5 h-5" />,
    type: "expense",
  },
  {
    id: 3,
    name: "Transfer Teman",
    cat: "Transfer",
    date: "07 Oct",
    amount: "+Rp 150.000",
    icon: <IconArrowLeftRight className="w-5 h-5" />,
    type: "income",
  },
  {
    id: 4,
    name: "Belanja Bulanan",
    cat: "Shopping",
    date: "09 Oct",
    amount: "-Rp 320.000",
    icon: <IconShoppingBag className="w-5 h-5" />,
    type: "expense",
  },
  {
    id: 5,
    name: "Nabung Dana",
    cat: "Savings",
    date: "05 Oct",
    amount: "-Rp 500.000",
    icon: <IconPiggyBank className="w-5 h-5" />,
    type: "expense",
  },
  {
    id: 6,
    name: "Diskon Market",
    cat: "Promo",
    date: "11 Oct",
    amount: "-Rp 18.500",
    icon: <IconTicket className="w-5 h-5" />,
    type: "expense",
  },
];

const catColor: Record<string, string> = {
  Income: "text-primary",
  "Food and Drink": "text-orange-500",
  Transfer: "text-blue-500",
  Shopping: "text-pink-500",
  Savings: "text-green-500",
  Promo: "text-purple-500",
};

export default function TransactionList() {
  const [rows] = useState<Row[]>(ROWS);

  return (
    <div className="bg-white rounded-xl p-6 border border-light shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-dark">Transaksi Terakhir</h3>
        <button className="text-sm font-medium text-primary hover:text-dark transition">
          Lihat semua
        </button>
      </div>
      <div className="space-y-1 overflow-hidden max-w-full">
        {rows.map((r) => {
          const iconColor = catColor[r.cat] ?? "text-muted";
          return (
            <div
              key={r.id}
              className="grid grid-cols-12 items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-light transition"
            >
              <div className="col-span-1 flex-shrink-0">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className={iconColor}>{r.icon}</span>
                </span>
              </div>
              <div className="col-span-5 min-w-0">
                <p className="text-sm font-medium text-dark truncate">
                  {r.name}
                </p>
                <p className={`text-xs ${iconColor} truncate`}>{r.cat}</p>
              </div>
              <div className="col-span-2 text-sm text-muted truncate">
                {r.date}
              </div>
              <div
                className={`col-span-3 text-right text-sm font-medium truncate ${
                  r.type === "income" ? "text-primary" : "text-secondary"
                }`}
              >
                {r.amount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
