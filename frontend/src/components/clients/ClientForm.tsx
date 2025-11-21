import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { type Client } from "../../hooks/useClients";
import { useEffect } from "react";

const clientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(1, "Address is required"),
    gstin: z.string()
        .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, "Invalid GSTIN format")
        .optional()
        .or(z.literal("")),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
    initialData?: Client | null;
    onSubmit: (data: ClientFormData) => void;
    isLoading?: boolean;
    onCancel: () => void;
}

export function ClientForm({ initialData, onSubmit, isLoading, onCancel }: ClientFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            gstin: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                email: initialData.email,
                phone: initialData.phone,
                address: initialData.address,
                gstin: initialData.gstin || "",
            });
        } else {
            reset({
                name: "",
                email: "",
                phone: "",
                address: "",
                gstin: "",
            });
        }
    }, [initialData, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Client Name"
                {...register("name")}
                error={errors.name?.message}
                placeholder="Acme Corp"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    placeholder="contact@example.com"
                />
                <Input
                    label="Phone"
                    {...register("phone")}
                    error={errors.phone?.message}
                    placeholder="+91 9876543210"
                />
            </div>

            <Input
                label="Address"
                {...register("address")}
                error={errors.address?.message}
                placeholder="123 Business Park, Mumbai"
            />

            <Input
                label="GSTIN (Optional)"
                {...register("gstin")}
                error={errors.gstin?.message}
                placeholder="22AAAAA0000A1Z5"
                className="uppercase"
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? "Update Client" : "Add Client"}
                </Button>
            </div>
        </form>
    );
}
