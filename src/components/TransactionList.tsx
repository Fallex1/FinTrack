import type { Transaction, Category, Wallet, TxType } from "@/lib/types";
import { fmtRp } from "@/lib/types";
import {
  IconBriefcase,
  IconUtensils,
  IconArrowLeftRight,
  IconShoppingBag,
  IconPiggyBank,
  IconTicket,
  IconTrendingDown,
  IconFileText,
  IconTag,
} from "@/components/Icons";

export type TransactionListProps = {
  transactions: Transaction[];
  categories: Category[];
  wallets: Wallet[];
  showDate?: boolean;
};

const iconFor: Record<TxType, React.ReactNode> = {
  income: <IconTrendingDown className="w-4 h-4 text-primary" />,
  expense: <IconShoppingBag className="w-4 h-4 text-red-500" />,
};

const catIcon: Record<string, React.ReactNode> = {
  Gaji: <IconBriefcase className="w-5 h-5" />,
  Makan: <IconUtensils className="w-5 h-5" />,
  Transfer: <IconArrowLeftRight className="w-5 h-5" />,
  Belanja: <IconShoppingBag className="w-5 h-5" />,
  Hiburan: <IconTicket className="w-5 h-5" />,
  Tabungan: <IconPiggyBank className="w-5 h-5" />,
  default: <IconFileText className="w-5 h-5" />,
};

const catColor: Record<string, string> = {
  Gaji: "text-primary",
  Makan: "text-orange-500",
  Transfer: "text-blue-500",
  Belanja: "text-pink-500",
  Hiburan: "text-purple-500",
  Tabungan: "text-green-500",
  Promo: "text-yellow-500",
};

const catName = (id: string, categories: Category[]) =>
  categories.find((c) => c.id === id)?.name ?? "Lainnya";
const walletName = (id: string, wallets: Wallet[]) =>
  wallets.find((w) => w.id === id)?.name ?? "—";

export default function TransactionList({
  transactions,
  categories,
  wallets,
  showDate = true,
}: TransactionListProps) {
  return (
    <div className="space-y-1 overflow-hidden max-w-full">
      {transactions.map((t) => {
        const iconColor = catColor[catName(t.category, categories)] ?? "text-muted";
        const sign = t.type === "income" ? "+" : "-";
        return (
          <div
            key={t.id}
            className="grid grid-cols-12 items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-light transition"
          >
            <div className="col-span-1 flex-shrink-0">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {(() => { const ic = categories.find((c) => c.id === t.category)?.icon; return ic ? <img src={ic} alt="" className="w-5 h-5" /> : <span className={iconColor}>{catIcon[catName(t.category, categories)] ?? catIcon.default}</span>; })()}
              </span>
            </div>
            <div className="col-span-5 min-w-0">
              <p className="text-sm font-medium text-dark truncate">
                {t.note || catName(t.category, categories)}
              </p>
              <p className={`text-xs ${iconColor} truncate`}>
                {catName(t.category, categories)} · {walletName(t.walletId, wallets)}
              </p>
            </div>
            {showDate && (
              <div className="col-span-2 text-sm text-muted truncate">
                {t.date}
              </div>
            )}
            <div
              className={`col-span-3 text-right text-sm font-medium truncate ${
                t.type === "income" ? "text-primary" : "text-secondary"
              }`}
            >
              {sign}
              {fmtRp(t.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
