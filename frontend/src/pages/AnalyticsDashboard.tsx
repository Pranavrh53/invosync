import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
// import { RevenueChart } from "../components/analytics/RevenueChart";
// import { TopClientsTable } from "../components/analytics/TopClientsTable";
import { formatCurrency } from "../utils/formatters";
import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "../services/invoiceApi";

export default function AnalyticsDashboard() {
    // Fetch stats and revenue data (placeholder endpoints)
    const { data: stats } = useQuery({ queryKey: ["invoiceStats"], queryFn: () => invoiceApi.getStats() });
    // const { data: revenue } = useQuery({ queryKey: ["revenueByMonth"], queryFn: () => invoiceApi.getRevenueByMonth() });

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-8">
            <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader>
                    <CardContent>{stats?.totalAmount ? formatCurrency(stats.totalAmount) : "-"}</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Paid Invoices</CardTitle></CardHeader>
                    <CardContent>{stats?.byStatus?.paid ?? "-"}</CardContent>
                </Card>
            </div>
            {/* <RevenueChart data={revenue ?? []} /> */}
            {/* <TopClientsTable /> */}
        </div>
    );
}
