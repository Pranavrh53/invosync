import { useState } from "react";
import { useClients, type Client } from "../hooks/useClients";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { ClientForm } from "../components/clients/ClientForm";
import { Plus, Search, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Pagination } from "../components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function Clients() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);

    const { clients, pagination, isLoading, createClient, updateClient, deleteClient } = useClients({
        page,
        search: debouncedSearch,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const handleAddClient = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const handleEditClient = (client: Client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClient = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            await deleteClient.mutateAsync(id);
        }
    };

    const handleSubmit = async (data: any) => {
        if (editingClient) {
            await updateClient.mutateAsync({ id: editingClient.id, data });
        } else {
            await createClient.mutateAsync(data);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
                    <p className="text-muted-foreground">Manage your client database.</p>
                </div>
                <Button onClick={handleAddClient}>
                    <Plus className="mr-2 h-4 w-4" /> Add Client
                </Button>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search clients..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>GSTIN</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    Loading clients...
                                </TableCell>
                            </TableRow>
                        ) : clients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No clients found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client: Client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">
                                        <div>{client.name}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                            {client.address}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{client.email}</div>
                                        <div className="text-xs text-muted-foreground">{client.phone}</div>
                                    </TableCell>
                                    <TableCell>
                                        {client.gstin ? (
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                                <span className="font-mono text-xs">{client.gstin}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <XCircle className="h-3.5 w-3.5" />
                                                <span className="text-xs">Not Provided</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditClient(client)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteClient(client.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingClient ? "Edit Client" : "Add New Client"}
            >
                <ClientForm
                    initialData={editingClient}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={createClient.isPending || updateClient.isPending}
                />
            </Modal>
        </div>
    );
}