import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Plus } from "lucide-react";

export default function Payments() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
                <Button onClick={() => console.log('Add payment')}> <Plus className="mr-2 h-4 w-4" /> New Payment </Button>
            </div>
            <Card>
                <CardHeader><CardTitle>Coming Soon</CardTitle></CardHeader>
                <CardContent>Payments functionality will be added here.</CardContent>
            </Card>
        </div>
    );
}
