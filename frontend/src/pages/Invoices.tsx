import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices, type Invoice } from "../hooks/useInvoices";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Plus, Search, Eye, FileText, LayoutGrid, List } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";
import { cn } from "../utils/cn";
import InvoiceKanban from "../components/invoices/InvoiceKanban";

export default function Invoices() {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<'list' | 'board'>('board');

    // Debounce search could be added here, but for now direct passing
    const { invoices, isLoading, updateInvoiceStatus } = useInvoices({
        status: statusFilter || undefined,
        // Backend might support search, if not we filter client-side or just rely on status
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid": return "bg-green-100 text-green-700";
            case "sent": return "bg-blue-100 text-blue-700";
            case "overdue": return "bg-red-100 text-red-700";
            case "draft": return "bg-gray-100 text-gray-700";
            case "cancelled": return "bg-red-50 text-red-500";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        updateInvoiceStatus.mutate({ id, status: newStatus });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
                    <p className="text-muted-foreground">Manage and track your invoices.</p>
                </div>
                <Button onClick={() => navigate("/invoices/new")}>
                    <Plus className="mr-2 h-4 w-4" /> Create Invoice
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search invoices..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex bg-muted p-1 rounded-lg border">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'list' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-primary"
                            )}
                            title="List View"
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('board')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'board' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-primary"
                            )}
                            title="Board View"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {["", "draft", "sent", "paid", "overdue"].map((status) => (
                            <Button
                                key={status}
                                variant={statusFilter === status ? "primary" : "outline"}
                                size="sm"
                                onClick={() => setStatusFilter(status)}
                                className="capitalize whitespace-nowrap"
                            >
                                {status || "All"}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {viewMode === 'board' ? (
                <div className="h-[calc(100vh-250px)]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-muted-foreground">Loading board...</p>
                        </div>
                    ) : (
                        <InvoiceKanban
                            invoices={invoices}
                            onStatusChange={handleStatusChange}
                        />
                    )}
                </div>
            ) : (
                <div className="rounded-md border bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Loading invoices...
                                    </TableCell>
                                </TableRow>
                            ) : invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-8 w-8 opacity-50" />
                                            <p>No invoices found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                invoices.map((invoice: Invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium font-mono">
                                            {invoice.invoiceNumber}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.clientName || "Unknown Client"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span>{formatDate(invoice.issueDate)}</span>
                                                <span className="text-xs text-muted-foreground">Due: {formatDate(invoice.dueDate)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold">
                                            {formatCurrency(invoice.total)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
                                                getStatusColor(invoice.status)
                                            )}>
                                                {invoice.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => navigate(`/invoices/${invoice.id}`)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
