import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Users, Package, Settings as SettingsIcon, Menu, LogOut, Sparkles, Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import Chatbot from "./Chatbot";

export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    const navItems = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Invoices", path: "/invoices", icon: FileText },
        { name: "Clients", path: "/clients", icon: Users },
        { name: "Items", path: "/items", icon: Package },
        { name: "Document AI", path: "/document-intelligence", icon: Sparkles },
        { name: "Settings", path: "/settings", icon: SettingsIcon },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout");
        }
    };

    const getUserInitial = () => {
        if (currentUser?.email) {
            return currentUser.email.charAt(0).toUpperCase();
        }
        return "U";
    };

    return (
        <div className="flex h-screen bg-background font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-20 flex items-center px-8 border-b bg-card/50 backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-xl font-bold text-foreground font-heading">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            <div className="w-4 h-4 rounded-full bg-white/90"></div>
                        </div>
                        InvoSync
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Main Menu
                    </div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t bg-muted/20">
                    <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-4 border border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-sm">Pro Plan</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                            Unlock advanced AI features and unlimited invoices.
                        </p>
                        <button className="w-full py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-muted/10">
                <header className="h-20 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Search Bar (Hidden on mobile) */}
                        <div className="hidden md:flex items-center relative">
                            <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search invoices, clients..."
                                className="h-10 pl-9 pr-4 rounded-full border bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all w-64 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-auto relative">
                        <button className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </button>

                        <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>

                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 hover:bg-muted/50 pl-2 pr-3 py-1.5 rounded-full transition-all border border-transparent hover:border-border"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-md">
                                    {getUserInitial()}
                                </div>
                                <div className="hidden sm:flex flex-col items-start text-left">
                                    <span className="text-sm font-medium leading-none">{currentUser?.displayName || "User"}</span>
                                    <span className="text-xs text-muted-foreground mt-0.5">Free Plan</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground ml-1" />
                            </button>

                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-popover rounded-xl shadow-xl border z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="px-4 py-3 border-b">
                                            <p className="text-sm font-medium text-foreground">
                                                {currentUser?.displayName || "User"}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                {currentUser?.email}
                                            </p>
                                        </div>
                                        <div className="p-2">
                                            <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors" onClick={() => setShowUserMenu(false)}>
                                                <SettingsIcon className="w-4 h-4" />
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Chatbot />
        </div>
    );
}

