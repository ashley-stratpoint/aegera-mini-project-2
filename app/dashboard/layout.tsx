import DashboardHeader from "@/components/dashboard-header";
import FooterSection from "@/components/footer";

export default async function Dashboard() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <DashboardHeader />
            </main>
            <footer className="px-5 md:px-12 lg:px-28 mt-auto">
                <div className="border-t border-zinc-200 dark:border-zinc-800">
                    <FooterSection />
                </div>
            </footer>
        </div>
    );
}