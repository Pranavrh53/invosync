import { useForm } from "react-hook-form";
import { usePreferencesStore } from "../store/userPreferences";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

export default function Settings() {
    const { preferences, updatePreferences } = usePreferencesStore();

    const { register, handleSubmit } = useForm({
        defaultValues: preferences,
    });

    const onSubmit = (data: any) => {
        updatePreferences(data);
        toast.success("Settings saved successfully");
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your application preferences.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Currency</label>
                                <select
                                    {...register("currency")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="INR">Indian Rupee (INR)</option>
                                    <option value="USD">US Dollar (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                </select>
                            </div>

                            <Input
                                label="Invoice Prefix"
                                {...register("invoicePrefix")}
                                placeholder="INV-"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Default GST Rate (%)</label>
                                <select
                                    {...register("defaultTaxRate")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="5">5%</option>
                                    <option value="12">12%</option>
                                    <option value="18">18%</option>
                                    <option value="28">28%</option>
                                </select>
                            </div>

                            <Input
                                label="Default Payment Terms"
                                {...register("paymentTerms")}
                                placeholder="e.g. Due on Receipt"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
