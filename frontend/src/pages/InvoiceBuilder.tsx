import { useParams } from "react-router-dom";
import { InvoiceForm } from "../components/invoices/InvoiceForm";

export default function InvoiceBuilder() {
    const { id } = useParams();
    return <InvoiceForm invoiceId={id} />;
}
