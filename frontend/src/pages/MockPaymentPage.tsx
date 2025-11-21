import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CheckCircle, CreditCard, ArrowLeft } from "lucide-react";
import { invoiceApi } from "../services/invoiceApi";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils/formatters";

export default function MockPaymentPage() {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (invoiceId) {
            loadInvoice();
        }
    }, [invoiceId]);

    const loadInvoice = async () => {
        try {
            const data = await invoiceApi.getById(invoiceId!);
            setInvoice(data);
        } catch (error) {
            toast.error("Failed to load invoice");
            navigate("/invoices");
        } finally {
            setLoading(false);
        }
    };

    const handleMockPayment = async () => {
        setProcessing(true);

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const updatedInvoice = await invoiceApi.simulatePayment(invoiceId!);
            setInvoice(updatedInvoice);
            setPaymentSuccess(true);
            toast.success("Payment successful!");

            // Redirect after 3 seconds
            setTimeout(() => {
                navigate(`/invoices/${invoiceId}`);
            }, 3000);
        } catch (error) {
            toast.error("Payment failed");
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading payment details...</p>
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <p className="text-gray-600">Invoice not found</p>
                        <Button onClick={() => navigate("/invoices")} className="mt-4">
                            Go to Invoices
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (paymentSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-4">
                            Your payment of {formatCurrency(invoice.balanceDue || invoice.total)} has been processed.
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to invoice...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => navigate(`/invoices/${invoiceId}`)}
                    className="mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Invoice
                </Button>

                <Card className="mb-6">
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        <CardTitle className="text-2xl">Mock Payment Page</CardTitle>
                        <p className="text-indigo-100 text-sm mt-2">
                            This is a test payment page. No real payment will be processed.
                        </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>⚠️ Test Mode:</strong> This is a mock payment page for testing purposes.
                                    To use real Razorpay payment links, add your Razorpay test keys to the backend .env file.
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-lg mb-4">Invoice Details</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Invoice Number:</span>
                                        <span className="font-medium">{invoice.invoiceNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Client:</span>
                                        <span className="font-medium">{invoice.clientName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium capitalize">{invoice.status}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span className="text-gray-900 font-semibold">Amount Due:</span>
                                        <span className="text-2xl font-bold text-indigo-600">
                                            {formatCurrency(invoice.balanceDue || invoice.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center">
                                        <CreditCard className="h-6 w-6 text-gray-600 mr-3" />
                                        <div>
                                            <p className="font-medium">Test Payment</p>
                                            <p className="text-sm text-gray-600">Simulated payment processing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleMockPayment}
                                disabled={processing}
                                className="w-full h-12 text-lg"
                                isLoading={processing}
                            >
                                {processing ? "Processing Payment..." : `Pay ${formatCurrency(invoice.balanceDue || invoice.total)}`}
                            </Button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                By clicking "Pay", you agree to simulate a test payment.
                                This will mark the invoice as paid in the system.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-semibold mb-3">How to enable real payments:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                        <li>Sign up at <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">razorpay.com</a></li>
                        <li>Get your test API keys from the dashboard</li>
                        <li>Add them to <code className="bg-gray-100 px-2 py-1 rounded">backend/functions/.env</code></li>
                        <li>Restart the backend server</li>
                        <li>Generate a new payment link - it will use Razorpay!</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
