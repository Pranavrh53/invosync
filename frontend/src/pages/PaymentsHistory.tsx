import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "../services/invoiceApi";

export default function PaymentsHistory() {
    const { data: payments } = useQuery({
        queryKey: ["payments"],
        queryFn: () => invoiceApi.getPayments(),
    });

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-8">
            <h2 className="text-3xl font-bold tracking-tight">Payments History</h2>
            <Card>
                <CardHeader><CardTitle>Recent Payments</CardTitle></CardHeader>
                <CardContent>
                    {payments?.length ? (
                        <table className="w-full text-sm">
                            <thead className="bg-muted/20">
                                <tr>
                                    <th className="p-2 text-left">Invoice #</th>
                                    <th className="p-2 text-left">Amount</th>
                                    <th className="p-2 text-left">Date</th>
                                    <th className="p-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p: any) => (
                                    <tr key={p.id} className="border-t">
                                        <td className="p-2">{p.invoiceNumber}</td>
                                        <td className="p-2">{p.amount}</td>
                                        <td className="p-2">{new Date(p.date).toLocaleDateString()}</td>
                                        <td className="p-2">{p.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-muted-foreground">No payments recorded.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
