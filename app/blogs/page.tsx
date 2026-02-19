import { getBlogs } from "@/lib/blogs";
import { BlogCard } from "@/components/blog-card";
import Tagline from "@/components/tagline";
import Search from "@/components/search";
import FeedProfileToggle from "@/components/feed-profile-toggle";
import { syncUser } from "@/lib/actions/sync-user";

type Props = {
    searchParams: Promise<{ view?: string }>;
}

export default async function BlogsPage({ searchParams }: { searchParams: Promise<{ view?: string; q?: string }>}) {
    const { view, q } = await searchParams;
    const user = await syncUser();

    const allBlogs = await getBlogs();

    let blogListing = (view === "profile" && user) 
      ? allBlogs.filter((post: any) => String(post.authorId) === String(user.id))
      : allBlogs;

    if (q) {
        const searchTerm = q.toLowerCase();
        blogListing = blogListing.filter((post: any) => {
            const matchesTitle = post.title?.toLowerCase().includes(searchTerm);
            const matchesCategory = post.category?.name?.toLowerCase().includes(searchTerm);
            const matchesAuthor = `${post.author?.firstName} ${post.author?.lastName}`
                .toLowerCase()
                .includes(searchTerm);

            return matchesTitle || matchesCategory || matchesAuthor;
        });
    }

  return (
    <div className="relative px-5 md:px-12 lg:px-28 py-10">
      <Tagline />
      <FeedProfileToggle />
      <Search />

      <h1 className="text-3xl font-bold my-10 tracking-tighter">
        {q ? `Search results for "${q}"` : view === "profile" ? "My Canvas" : "Blog Museum"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {blogListing.length > 0 ? (
            blogListing.map((post: any) => (
              <BlogCard key={post.blogId} post={post} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-zinc-500 italic">
              {view === "profile" 
                ? "No masterpieces yet." 
                : "Create your first masterpiece."}
            </div>
        )}
      </div>
    </div>
  );
}