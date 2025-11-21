import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { invoiceApi } from "../services/invoiceApi";
import { formatCurrency, formatDate } from "../utils/formatters";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Download, CreditCard, AlertCircle } from "lucide-react";
import { generateInvoicePDF } from "../utils/pdfGenerator";
import { cn } from "../utils/cn";

export default function PublicInvoiceView() {
    const { token } = useParams();
    const [isDownloading, setIsDownloading] = useState(false);

    const { data: invoice, isLoading, error } = useQuery({
        queryKey: ["publicInvoice", token],
        queryFn: () => invoiceApi.getByToken(token!),
        enabled: !!token,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading invoice...</p>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Invoice Not Found</h2>
                    <p className="text-muted-foreground">
                        The invoice you are looking for does not exist or the link has expired.
                    </p>
                </div>
            </div>
        );
    }

    const handleDownload = () => {
        setIsDownloading(true);
        try {
            generateInvoicePDF(invoice);
        } catch (err) {
            console.error("Failed to generate PDF", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            paid: "bg-green-100 text-green-700 border-green-200",
            sent: "bg-blue-100 text-blue-700 border-blue-200",
            overdue: "bg-red-100 text-red-700 border-red-200",
            draft: "bg-gray-100 text-gray-700 border-gray-200",
            cancelled: "bg-red-50 text-red-500 border-red-200",
        };
        return styles[status as keyof typeof styles] || styles.draft;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <FileTextIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Invoice #{invoice.invoiceNumber}</h1>
                            <p className="text-sm text-muted-foreground">
                                from {invoice.clientName || "InvoSync User"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="outline" onClick={handleDownload} isLoading={isDownloading} className="flex-1 sm:flex-none">
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                        {invoice.status !== 'paid' && (
                            <Button className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700">
                                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                            </Button>
                        )}
                    </div>
                </div>

                {/* Invoice Content */}
                <Card className="overflow-hidden border-none shadow-lg">
                    <div className="bg-primary h-2 w-full"></div>
                    <CardContent className="p-8 space-y-8">
                        {/* Status Banner */}
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                                <div className="text-4xl font-bold text-gray-900">
                                    {formatCurrency(invoice.total)}
                                </div>
                            </div>
                            <div className={cn("px-4 py-1.5 rounded-full text-sm font-bold border uppercase tracking-wide", getStatusBadge(invoice.status))}>
                                {invoice.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-b py-8">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Billed To</h3>
                                    <div className="font-semibold text-lg">{invoice.clientName}</div>
                                    {/* Add client address if available in invoice object, currently it's not directly there but in client object */}
                                </div>
                            </div>
                            <div className="space-y-4 md:text-right">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Dates</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between md:justify-end gap-4">
                                            <span className="text-muted-foreground">Issued:</span>
                                            <span className="font-medium">{formatDate(invoice.issueDate)}</span>
                                        </div>
                                        <div className="flex justify-between md:justify-end gap-4">
                                            <span className="text-muted-foreground">Due:</span>
                                            <span className="font-medium text-red-600">{formatDate(invoice.dueDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="rounded-lg border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-[40%]">Description</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoice.items.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {item.description}
                                                {item.hsnCode && <span className="ml-2 text-xs text-muted-foreground">(HSN: {item.hsnCode})</span>}
                                            </TableCell>
                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(item.amount)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Totals */}
                        <div className="flex flex-col md:flex-row justify-end">
                            <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">GST Total</span>
                                    <span>{formatCurrency(invoice.gstBreakdown.total)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between items-center">
                                    <span className="font-bold text-lg">Total Due</span>
                                    <span className="font-bold text-2xl text-primary">{formatCurrency(invoice.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        {invoice.notes && (
                            <div className="bg-gray-50 p-4 rounded-lg border text-sm text-muted-foreground">
                                <span className="font-bold block mb-1 text-gray-700">Notes:</span>
                                {invoice.notes}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground">
                    Powered by <span className="font-bold text-primary">InvoSync</span>
                </div>
            </div>
        </div>
    );
}

function FileTextIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    );
}
