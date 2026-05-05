"use client";

import { useContext, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { NewsContext } from "../../Context/newsContext";
import "../news/news.css";
import Image from "next/image";

export default function NewsPage() {
    const { news, loading, createNews, updateNews, deleteNews, isAdmin } = useContext(NewsContext);

    const [form, setForm] = useState({
        title: "",
        content: "",
        imageFile: null
    });

    const [editForm, setEditForm] = useState({
        id: null,
        title: "",
        content: "",
        imageFile: null
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        await createNews(form);
        setForm({
            title: "",
            content: "",
            imageFile: null
        });
    };

    const handleEdit = (item) => {
        setEditForm({
            id: item.id,
            title: item.title,
            content: item.content,
            imageFile: null
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editForm.title || !editForm.content) return;

        await updateNews(editForm);
        setEditForm({
            id: null,
            title: "",
            content: "",
            imageFile: null
        });
    };

    return (
        <main className="news-page">
            <header className="news-header">
                <h1>League News</h1>
                <p>Latest updates, announcements, and match information</p>
            </header>

            {/* CREATE NEWS */}
            {isAdmin && (
                <section className="card highlights">
                    <h2> Add New Article</h2>
                    <form onSubmit={handleCreate} className="news-form">
                        <input
                            type="text"
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            required
                        />
                        <textarea
                            placeholder="Content"
                            value={form.content}
                            onChange={(e) =>
                                setForm({ ...form, content: e.target.value })
                            }
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
                        />
                        <button type="submit">Add Article</button>
                    </form>
                </section>
            )}

            {/* NEWS LIST */}
            <section className="card highlights">
                <h2>📰 League News</h2>
                <div className="news">
                    {loading ? (
                        <p>Loading news...</p>
                    ) : news.length > 0 ? (
                        news.map((item) => (
                            <article key={item.id} className="news-article">
                                {editForm.id === item.id ? (
                                    <form onSubmit={handleUpdate}>
                                        <input
                                            type="text"
                                            value={editForm.title}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    title: e.target.value
                                                })
                                            }
                                            required
                                        />
                                        <textarea
                                            value={editForm.content}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    content: e.target.value
                                                })
                                            }
                                            required
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    imageFile:
                                                        e.target.files[0]
                                                })
                                            }
                                        />
                                        <button type="submit" className="news-update-btn">Update</button>
                                        <button type="button" className="news-cancel-btn" onClick={() =>
                                            setEditForm({
                                                id: null,
                                                title: "",
                                                content: "",
                                                imageFile: null
                                            })
                                        }>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <h3>{item.title}</h3>
                                        {item.imageUrl && (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.title}
                                                width={300}
                                                height={200}
                                                className="event-image"
                                                onClick={() => setPreviewImage(item.imageUrl)}
                                                unoptimized
                                            />
                                        )}
                                        <p>{item.content}</p>
                                        <span className="news-time">
                                            {item.publishedAt
                                                ? formatDistanceToNow(new Date(item.publishedAt.seconds * 1000), { addSuffix: true })
                                                : "Just now"}
                                        </span>
                                        {isAdmin && (
                                            <div className="news-actions">
                                                <button onClick={() => handleEdit(item)}>Edit</button>
                                                <button onClick={() => deleteNews(item.id)}>Delete</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </article>
                        ))
                    ) : (
                        <p>No news available.</p>
                    )}
                </div>
            </section>
        </main>
    );
}
