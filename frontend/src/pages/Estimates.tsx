import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { formatCurrency, formatDate } from "../utils/formatters";
import { Plus, FileText } from "lucide-react";

export default function Estimates() {
    const navigate = useNavigate();
    const [estimates, setEstimates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Placeholder: In a real app you'd fetch from an API hook
    useEffect(() => {
        // Simulated data
        const data = [
            {
                id: "e1",
                estimateNumber: "EST-001",
                clientName: "Acme Corp",
                total: 12500,
                status: "draft",
                issueDate: new Date().toISOString(),
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: "e2",
                estimateNumber: "EST-002",
                clientName: "Beta Ltd",
                total: 8000,
                status: "sent",
                issueDate: new Date().toISOString(),
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ];
        setEstimates(data);
        setIsLoading(false);
    }, []);

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Estimates</h2>
                <Button onClick={() => navigate("/estimates/new")}>
                    <Plus className="mr-2 h-4 w-4" /> New Estimate
                </Button>
            </div>

            {isLoading ? (
                <p className="text-muted-foreground">Loading estimates...</p>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>All Estimates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Estimate #</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {estimates.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell>{e.estimateNumber}</TableCell>
                                        <TableCell>{e.clientName}</TableCell>
                                        <TableCell>{formatCurrency(e.total)}</TableCell>
                                        <TableCell className="capitalize">{e.status}</TableCell>
                                        <TableCell>{formatDate(e.issueDate)}</TableCell>
                                        <TableCell>{formatDate(e.dueDate)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/estimates/${e.id}`)}>
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
