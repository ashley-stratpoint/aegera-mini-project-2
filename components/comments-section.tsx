"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { createComment, updateComment, deleteComment } from "@/lib/actions/comments";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function CommentsSection({ postId, blogId, comments, userId }: any) {
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isPending, startTransition] = useTransition();

    const sortedComments = [...comments].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        startTransition(async () => {
            await createComment(postId, userId, blogId, content);
            setContent("");
        });
    };

    const handleUpdate = async (commentId: number) => {
        if (!editContent.trim()) return;
        startTransition(async () => {
            await updateComment(commentId, blogId, editContent);
            setEditingId(null);
        });
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        startTransition(async () => {
            await deleteComment(deleteId, blogId);
            setDeleteId(null);
        });
    };

    return (
        <div className="dark:border-zinc-900 pt-10 text-sm md:text-base">
        
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete comment</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your comment from this site.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700 rounded-full"
                        >
                            {isPending ? "Deleting..." : "Delete Comment"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <h3 className="text-2xl font-bold mb-8">Comments</h3>

            <SignedIn>
                <form onSubmit={handleSubmit} className="mb-12 space-y-4">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Join the conversation..."
                        className="rounded-2xl p-4 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-800 min-h-[100px]"
                    />
                    <Button
                        type="submit"
                        disabled={isPending || !content.trim()}
                        className="rounded-full px-8"
                    >
                        {isPending ? "Posting..." : "Post Comment"}
                    </Button>
                </form>
            </SignedIn>

            <SignedOut>
                <div className="mb-12 p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-center bg-zinc-50/50 dark:bg-zinc-900/30">
                    <p className="text-zinc-500 mb-4">You must be signed in to join the discussion.</p>
                    <SignInButton mode="modal">
                        <Button variant="outline" className="rounded-full px-8">
                            Sign in to Comment
                        </Button>
                    </SignInButton>
                </div>
            </SignedOut>

            <div className="space-y-8">
                {sortedComments.map((comment: any) => {
                    const createdAtDate = new Date(comment.createdAt).getTime();
                    const updatedAtDate = new Date(comment.updatedAt).getTime();
                    
                    const isEdited = updatedAtDate > createdAtDate;
                    const isOwner = Number(comment.authorId) === Number(userId);
                    const isEditing = editingId === comment.id;

                    return (
                        <div key={comment.id} className="flex gap-4 group">
                            <img src={comment.author?.imageUrl} className="w-10 h-10 rounded-full object-cover" alt="avatar" />
                            
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{comment.author?.firstName} {comment.author?.lastName}</span>
                                        <span className="text-xs text-zinc-500">
                                            {formatDistanceToNow(updatedAtDate)} ago
                                            {isEdited && <span className="italic ml-1">(edited)</span>}
                                        </span>
                                    </div>

                                    {isOwner && !isEditing && (
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-black" onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}>
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-600" onClick={() => setDeleteId(comment.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-3">
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900"
                                        />
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleUpdate(comment.id)} className="h-8 px-3">
                                                <Check className="w-4 h-4 mr-2" /> Save
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => setEditingId(null)} className="h-8 px-3">
                                                <X className="w-4 h-4 mr-2" /> Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                        {comment.content}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}