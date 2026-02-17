
// Fetch blog listing
export async function getBlogs() {
    const res = await fetch("api/blogs", {
        cache: "no-store"
    });

    if(!res.ok) {
        throw new Error("Failed to fetch blogs.");
    }

    return res.json();
}

// Fetch single blog
export async function getBlog(blogId: string) {
    const res = await fetch(`api/blogs/${blogId}`, {
        cache: "no-store"
    });

    if(!res.ok) {
        throw new Error("Post not found.");
    }

    return res.json();
}
