export default async function DashboardPage() {
    const blogs = [1, 2, 3, 4, 5, 6]; 

    return (
        <div className="px-5 md:px-12 lg:px-28 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <div key={blog} className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border animate-pulse">
                    </div>
                ))}
            </div>
        </div>
    );
}