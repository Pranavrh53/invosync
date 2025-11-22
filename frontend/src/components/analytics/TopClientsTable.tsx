import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { invoiceApi } from "../../services/invoiceApi";
import { formatCurrency } from "../../utils/formatters";
import { TrendingUp, Users } from "lucide-react";

export function TopClientsTable() {
    const { data: invoices } = useQuery({
        queryKey: ["allInvoices"],
        queryFn: () => invoiceApi.getAll({ limit: 1000 }),
    });

    // Aggregate revenue by client
    const topClients = invoices?.data
        ? Object.values(
            invoices.data.reduce((acc: any, invoice: any) => {
                const clientId = invoice.clientId;
                if (!acc[clientId]) {
                    acc[clientId] = {
                        clientId,
                        clientName: invoice.clientName || "Unknown",
                        totalRevenue: 0,
                        invoiceCount: 0,
                    };
                }
                if (invoice.status === "paid") {
                    acc[clientId].totalRevenue += invoice.total || 0;
                }
                acc[clientId].invoiceCount += 1;
                return acc;
            }, {})
        )
            .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
            .slice(0, 5)
        : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Clients by Revenue
                </CardTitle>
            </CardHeader>
            <CardContent>
                {topClients.length > 0 ? (
                    <div className="space-y-4">
                        {topClients.map((client: any, index: number) => (
                            <div
                                key={client.clientId}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium">{client.clientName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {client.invoiceCount} invoice{client.invoiceCount !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">
                                        {formatCurrency(client.totalRevenue)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mb-2 opacity-50" />
                        <p className="text-sm">No client data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
