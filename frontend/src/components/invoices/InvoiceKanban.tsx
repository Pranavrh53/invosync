import React, { useState } from 'react';
import { DndContext, type DragEndEvent, DragOverlay, useDraggable, useDroppable, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Invoice } from '../../hooks/useInvoices';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';

interface InvoiceKanbanProps {
    invoices: Invoice[];
    onStatusChange: (id: string, newStatus: string) => void;
}

const STATUSES = ['draft', 'sent', 'paid', 'overdue'];

const STATUS_LABELS: Record<string, string> = {
    draft: 'Drafts',
    sent: 'Sent',
    paid: 'Paid',
    overdue: 'Overdue',
};

const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-gray-100 border-gray-200',
    sent: 'bg-blue-50 border-blue-200',
    paid: 'bg-green-50 border-green-200',
    overdue: 'bg-red-50 border-red-200',
};

export default function InvoiceKanban({ invoices, onStatusChange }: InvoiceKanbanProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const invoicesByStatus = React.useMemo(() => {
        const grouped: Record<string, Invoice[]> = {
            draft: [],
            sent: [],
            paid: [],
            overdue: [],
        };

        invoices.forEach(inv => {
            if (grouped[inv.status]) {
                grouped[inv.status].push(inv);
            }
        });

        return grouped;
    }, [invoices]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // The over.id will be the status string (e.g., 'paid')
            const newStatus = over.id as string;
            const invoiceId = active.id as string;

            // Find the invoice to check if status actually changed
            const invoice = invoices.find(i => i.id === invoiceId);
            if (invoice && invoice.status !== newStatus) {
                onStatusChange(invoiceId, newStatus);
            }
        }

        setActiveId(null);
    };

    const activeInvoice = activeId ? invoices.find(i => i.id === activeId) : null;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-x-auto pb-4">
                {STATUSES.map((status) => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        invoices={invoicesByStatus[status]}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeInvoice ? (
                    <InvoiceCard invoice={activeInvoice} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

function KanbanColumn({ status, invoices }: { status: string, invoices: Invoice[] }) {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col h-full min-h-[500px] rounded-xl border p-4 transition-colors",
                STATUS_COLORS[status]
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">{STATUS_LABELS[status]}</h3>
                <span className="text-xs font-medium bg-white px-2 py-1 rounded-full border shadow-sm">
                    {invoices.length}
                </span>
            </div>

            <div className="space-y-3 flex-1">
                {invoices.map((invoice) => (
                    <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200/50">
                <div className="flex justify-between items-center text-sm font-medium text-gray-600">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                </div>
            </div>
        </div>
    );
}

function InvoiceCard({ invoice, isOverlay }: { invoice: Invoice, isOverlay?: boolean }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: invoice.id,
    });
    const navigate = useNavigate();

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all",
                isDragging && "opacity-50",
                isOverlay && "shadow-xl scale-105 rotate-2 cursor-grabbing"
            )}
            onClick={() => {
                // Prevent navigation if dragging
                if (!isDragging) {
                    // This is a bit tricky with dnd-kit, usually we want a separate button for navigation
                    // or handle click vs drag. For now, let's add a view button.
                }
            }}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-gray-500">{invoice.invoiceNumber}</span>
                <span className="text-xs font-medium text-gray-900">{formatDate(invoice.issueDate)}</span>
            </div>

            <h4 className="font-medium text-gray-900 mb-1 truncate">{invoice.clientName || 'Unknown Client'}</h4>

            <div className="flex justify-between items-center mt-3">
                <span className="font-bold text-lg text-gray-900">{formatCurrency(invoice.total)}</span>
                <button
                    className="text-xs text-primary hover:underline px-2 py-1 rounded hover:bg-primary/5"
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                >
                    View
                </button>
            </div>
        </div>
    );
}
