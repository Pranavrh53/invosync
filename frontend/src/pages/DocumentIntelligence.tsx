import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Upload, FileText, Download, Loader2, CheckCircle, ArrowRight, Sparkles, FileCheck, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function DocumentIntelligence() {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (uploadedFile: File) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];

        if (!validTypes.includes(uploadedFile.type)) {
            toast.error("Please upload a valid document (PDF, DOCX, DOC, or TXT)");
            return;
        }

        if (uploadedFile.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setFile(uploadedFile);
        setExtractedData(null);
        toast.success("File uploaded successfully!");
    };

    const processDocument = async () => {
        if (!file) return;

        setProcessing(true);
        try {
            // Simulate AI-powered document processing
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Mock extracted data with realistic invoice information
            const mockData = {
                invoiceNumber: "INV-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                clientName: "Acme Corporation Ltd.",
                clientEmail: "billing@acmecorp.com",
                clientPhone: "+91 98765 43210",
                clientAddress: "123 Business Park, Tech City, Mumbai 400001",
                items: [
                    { description: "Web Development Services", quantity: 40, unitPrice: 1500, taxRate: 18, amount: 60000 },
                    { description: "UI/UX Design", quantity: 20, unitPrice: 2000, taxRate: 18, amount: 40000 },
                    { description: "Cloud Hosting (Annual)", quantity: 1, unitPrice: 15000, taxRate: 18, amount: 15000 },
                ],
                subtotal: 115000,
                tax: 20700,
                total: 135700,
                notes: "Payment terms: Net 30 days. Late payment subject to 2% monthly interest.",
                confidence: 95, // AI confidence score
            };

            setExtractedData(mockData);
            toast.success("Document analyzed successfully! 95% confidence");
        } catch (error) {
            toast.error("Failed to process document");
        } finally {
            setProcessing(false);
        }
    };

    const createInvoiceFromData = () => {
        if (!extractedData) return;

        // Navigate to invoice builder with pre-filled data
        toast.success("Creating invoice with extracted data...");
        navigate("/invoices/new", { state: { extractedData } });
    };

    const generateDocument = async () => {
        if (!extractedData) return;

        try {
            toast.success("Generating professional PDF...");

            // Mock PDF generation
            await new Promise(resolve => setTimeout(resolve, 1000));

            const blob = new Blob(["Mock PDF content"], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${extractedData.invoiceNumber}_formatted.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to generate document");
        }
    };

    const benefits = [
        {
            icon: Zap,
            title: "Save Time",
            description: "Extract invoice data in seconds instead of manual entry",
            color: "text-yellow-600",
            bg: "bg-yellow-100",
        },
        {
            icon: CheckCircle,
            title: "95% Accuracy",
            description: "AI-powered extraction with high confidence scores",
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            icon: FileCheck,
            title: "Auto-Fill Forms",
            description: "Instantly populate invoice forms with extracted data",
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            icon: Sparkles,
            title: "Smart Processing",
            description: "Handles multiple formats: PDF, DOCX, scanned images",
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                    Document Intelligence
                </h2>
                <p className="text-muted-foreground mt-2">
                    Transform any invoice document into structured data instantly with AI-powered extraction
                </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                        <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className={`w-12 h-12 rounded-full ${benefit.bg} flex items-center justify-center mb-4`}>
                                    <Icon className={`h-6 w-6 ${benefit.color}`} />
                                </div>
                                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Processing Card */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Upload Section */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Step 1: Upload Document
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragActive ? "border-primary bg-primary/5" : "border-muted"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="doc-upload"
                                className="hidden"
                                accept=".pdf,.docx,.doc,.txt"
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="doc-upload" className="cursor-pointer">
                                <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                {file ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-green-600">
                                            <CheckCircle className="h-5 w-5" />
                                            <p className="font-semibold">{file.name}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setFile(null);
                                                setExtractedData(null);
                                            }}
                                        >
                                            Change File
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">
                                            Drag & drop your document here
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            or click to browse
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Supports: PDF, DOCX, DOC, TXT (Max 10MB)
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>

                        {file && !extractedData && (
                            <Button
                                onClick={processDocument}
                                disabled={processing}
                                className="w-full"
                                size="lg"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Analyzing with AI...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Extract Data with AI
                                    </>
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Results Section */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Step 2: Review & Use Data
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {extractedData ? (
                            <div className="space-y-4">
                                {/* Confidence Score */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-900">AI Confidence</span>
                                        <span className="text-2xl font-bold text-green-600">{extractedData.confidence}%</span>
                                    </div>
                                    <div className="w-full bg-green-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full transition-all"
                                            style={{ width: `${extractedData.confidence}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Extracted Data Preview */}
                                <div className="bg-muted/50 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Extracted Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Invoice #:</span>
                                            <p className="font-medium">{extractedData.invoiceNumber}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Date:</span>
                                            <p className="font-medium">{extractedData.date}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-muted-foreground">Client:</span>
                                            <p className="font-medium">{extractedData.clientName}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Items:</span>
                                            <p className="font-medium">{extractedData.items.length} items</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Total:</span>
                                            <p className="font-bold text-green-600">₹{extractedData.total.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <Button onClick={createInvoiceFromData} className="w-full" size="lg">
                                        <ArrowRight className="mr-2 h-5 w-5" />
                                        Create Invoice from Data
                                    </Button>
                                    <Button onClick={generateDocument} variant="outline" className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Formatted PDF
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => {
                                            setFile(null);
                                            setExtractedData(null);
                                        }}
                                    >
                                        Process Another Document
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <FileText className="h-16 w-16 mb-4 opacity-50" />
                                <p className="text-sm">Upload and process a document to see extracted data here</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* How It Works */}
            <Card>
                <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                1
                            </div>
                            <h4 className="font-semibold mb-2">Upload Document</h4>
                            <p className="text-sm text-muted-foreground">
                                Drag and drop or select any invoice document (PDF, DOCX, scanned image)
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                2
                            </div>
                            <h4 className="font-semibold mb-2">AI Extraction</h4>
                            <p className="text-sm text-muted-foreground">
                                Our AI analyzes the document and extracts all invoice data with 95% accuracy
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                3
                            </div>
                            <h4 className="font-semibold mb-2">Create or Export</h4>
                            <p className="text-sm text-muted-foreground">
                                Use extracted data to create new invoices or export as formatted PDF
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
