'use client'

import { useState, useTransition, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, SendHorizonal, Bold, Italic, Underline as UnderlineIcon, ImageIcon, X, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { ToolbarToggle } from "@/components/toolbar-toggle";
import { useEditor, EditorContent } from '@tiptap/react';
import { createPost, updatePost, deletePost } from "@/lib/actions/posts";
import StarterKit from '@tiptap/starter-kit';
import { Underline as UnderlineExtension } from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Link from "next/link";
import { FIXED_CATEGORIES } from "@/lib/constants";
import { Loader2 } from "lucide-react";

interface WriteBlogPostProps {
    userId: number;
    initialData?: {
        id: number;
        blogId: string;
        title: string;
        content: string;
        imageUrl: string;
        categorySlug: string;
    };
}

export default function WriteBlogPost ({ userId, initialData }: WriteBlogPostProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || "");
    const [categorySlug, setCategorySlug] = useState<string | undefined>(initialData?.categorySlug);
    const [image, setImage] = useState(initialData?.imageUrl || "");
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
    const DEFAULT_NO_IMAGE = "https://placehold.co/600x400/f4f4f5/a1a1aa?text=No+Cover+Image";
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: false, 
            }),
            UnderlineExtension,
            Placeholder.configure({
                placeholder: 'Start your story...',
            }),
        ],

        content: initialData?.content || "", 
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-zinc dark:prose-invert focus:outline-none max-w-none min-h-[400px] text-lg leading-relaxed',
            },
        },
    });

    useEffect(() => {
        if (editor && initialData?.content && editor.getHTML() !== initialData.content) {
            editor.commands.setContent(initialData.content);
        }
    }, [editor, initialData?.content]);

    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                setImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePublish = () => {
        const currentContent = editor?.getHTML();
        const currentTitle = title.trim();
        const category = FIXED_CATEGORIES.find(c => c.slug === categorySlug);
        const categoryId = category ? category.id : null;

        if (!currentTitle || !currentContent || currentContent === '<p></p>' || !categoryId || !userId) {
            setErrorMsg("All fields are required to complete submission.");
            return;
        }
        
        if (!category) {
            setErrorMsg("Please select a valid category.");
            return;
        }
    
        const slug = currentTitle
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    
        startTransition(async () => {
            if (initialData) {
                const result = await updatePost(
                    initialData.id,
                    initialData.blogId,
                    category.id,
                    currentContent,
                    image,
                    currentTitle
                );

                if (result.success) {
                    router.refresh();
                    router.push(`/blogs/${initialData.blogId}`);
                } else {
                    setErrorMsg(result.error || "Failed to update post.");
                }
            } else {
                const slug = currentTitle
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w-]/g, '');
                    
                const result = await createPost(userId, slug, image, currentTitle, currentContent, category.id);

                if (result.success && 'slug' in result) { 
                    router.refresh();
                    router.push(`/blogs/${result.slug}`);
                } else {
                    setErrorMsg(result.error || "Failed to create post.");
                }
            }
});
    };

    if (!editor) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[100vh] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
                <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">
                    Initializing Editor...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">
            <header className="flex items-center justify-between mb-10">
                <Link href="/blogs" className="text-sm font-medium text-zinc-500 hover:text-black flex items-center gap-1 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Back to SIMULA
                </Link>
                <Button onClick={handlePublish} 
                        disabled={isPending} 
                        className="rounded-full px-6 gap-2 bg-zinc-900 dark:bg-white dark:text-black">
                    {isPending ? "Publishing..." : "Publish"} <SendHorizonal className="w-4 h-4" />
                </Button>
            </header>

            <div className="space-y-6 mb-10">
                <div className="relative w-full aspect-video rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden group">
                    {imagePreview ? (
                        <>
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                            <button onClick={() => { setImagePreview(null); setImage(""); }} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => fileInputRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-400 hover:text-zinc-600 transition-colors">
                            <ImageIcon className="w-8 h-8 stroke-1" />
                            <span className="text-sm font-medium uppercase tracking-tighter">Add Cover Image</span>
                        </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleUploadImage} accept="image/*" className="hidden" />
                </div>
            </div>

            <div className="space-y-10 mb-10">
                <Select value={categorySlug} onValueChange={setCategorySlug}>
                    <SelectTrigger className="w-fit min-w-[180px] h-9 rounded-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-[10px] font-bold tracking-wider px-8 focus:ring-0">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800">
                        {FIXED_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug} className="text-[11px] font-medium tracking-tight cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                    {cat.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <textarea
                    placeholder="This is your SIMULA"
                    className="w-full text-3xl md:text-5xl font-bold tracking-tight bg-transparent outline-none resize-none placeholder:text-zinc-200 border-none p-2 focus:ring-0"
                    rows={1}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                 />
            </div>
            
            <div className="sticky top-4 z-50 flex items-center gap-1 p-1.5 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl w-fit shadow-sm mb-6">
                <ToolbarToggle onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
                    <span className="text-xs font-bold">H1</span>
                </ToolbarToggle>
                <ToolbarToggle onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
                    <span className="text-xs font-bold">H2</span>
                </ToolbarToggle>
                <ToolbarToggle onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
                    <span className="text-xs font-bold">H3</span>
                </ToolbarToggle>
                
                <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                
                <ToolbarToggle onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
                    <Bold className="w-4 h-4" />
                </ToolbarToggle>
                <ToolbarToggle onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
                    <Italic className="w-4 h-4" />
                </ToolbarToggle>
                <ToolbarToggle onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarToggle>
            </div>

            <div className="relative min-h-[500px]">
                <EditorContent editor={editor} />
            </div>

            <AlertDialog open={!!errorMsg} onOpenChange={() => setErrorMsg(null)}>
                <AlertDialogContent className="rounded-3xl max-w-[400px]">
                    <AlertDialogHeader className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-xl font-bold tracking-tight">
                            This is not a masterpiece; it has a missing piece.
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400">
                            {errorMsg}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center mt-2">
                        <AlertDialogAction 
                            onClick={() => setErrorMsg(null)}
                            className="rounded-full px-10 bg-zinc-900 dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
                        >
                            Continue Editing
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}