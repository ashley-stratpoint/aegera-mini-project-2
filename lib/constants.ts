export interface CategoryConstant {
    name: string;
    slug: string;
    color: string;
}

export const FIXED_CATEGORIES: CategoryConstant[] = [
    { name: "Sining (Arts & Crafts)", slug: "sining", color: "#3b82f6" },
    { name: "Musika (Music)", slug: "musika", color: "#ec4899" },
    { name: "Tula (Poem)", slug: "tula", color: "#10b981" },
    { name: "Technology", slug: "technology", color: "#6366f1" },
    { name: "Dance", slug: "dance", color: "#f43f5e" },
    { name: "Life", slug: "life", color: "#8b5cf6" },
]