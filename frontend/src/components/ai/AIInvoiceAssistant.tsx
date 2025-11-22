import { useState } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

interface AIInvoiceAssistantProps {
    onInvoiceGenerated: (data: any) => void;
}

export function AIInvoiceAssistant({ onInvoiceGenerated }: AIInvoiceAssistantProps) {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please describe the invoice first");
            return;
        }

        setIsGenerating(true);
        try {
            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simple keyword-based parser (Mocking AI behavior)
            // In a real app, this would call OpenAI/Gemini API
            const mockParse = (text: string) => {
                const items = [];
                const lowerText = text.toLowerCase();

                // Heuristic extraction for demo purposes
                if (lowerText.includes("website") || lowerText.includes("web")) {
                    items.push({ description: "Website Design & Development", quantity: 1, unitPrice: 50000, taxRate: 18, amount: 50000 });
                }
                if (lowerText.includes("logo") || lowerText.includes("branding")) {
                    items.push({ description: "Brand Identity Design", quantity: 1, unitPrice: 15000, taxRate: 18, amount: 15000 });
                }
                if (lowerText.includes("hour")) {
                    const hoursMatch = text.match(/(\d+)\s*hours?/i);
                    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 10;
                    items.push({ description: "Hourly Consultation", quantity: hours, unitPrice: 2000, taxRate: 18, amount: hours * 2000 });
                }

                // Default item if nothing matched
                if (items.length === 0) {
                    items.push({ description: "Consulting Services", quantity: 1, unitPrice: 10000, taxRate: 18, amount: 10000 });
                }

                return {
                    items,
                    notes: `Generated from prompt: "${text}"`,
                    paymentTerms: "net30"
                };
            };

            const generatedData = mockParse(prompt);

            // Calculate totals
            const subtotal = generatedData.items.reduce((sum, item) => sum + item.amount, 0);
            const tax = subtotal * 0.18;
            const total = subtotal + tax;

            onInvoiceGenerated({
                ...generatedData,
                subtotal,
                tax,
                total
            });

            toast.success("Invoice generated from description!");
            setPrompt("");
        } catch (error) {
            toast.error("Failed to generate invoice");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-purple-700 text-lg">
                    <Sparkles className="h-5 w-5" />
                    AI Magic Drafter
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Describe your invoice in plain English, and let AI draft it for you.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'Website redesign for Acme Corp, 40 hours at $50/hr'"
                            className="flex-1 px-3 py-2 rounded-md border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/80"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {isGenerating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Wand2 className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                        <span className="font-medium">Try:</span>
                        <button onClick={() => setPrompt("Logo design and branding package")} className="hover:text-purple-600 underline decoration-dotted">
                            "Logo design package"
                        </button>
                        <button onClick={() => setPrompt("SEO services for 3 months")} className="hover:text-purple-600 underline decoration-dotted">
                            "SEO services"
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
