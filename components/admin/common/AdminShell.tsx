"use client";
import AdminSidebar from "@/components/admin/common/AdminSidebar";
import AdminTopbar from "@/components/admin/common/AdminTopbar";
import { useState } from "react";

interface AdminShellProps {
    children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
     const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="admin-shell bg-admin-bg">
            <AdminTopbar onMenuClick={() => setMobileNavOpen(true)}/>
            <div className="flex">
                <AdminSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)}/>
                <main className="flex-1 min-w-0 px-6 pt-7 pb-15 max-[900px]:px-4 max-[900px]:pt-5 max-[900px]:pb-10">{children}</main>
            </div>
        </div>
    );
}
