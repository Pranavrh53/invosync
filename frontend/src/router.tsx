import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import InvoiceBuilder from "./pages/InvoiceBuilder";
import Clients from "./pages/Clients";
import Items from "./pages/Items";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "invoices",
                element: <Invoices />,
            },
            {
                path: "invoices/new",
                element: <InvoiceBuilder />,
            },
            {
                path: "invoices/:id",
                element: <InvoiceBuilder />,
            },
            {
                path: "clients",
                element: <Clients />,
            },
            {
                path: "items",
                element: <Items />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
        ],
    },
]);
