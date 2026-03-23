"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Code, Tag, Settings, LogOut, PlusCircle } from "lucide-react";
import { useUser } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { insforge } from "@/lib/insforge";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-8 h-screen w-full flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Code },
    { name: "Tags", href: "/dashboard/tags", icon: Tag }, // Even if Tag/Settings aren't fully implemented in prompt
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside className="w-64 border-r border-border bg-card flex flex-col p-4 flex-shrink-0">
        <Link href="/dashboard" className="text-2xl font-bold mb-8 pl-2 shrink-0">
          CodeCapture
        </Link>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href === "/dashboard" ? pathname === "/dashboard" : true);
            return (
              <Link key={item.name} href={item.href}>
                <span className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}>
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-8 space-y-4">
          <Button className="w-full justify-start gap-2" variant="default" onClick={() => router.push('/new')}>
            <PlusCircle className="w-5 h-5" />
            New Snippet
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={async () => {
            await insforge.auth.signOut();
            window.location.href = '/';
          }}>
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
          <div className="px-2 truncate text-xs text-muted-foreground mt-4">
            {user.email}
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background p-8 relative">
        {children}
      </main>
    </div>
  );
}
