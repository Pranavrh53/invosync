import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Upload, FileText, Check, AlertCircle, RefreshCw, FileOutput } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ExtractedData {
    invoiceNumber: string;
    date: string;
    clientName: string;
    amount: string;
    lineItems: number;
    confidence: number;
}

export function DocumentProcessor() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        setError(null);
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];

        if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc') && !file.name.endsWith('.txt')) {
            setError('Invalid file type. Please upload PDF, DOCX, DOC, or TXT.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            setError('File size exceeds 10MB limit.');
            return;
        }

        setFile(file);
    };

    const processDocument = () => {
        if (!file) return;

        setIsProcessing(true);

        // Simulate API processing time
        setTimeout(() => {
            // Mock extracted data
            setExtractedData({
                invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
                date: new Date().toISOString().split('T')[0],
                clientName: "Acme Corp International",
                amount: "₹1,25,000.00",
                lineItems: 4,
                confidence: 98
            });
            setIsProcessing(false);
        }, 2000);
    };

    const handleReset = () => {
        setFile(null);
        setExtractedData(null);
        setError(null);
    };

    const handleGeneratePdf = () => {
        // Mock PDF generation
        alert("Generating formatted PDF from extracted data...");
    };

    return (
        <Card className="w-full h-full">
            <CardContent className="p-6">
                {!extractedData ? (
                    <div className="space-y-4">
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer h-[200px] flex flex-col items-center justify-center gap-4",
                                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
                                error ? "border-destructive bg-destructive/5" : ""
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload')?.click()}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileSelect}
                            />

                            {file ? (
                                <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <FileText className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); handleReset(); }}
                                        className="mt-2 h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
                                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">Click or drag file to upload</p>
                                        <p className="text-xs text-muted-foreground">PDF, DOCX, DOC, TXT (Max 10MB)</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button
                                onClick={processDocument}
                                disabled={!file || isProcessing}
                                className="w-full"
                            >
                                {isProcessing ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Extract Data
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground">Invoice Number</p>
                                <p className="text-sm font-semibold">{extractedData.invoiceNumber}</p>
                            </div>
                            <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground">Date</p>
                                <p className="text-sm font-semibold">{extractedData.date}</p>
                            </div>
                            <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground">Client</p>
                                <p className="text-sm font-semibold">{extractedData.clientName}</p>
                            </div>
                            <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground">Total Amount</p>
                                <p className="text-sm font-semibold text-green-600">{extractedData.amount}</p>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-primary/10 rounded-full">
                                    <Check className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-primary">
                                    Confidence: {extractedData.confidence}%
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {extractedData.lineItems} items found
                            </span>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button onClick={handleGeneratePdf} className="flex-1" variant="outline">
                                <FileOutput className="mr-2 h-4 w-4" />
                                PDF
                            </Button>
                            <Button onClick={handleReset} className="flex-1">
                                Process New
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
