import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { TrendingUp, AlertCircle } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

interface PredictiveCashFlowProps {
    invoices: any[];
}

export function PredictiveCashFlow({ invoices = [] }: PredictiveCashFlowProps) {
    // Helper function to safely count pending invoices
    const getPendingInvoicesCount = (invoices: any[]) => {
        if (!Array.isArray(invoices)) return 0;
        return invoices.filter(i => i?.status !== 'paid' && i?.dueDate && new Date(i.dueDate) > new Date()).length;
    };
    const predictions = useMemo(() => {
        // 1. Get historical monthly revenue
        const monthlyRevenue: Record<string, number> = {};
        const now = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        // Ensure invoices is an array before using forEach
        if (!Array.isArray(invoices)) {
            return {
                predictedNextMonth: 0,
                growthRate: 0,
                incomingCash: 0,
                confidence: 0
            };
        }

        invoices.forEach(inv => {
            const date = new Date(inv.issueDate);
            if (date >= sixMonthsAgo && date <= now) {
                const key = date.toLocaleString('default', { month: 'short' });
                monthlyRevenue[key] = (monthlyRevenue[key] || 0) + inv.total;
            }
        });

        // 2. Calculate average growth rate (simple linear trend)
        const values = Object.values(monthlyRevenue);

        let growthRate = 0;
        if (values.length > 1) {
            const first = values[0];
            const last = values[values.length - 1];
            growthRate = ((last - first) / first); // Simple growth calculation
        }

        // 3. Predict next month
        const lastMonthRevenue = values[values.length - 1] || 0;
        const predictedNextMonth = lastMonthRevenue * (1 + (growthRate > 0.5 ? 0.1 : growthRate)); // Cap growth at 50% for realism

        // 4. Calculate incoming cash (unpaid invoices due in next 30 days)
        const next30Days = new Date();
        next30Days.setDate(now.getDate() + 30);

        let incomingCash = 0;
        invoices.forEach(inv => {
            if (inv.status !== 'paid') {
                const dueDate = new Date(inv.dueDate);
                if (dueDate >= now && dueDate <= next30Days) {
                    incomingCash += (inv.balanceDue || inv.total);
                }
            }
        });

        return {
            predictedNextMonth,
            growthRate,
            incomingCash,
            confidence: 85 // Mock confidence score
        };
    }, [invoices]);

    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-indigo-900">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    AI Cash Flow Forecast
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Projected Revenue (Next Month)</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-indigo-700">
                                {formatCurrency(predictions.predictedNextMonth)}
                            </span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${predictions.growthRate >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {predictions.growthRate >= 0 ? '+' : ''}{(predictions.growthRate * 100).toFixed(1)}% trend
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Based on 6-month historical data
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Confirmed Incoming (30 Days)</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-emerald-700">
                                {formatCurrency(predictions.incomingCash)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>From {getPendingInvoicesCount(invoices)} pending invoices</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-100">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">AI Confidence Score</span>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{ width: `${predictions.confidence}%` }}
                                />
                            </div>
                            <span className="font-medium text-indigo-700">{predictions.confidence}%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
