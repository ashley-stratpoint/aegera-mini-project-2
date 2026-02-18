import { getBlogs } from "@/lib/blogs";
import { BlogCard } from "@/components/blog-card";
import TaglineSearch from "@/components/tagline-search";


export default async function BlogsPage() {
  const blogListing = await getBlogs();

  return (
    <div className="relative px-5 md:px-12 lg:px-28 py-10">
      <TaglineSearch />

      <h1 className="text-3xl font-bold mb-10 tracking-tighter relative z-10">
        Blog Museum
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 relative z-10">
        {blogListing.map((post: any) => (
          <BlogCard key={post.blogId} post={post} />
        ))}
      </div>
    </div>
  );
}
