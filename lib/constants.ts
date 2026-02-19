export interface CategoryConstant {
    id: number;
    name: string;
    slug: string;
    color: string;
}

export const FIXED_CATEGORIES: CategoryConstant[] = [
    { id:1, name: "Sining (Arts & Crafts)", slug: "sining", color: "#3b82f6" },
    { id:2, name: "Musika (Music)", slug: "musika", color: "#ec4899" },
    { id:3, name: "Tula (Poem)", slug: "tula", color: "#10b981" },
    { id:4, name: "Technology", slug: "technology", color: "#6366f1" },
    { id:5, name: "Dance", slug: "dance", color: "#f43f5e" },
    { id:6, name: "Life", slug: "life", color: "#8b5cf6" },
]