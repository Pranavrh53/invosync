import { useState } from "react";
import { useItemsStore, type Item } from "../store/itemsStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { ItemForm } from "../components/items/ItemForm";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import toast from "react-hot-toast";

export default function Items() {
    const { items, addItem, updateItem, deleteItem } = useItemsStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.hsnCode && item.hsnCode.includes(searchQuery))
    );

    const handleAddItem = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEditItem = (item: Item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteItem = (id: string) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            deleteItem(id);
            toast.success("Item deleted successfully");
        }
    };

    const handleSubmit = (data: any) => {
        if (editingItem) {
            updateItem(editingItem.id, data);
            toast.success("Item updated successfully");
        } else {
            addItem(data);
            toast.success("Item added successfully");
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Items Library</h2>
                    <p className="text-muted-foreground">Manage your products and services.</p>
                </div>
                <Button onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search items..."
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
                            <TableHead>HSN/SAC</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>GST Rate</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <Package className="h-8 w-8 opacity-50" />
                                        <p>No items found. Add your first item!</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div>{item.name}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                            {item.description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono text-xs">{item.hsnCode || "-"}</span>
                                    </TableCell>
                                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {item.taxRate}%
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEditItem(item)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteItem(item.id)}
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Edit Item" : "Add New Item"}
            >
                <ItemForm
                    initialData={editingItem}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}
