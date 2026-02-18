"use client";

import { useState, useTransition } from "react";
import { createComment, updateComment, deleteComment } from "@/lib/actions/comments";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2, X, Check } from "lucide-react";

export default function CommentSection({ postId, blogId, comments, userId }: any) {
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isPending, startTransition] = useTransition();

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

    const handleDelete = async (commentId: number) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;
        startTransition(async () => {
            await deleteComment(commentId, blogId);
        });
    };

    return (
        <div className="mt-20 border-t border-zinc-100 dark:border-zinc-900 pt-10 text-sm md:text-base">
            <h3 className="text-2xl font-bold mb-8">Comments</h3>

            <form onSubmit={handleSubmit} className="mb-12 space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Join the conversation..."
                    className="text-sm w-full p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-zinc-800 outline-none resize-none min-h-[100px]"
                />
                <button
                    type="submit"
                    disabled={isPending || !content.trim()}
                    className="text-sm px-6 py-2 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {isPending ? "Posting..." : "Post Comment"}
                </button>
            </form>

            <div className="space-y-8">
                {comments.map((comment: any) => {
                    const isEdited = new Date(comment.updatedAt).getTime() > new Date(comment.createdAt).getTime();
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
                                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                                            {isEdited && <span className="italic ml-1">(edited)</span>}
                                        </span>
                                    </div>

                                    {isOwner && !isEditing && (
                                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
                                                className="text-zinc-400 hover:text-black-500"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-zinc-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none focus:ring-2 focus:ring-zinc-900"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUpdate(comment.id)} className="p-2 bg-gray-500 text-white rounded-lg hover:bg-zinc-900">
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                                                <X className="w-4 h-4" />
                                            </button>
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