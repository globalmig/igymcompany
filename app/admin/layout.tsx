import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-session";
import AdminShell from "@/components/admin/common/AdminShell";
import AdminLoginForm from "@/components/admin/auth/AdminLoginForm";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const isAuth = await verifyAdminSessionToken(token);

    if (!isAuth) {
        return (
            <div className="admin-shell min-h-screen w-full flex items-center justify-center bg-admin-bg p-5">
                <AdminLoginForm />
            </div>
        );
    }

    return (
        <AdminShell>
            {children}
        </AdminShell>
    );
}
