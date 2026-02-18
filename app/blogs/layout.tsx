import DashboardHeader from "@/components/dashboard-header";
import FooterSection from "@/components/footer";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
        <DashboardHeader />

        <main className="flex-1">
            {children}
        </main>
        <footer className="px-5 md:px-12 lg:px-28 mt-auto border-t border-zinc-200 dark:border-zinc-800">
            <FooterSection />
        </footer>
    </div>
  );
}