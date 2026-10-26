import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import type {
  Wallet,
  Transaction,
  Category,
  Debt,
  Subscription,
  Saving,
  Profile,
  Period,
} from "@/lib/types";
import { DEFAULT_CATEGORIES, uid } from "@/lib/types";

type Store = {
  profile: Profile;
  wallets: Wallet[];
  transactions: Transaction[];
  categories: Category[];
  debts: Debt[];
  subscriptions: Subscription[];
  savings: Saving[];
  period: Period;
};

const defaultStore: Store = {
  profile: { name: "Pengguna FinTrack", avatar: null },
  wallets: [],
  transactions: [],
  categories: DEFAULT_CATEGORIES,
  debts: [],
  subscriptions: [],
  savings: [],
  period: "bulan",
};

const KEY = "fintrack.store.v1";

const AppCtx = createContext<{
  store: Store;
  update: (patch: Partial<Store>) => void;
  addWallet: (name: string, balance: number, color: string) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  addCategory: (name: string, type: "income" | "expense", color: string) => void;
  addDebt: (d: Omit<Debt, "id">) => void;
  addSubscription: (s: Omit<Subscription, "id">) => void;
  addSaving: (s: Omit<Saving, "id">) => void;
  setProfile: (p: Profile) => void;
  setPeriod: (p: Period) => void;
  totalBalance: number;
  balanceInPeriod: number;
} | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [store, setStore] = useState<Store>(defaultStore);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setStore({ ...defaultStore, ...JSON.parse(raw) });
  }, []);

  useEffect(() => {
    if (store === defaultStore) return;
    localStorage.setItem(KEY, JSON.stringify(store));
  }, [store]);

  const update = (patch: Partial<Store>) =>
    setStore((s) => ({ ...s, ...patch }));

  const addWallet = (name: string, balance: number, color: string) =>
    setStore((s) => ({
      ...s,
      wallets: [...s.wallets, { id: uid(), name, balance, color }],
    }));

  const addTransaction = (t: Omit<Transaction, "id">) =>
    setStore((s) => ({
      ...s,
      transactions: [{ ...t, id: uid() }, ...s.transactions],
      wallets: s.wallets.map((w) =>
        w.id === t.walletId
          ? { ...w, balance: w.balance + (t.type === "income" ? t.amount : -t.amount) }
          : w
      ),
    }));

  const addCategory = (name: string, type: "income" | "expense", color: string) =>
    setStore((s) => ({
      ...s,
      categories: [...s.categories, { id: uid(), name, type, color }],
    }));

  const addDebt = (d: Omit<Debt, "id">) =>
    setStore((s) => ({ ...s, debts: [{ ...d, id: uid() }, ...s.debts] }));

  const addSubscription = (s2: Omit<Subscription, "id">) =>
    setStore((s) => ({ ...s, subscriptions: [{ ...s2, id: uid() }, ...s.subscriptions] }));

  const addSaving = (saving: Omit<Saving, "id">) =>
    setStore((s) => ({ ...s, savings: [{ ...saving, id: uid() }, ...s.savings] }));

  const setProfile = (p: Profile) => update({ profile: p });
  const setPeriod = (p: Period) => update({ period: p });

  const totalBalance = useMemo(() => store.wallets.reduce((a, w) => a + w.balance, 0), [store.wallets]);
  const balanceInPeriod = useMemo(
    () =>
      store.transactions.filter((t) => inPeriod(t.date, store.period)).reduce((a, t) => a + (t.type === "income" ? t.amount : -t.amount), 0),
    [store.transactions, store.period]
  );

  return (
    <AppCtx.Provider
      value={{ store, update, addWallet, addTransaction, addCategory, addDebt, addSubscription, addSaving, setProfile, setPeriod, totalBalance, balanceInPeriod }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// period helpers
export function periodDays(p: Period): [Date, Date] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  if (p === "bulan") return [new Date(y, m, 1), new Date(y, m + 1, 0)];
  if (p === "minggu") {
    const start = new Date(now);
    start.setDate(d - (now.getDay() || 7) + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return [start, end];
  }
  return [new Date(y, 0, 1), new Date(y, 11, 31)];
}

export function inPeriod(date: string, p: Period): boolean {
  if (!date) return false;
  const d = new Date(date);
  const [s, e] = periodDays(p);
  return d >= s && d <= e;
}

export function sumIncome(txns: Transaction[], p: Period): number {
  return txns.filter((t) => inPeriod(t.date, p) && t.type === "income").reduce((a, t) => a + t.amount, 0);
}
export function sumExpense(txns: Transaction[], p: Period): number {
  return txns.filter((t) => inPeriod(t.date, p) && t.type === "expense").reduce((a, t) => a + t.amount, 0);
}
