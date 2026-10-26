import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function Keluar() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") router.replace("/");
  }, [router]);
  return (
    <Layout>
      <div className="p-6">
        <p className="text-muted">Logout... mengarahkan ke beranda.</p>
      </div>
    </Layout>
  );
}
