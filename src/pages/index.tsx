import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import ChartCard from "@/components/ChartCard";
import TransactionList from "@/components/TransactionList";
import Link from "next/link";
import { IconBriefcase, IconTrendingDown, IconWallet, IconPlus } from "@/components/Icons";

const CHART_DATA = [
  { month: "Jan", income: 3000, expense: 2400 },
  { month: "Feb", income: 3200, expense: 2550 },
  { month: "Mar", income: 3100, expense: 2480 },
  { month: "Apr", income: 3400, expense: 2700 },
  { month: "May", income: 3350, expense: 2900 },
  { month: "Jun", income: 3800, expense: 2600 },
  { month: "Jul", income: 3600, expense: 2500 },
  { month: "Aug", income: 3800, expense: 2700 },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex flex-col gap-8 pb-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Pemasukan"
            value="Rp 12.450.000"
            change="+12% dari bulan lalu"
            icon={<IconBriefcase className="w-5 h-5" />}
            iconBg="bg-primary/20"
          />
          <StatCard
            label="Total Pengeluaran"
            value="Rp 8.320.000"
            change="-8% dari bulan lalu"
            icon={<IconTrendingDown className="w-5 h-5" />}
            iconBg="bg-red-100/50"
          />
          <StatCard
            label="Saldo"
            value="Rp 4.129.000"
            change="+5% dari bulan lalu"
            icon={<IconWallet className="w-5 h-5" />}
          />
        </div>

        {/* Chart + transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartCard
              title="Pengeluaran vs Pemasukan"
              subtitle="Bulan ini"
              data={CHART_DATA}
            />
          </div>
          <div>
            <TransactionList />
          </div>
        </div>

        {/* FAB */}
        <Link href="/transaksi">
          <button
            type="button"
            aria-label="Tambah transaksi"
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-white shadow-md hover:bg-primary/80 transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <IconPlus className="w-6 h-6" />
          </button>
        </Link>
      </div>
    </Layout>
  );
}
