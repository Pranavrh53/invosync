import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import InvoiceBuilder from "./pages/InvoiceBuilder";
import Clients from "./pages/Clients";
import Items from "./pages/Items";
import Estimates from "./pages/Estimates";
import Reports from "./pages/Reports";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import MockPaymentPage from "./pages/MockPaymentPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PublicInvoiceView from "./pages/PublicInvoiceView";
import DocumentIntelligence from "./pages/DocumentIntelligence";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/view/:token",
        element: <PublicInvoiceView />,
    },
    {
        path: "/",
        element: (
            <PrivateRoute>
                <Layout />
            </PrivateRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            { path: "invoices", element: <Invoices /> },
            { path: "invoices/new", element: <InvoiceBuilder /> },
            { path: "invoices/:id", element: <InvoiceBuilder /> },
            { path: "clients", element: <Clients /> },
            { path: "items", element: <Items /> },
            { path: "document-intelligence", element: <DocumentIntelligence /> },
            { path: "estimates", element: <Estimates /> },
            { path: "reports", element: <Reports /> },
            { path: "payments", element: <Payments /> },
            { path: "settings", element: <Settings /> },
        ],
    },
    {
        path: "/pay/:invoiceId",
        element: <MockPaymentPage />,
    },
]);
