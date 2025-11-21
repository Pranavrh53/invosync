import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "../services/invoiceApi";
import { clientApi } from "../services/clientApi";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { formatCurrency } from "../utils/formatters";
import { FileText, Users, CheckCircle, Clock, Plus } from "lucide-react";
import { cn } from "../utils/cn";
import { RevenueGraph } from "../components/ui/RevenueGraph";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useRevenue } from "../hooks/useRevenue";

export default function Dashboard() {
    const navigate = useNavigate();

    const { data: invoiceStats, isLoading: isStatsLoading } = useQuery({
        queryKey: ["invoiceStats"],
        queryFn: invoiceApi.getStats,
    });

    const { data: clientCount, isLoading: isClientsLoading } = useQuery({
        queryKey: ["clientCount"],
        queryFn: clientApi.getCount,
    });

    const { revenueData, isLoading: isRevenueLoading } = useRevenue();

    const stats = [
        {
            title: "Total Revenue",
            value: invoiceStats ? formatCurrency(invoiceStats.paidAmount) : "₹0",
            description: "Total paid invoices",
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            title: "Pending Amount",
            value: invoiceStats ? formatCurrency(invoiceStats.pendingAmount) : "₹0",
            description: "Invoices sent but not paid",
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
        },
        {
            title: "Total Invoices",
            value: invoiceStats?.total || 0,
            description: "All time invoices",
            icon: FileText,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            title: "Total Clients",
            value: clientCount?.count || 0,
            description: "Active clients",
            icon: Users,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
        },
    ];

    const formattedRevenueData = revenueData.map((item) => ({
        label: item.month.substring(0, 3),
        value: item.revenue,
    }));

    if (isStatsLoading || isClientsLoading || isRevenueLoading) {
        return (
            <div className="grid animate-pulse gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-2/3 rounded bg-muted"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-1/2 rounded bg-muted"></div>
                            <div className="mt-2 h-3 w-full rounded bg-muted"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your invoicing business.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={cn("p-2 rounded-full", stat.bgColor)}>
                                    <Icon className={cn("h-4 w-4", stat.color)} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RevenueGraph data={formattedRevenueData} caption="Last 6 months" />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button onClick={() => navigate("/invoices/new")} className="w-full justify-start">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Invoice
                        </Button>
                        <Button onClick={() => navigate("/clients")} variant="secondary" className="w-full justify-start">
                            <Users className="mr-2 h-4 w-4" />
                            Manage Clients
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
