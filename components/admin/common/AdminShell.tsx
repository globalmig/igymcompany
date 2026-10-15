import AdminSidebar from "@/components/admin/common/AdminSidebar";
import AdminTopbar from "@/components/admin/common/AdminTopbar";

interface AdminShellProps {
    children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
    return (
        <div className="admin-shell min-h-screen bg-admin-bg">
            <AdminTopbar />
            <div className="flex items-start">
                <AdminSidebar />
                <main className="flex-1 min-w-0 px-6 pt-7 pb-15 max-[900px]:px-4 max-[900px]:pt-5 max-[900px]:pb-10">{children}</main>
            </div>
        </div>
    );
}
