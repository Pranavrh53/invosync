import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { type Item } from "../../store/itemsStore";
import { useEffect } from "react";

const itemSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    unitPrice: z.coerce.number().min(0, "Price must be positive"),
    taxRate: z.coerce.number().refine((val) => [5, 12, 18, 28].includes(val), {
        message: "Tax rate must be 5, 12, 18, or 28",
    }),
    hsnCode: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
    initialData?: Item | null;
    onSubmit: (data: ItemFormData) => void;
    onCancel: () => void;
}

export function ItemForm({ initialData, onSubmit, onCancel }: ItemFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ItemFormData>({
        resolver: zodResolver(itemSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            unitPrice: 0,
            taxRate: 18,
            hsnCode: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                description: initialData.description || "",
                unitPrice: initialData.unitPrice,
                taxRate: initialData.taxRate,
                hsnCode: initialData.hsnCode || "",
            });
        } else {
            reset({
                name: "",
                description: "",
                unitPrice: 0,
                taxRate: 18,
                hsnCode: "",
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="space-y-4">
            <Input
                label="Item Name"
                {...register("name")}
                error={errors.name?.message}
                placeholder="Web Development Services"
            />

            <Input
                label="Description (Optional)"
                {...register("description")}
                error={errors.description?.message}
                placeholder="Detailed description..."
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Unit Price (₹)"
                    type="number"
                    step="0.01"
                    {...register("unitPrice")}
                    error={errors.unitPrice?.message}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">GST Rate (%)</label>
                    <select
                        {...register("taxRate")}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                    </select>
                    {errors.taxRate && (
                        <p className="text-sm text-destructive">{errors.taxRate.message}</p>
                    )}
                </div>
            </div>

            <Input
                label="HSN/SAC Code (Optional)"
                {...register("hsnCode")}
                error={errors.hsnCode?.message}
                placeholder="998311"
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    {initialData ? "Update Item" : "Add Item"}
                </Button>
            </div>
        </form>
    );
}
