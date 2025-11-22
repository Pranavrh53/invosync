import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "../services/invoiceApi";
import { clientApi } from "../services/clientApi";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { formatCurrency } from "../utils/formatters";
import { FileText, Users, CheckCircle, Clock, Plus, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "../utils/cn";
import { RevenueGraph } from "../components/ui/RevenueGraph";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useRevenue } from "../hooks/useRevenue";
import { InvoiceStatusChart } from "../components/analytics/InvoiceStatusChart";
import { TopClientsTable } from "../components/analytics/TopClientsTable";
import { PaymentTrendsHeatmap } from "../components/analytics/PaymentTrendsHeatmap";
import { PredictiveCashFlow } from "../components/analytics/PredictiveCashFlow";
import { DocumentProcessor } from "../components/analytics/DocumentProcessor";

export default function Dashboard() {
    const navigate = useNavigate();

    const { data: invoices } = useQuery({
        queryKey: ["invoices"],
        queryFn: invoiceApi.getAll,
    });

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

    const formattedRevenueData = revenueData.map((item) => {
        // item.month is in format "YYYY-MM" (e.g., "2025-01")
        const [year, month] = item.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
            label: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
            value: item.revenue,
        };
    });

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

            {/* Advanced Analytics Section */}
            {/* Advanced Analytics Section */}
            <div className="mt-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight font-heading">AI Intelligence Center</h3>
                        <p className="text-muted-foreground">Automate your workflow with our advanced AI tools</p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2 mb-8">
                    {/* Document Intelligence Processor */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <FileText className="w-5 h-5" />
                            </div>
                            Document Processor
                        </div>
                        <DocumentProcessor />
                    </div>

                    {/* AI Magic Drafter CTA */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            Magic Drafter
                        </div>
                        <Card
                            className="h-[300px] flex flex-col items-center justify-center text-center p-8 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group border-dashed"
                            onClick={() => navigate("/invoices/new")}
                        >
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-2">Create with Magic Drafter</h4>
                            <p className="text-muted-foreground mb-6 max-w-xs">
                                Describe your invoice in plain English and let AI generate the line items, taxes, and totals for you.
                            </p>
                            <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                                Try Magic Drafter <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* AI Cash Flow Forecast */}
                {invoices && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                <Clock className="w-5 h-5" />
                            </div>
                            Cash Flow Predictions
                        </div>
                        <PredictiveCashFlow invoices={invoices} />
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Invoice Status Distribution */}
                    {invoiceStats && <InvoiceStatusChart stats={invoiceStats} />}

                    {/* Top Clients */}
                    <TopClientsTable />
                </div>

                {/* Payment Activity Heatmap */}
                <div className="mt-6">
                    <PaymentTrendsHeatmap />
                </div>
            </div>
        </div>
    );
}

