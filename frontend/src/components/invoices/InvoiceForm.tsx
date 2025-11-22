import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInvoices } from "../../hooks/useInvoices";
import { useClients } from "../../hooks/useClients";
import { useItemsStore } from "../../store/itemsStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { Trash2, Plus, Save, ArrowLeft, FileText, X } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import { generateInvoicePDF } from "../../utils/pdfGenerator";
import toast from "react-hot-toast";
import { invoiceApi } from "../../services/invoiceApi";
import { usePreferencesStore } from "../../store/userPreferences";
import { QRCodeCanvas } from "qrcode.react";
import { AIInvoiceAssistant } from "../ai/AIInvoiceAssistant";

const invoiceSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    issueDate: z.string().min(1, "Issue date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    items: z.array(z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.coerce.number().min(0, "Price must be positive"),
        taxRate: z.coerce.number(),
        hsnCode: z.string().optional(),
    })).min(1, "At least one item is required"),
    isInterState: z.boolean().default(false),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
    invoiceId?: string;
}

export function InvoiceForm({ invoiceId }: InvoiceFormProps) {
    const navigate = useNavigate();
    const { createInvoice, updateInvoice } = useInvoices();
    const { clients } = useClients();
    const { items: libraryItems } = useItemsStore();
    const { preferences } = usePreferencesStore();

    const [invoice, setInvoice] = useState<any>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("UPI");

    const location = useLocation();
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: {
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            items: [{ description: "", quantity: 1, unitPrice: 0, taxRate: 18 }],
            isInterState: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchItems = watch("items");
    const [totals, setTotals] = useState({ subtotal: 0, totalGST: 0, total: 0 });

    useEffect(() => {
        if (invoiceId) {
            invoiceApi.getById(invoiceId).then(data => {
                setInvoice(data);
                reset({
                    clientId: data.clientId,
                    issueDate: new Date(data.issueDate).toISOString().split('T')[0],
                    dueDate: new Date(data.dueDate).toISOString().split('T')[0],
                    items: data.items,
                    isInterState: false
                });
            }).catch(err => console.error(err));
        } else {
            // Check for pre-filled data from AI or Document Intelligence
            const state = location.state as any;
            if (state?.extractedData || state?.aiData) {
                const data = state.extractedData || state.aiData;

                // Map extracted items to form format if needed
                const items = data.items?.map((item: any) => ({
                    description: item.description || "",
                    quantity: item.quantity || 1,
                    unitPrice: item.unitPrice || 0,
                    taxRate: item.taxRate || 18,
                    hsnCode: item.hsnCode || "",
                })) || [{ description: "", quantity: 1, unitPrice: 0, taxRate: 18 }];

                reset({
                    clientId: "", // User still needs to select client
                    issueDate: data.date || new Date().toISOString().split('T')[0],
                    dueDate: data.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    items: items,
                    isInterState: false
                });

                // Clear state to prevent re-filling on refresh (optional, but good UX)
                window.history.replaceState({}, document.title);
            }
        }
    }, [invoiceId, reset, location.state]);

    useEffect(() => {
        const subtotal = watchItems.reduce((acc, item) => {
            return acc + (Number(item.quantity) * Number(item.unitPrice));
        }, 0);

        const totalGST = watchItems.reduce((acc: number, item: any) => {
            const amount = Number(item.quantity) * Number(item.unitPrice);
            return acc + (amount * (Number(item.taxRate) / 100));
        }, 0);

        setTotals({
            subtotal,
            totalGST,
            total: subtotal + totalGST,
        });
    }, [watchItems]);

    const handleAddItemFromLibrary = (itemId: string) => {
        const item = libraryItems.find(i => i.id === itemId);
        if (item) {
            append({
                description: item.name,
                quantity: 1,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
                hsnCode: item.hsnCode,
            });
        }
    };

    const onSubmit = async (data: InvoiceFormData) => {
        try {
            if (invoiceId) {
                await updateInvoice.mutateAsync({ id: invoiceId, data });
                // Don't navigate away, just stay on page so user can share
            } else {
                const newInvoice = await createInvoice.mutateAsync(data);
                // Navigate to the edit page of the new invoice
                navigate(`/invoices/${newInvoice.id}`, { replace: true });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDownloadPDF = () => {
        const data = watch();
        const invoiceData = {
            ...data,
            invoiceNumber: invoice?.invoiceNumber || "DRAFT",
            clientName: clients.find((c: any) => c.id === data.clientId)?.name,
            subtotal: totals.subtotal,
            gstBreakdown: { totalGST: totals.totalGST },
            total: totals.total,
            paymentLink: invoice?.paymentLink,
            upiId: preferences.upiId,
            freelancerName: preferences.freelancerName
        };
        generateInvoicePDF(invoiceData);
    };

    const handleGenerateLink = async () => {
        if (!invoiceId) return;
        try {
            const res = await invoiceApi.generateLink(invoiceId);
            setInvoice({ ...invoice, paymentLink: res.link });
            toast.success("Payment link generated");
        } catch (error) {
            toast.error("Failed to generate link");
        }
    };

    const handleAddPayment = async () => {
        if (!invoiceId || !paymentAmount) return;
        try {
            const updatedInvoice = await invoiceApi.addPayment(invoiceId, {
                amount: parseFloat(paymentAmount),
                date: new Date(),
                mode: paymentMode
            });
            setInvoice(updatedInvoice);
            setShowPaymentModal(false);
            setPaymentAmount("");
            toast.success("Payment recorded");
        } catch (error) {
            toast.error("Failed to add payment");
        }
    };

    const handleSimulatePayment = async () => {
        if (!invoiceId) return;
        try {
            const updatedInvoice = await invoiceApi.simulatePayment(invoiceId);
            setInvoice(updatedInvoice);
            toast.success("Payment simulated successfully");
        } catch (error) {
            toast.error("Failed to simulate payment");
        }
    };

    const handleAIGenerated = (data: any) => {
        const currentValues = watch();
        reset({
            ...currentValues,
            items: data.items,
        });
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20 relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {invoiceId ? "Edit Invoice" : "New Invoice"}
                        </h2>
                        <p className="text-muted-foreground">Create a new invoice for your client.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownloadPDF} type="button">
                        <FileText className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>

            {!invoiceId && (
                <div className="mb-6">
                    <AIInvoiceAssistant onInvoiceGenerated={handleAIGenerated} />
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Client Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Client</label>
                                <select
                                    {...register("clientId")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">Select a client...</option>
                                    {clients.map((client: any) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.clientId && (
                                    <p className="text-sm text-destructive">{errors.clientId.message}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isInterState"
                                    {...register("isInterState")}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isInterState" className="text-sm font-medium">
                                    Inter-state Transaction (IGST)
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Dates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                label="Issue Date"
                                type="date"
                                {...register("issueDate")}
                                error={errors.issueDate?.message}
                            />
                            <Input
                                label="Due Date"
                                type="date"
                                {...register("dueDate")}
                                error={errors.dueDate?.message}
                            />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Items</CardTitle>
                        <div className="flex items-center gap-2">
                            <select
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        handleAddItemFromLibrary(e.target.value);
                                        e.target.value = "";
                                    }
                                }}
                            >
                                <option value="">Add from Library...</option>
                                {libraryItems.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name} - {formatCurrency(item.unitPrice)}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => append({ description: "", quantity: 1, unitPrice: 0, taxRate: 18 })}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Custom Item
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Description</TableHead>
                                        <TableHead className="w-[15%]">HSN/SAC</TableHead>
                                        <TableHead className="w-[10%]">Qty</TableHead>
                                        <TableHead className="w-[15%]">Price</TableHead>
                                        <TableHead className="w-[10%]">GST %</TableHead>
                                        <TableHead className="w-[10%] text-right">Amount</TableHead>
                                        <TableHead className="w-[5%]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <Input
                                                    {...register(`items.${index}.description`)}
                                                    placeholder="Item description"
                                                    className="h-8"
                                                />
                                                {errors.items?.[index]?.description && (
                                                    <p className="text-xs text-destructive mt-1">Required</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    {...register(`items.${index}.hsnCode`)}
                                                    placeholder="HSN"
                                                    className="h-8"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    {...register(`items.${index}.quantity`)}
                                                    className="h-8"
                                                    min="1"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    {...register(`items.${index}.unitPrice`)}
                                                    className="h-8"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <select
                                                    {...register(`items.${index}.taxRate`)}
                                                    className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                                                >
                                                    <option value="5">5%</option>
                                                    <option value="12">12%</option>
                                                    <option value="18">18%</option>
                                                    <option value="28">28%</option>
                                                </select>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(
                                                    (watchItems[index]?.quantity || 0) * (watchItems[index]?.unitPrice || 0)
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-end mt-6">
                            <div className="w-full max-w-xs space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(totals.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total GST</span>
                                    <span>{formatCurrency(totals.totalGST)}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatCurrency(totals.total)}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate("/invoices")}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                </div>
            </form>

            {invoiceId && invoice && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {preferences.upiId && (
                                <div className="flex flex-col items-center p-4 border rounded-lg">
                                    <QRCodeCanvas
                                        value={`upi://pay?pa=${preferences.upiId}&pn=${preferences.freelancerName || 'Freelancer'}&am=${invoice.balanceDue ?? invoice.total}&cu=INR`}
                                        size={150}
                                    />
                                    <p className="mt-2 text-sm font-medium">Scan to Pay via UPI</p>
                                    <p className="text-xs text-muted-foreground">{preferences.upiId}</p>
                                </div>
                            )}

                            <Button onClick={handleGenerateLink} className="w-full" variant="secondary">
                                Generate Payment Link
                            </Button>
                            <Button onClick={handleSimulatePayment} className="w-full mt-2" variant="outline">
                                Simulate Payment (Test)
                            </Button>
                            {invoice.paymentLink && (
                                <div className="mt-2 p-2 bg-muted rounded text-center break-all">
                                    <a href={invoice.paymentLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                                        {invoice.paymentLink}
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Payment History</CardTitle>
                            <Button size="sm" variant="outline" onClick={() => setShowPaymentModal(true)}>
                                Record Payment
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Total Amount:</span>
                                    <span>{formatCurrency(invoice.total)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-green-600">
                                    <span>Paid Amount:</span>
                                    <span>{formatCurrency(invoice.total - (invoice.balanceDue ?? invoice.total))}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-orange-600">
                                    <span>Balance Due:</span>
                                    <span>{formatCurrency(invoice.balanceDue ?? invoice.total)}</span>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium mb-2">Transactions</h4>
                                    {invoice.payments && invoice.payments.length > 0 ? (
                                        <div className="space-y-2">
                                            {invoice.payments.map((p: any) => (
                                                <div key={p.id} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                                                    <div>
                                                        <p className="font-medium">{formatCurrency(p.amount)}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString()} - {p.mode}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{p.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No payments recorded.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Record Payment</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowPaymentModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Amount</label>
                                <Input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Enter amount"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Payment Mode</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                >
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                </select>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={handleAddPayment}>Save Payment</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
