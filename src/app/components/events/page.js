"use client";

import { useContext, useEffect, useState } from "react";
import { EventContext } from "../../Context/eventContext";
import "../events/events.css";
import Image from "next/image";

export default function CreateEvent() {
    const { createEvent, events, isAdmin } = useContext(EventContext);
    const [previewImage, setPreviewImage] = useState(null);
    const [form, setForm] = useState({
        title: "",
        date: "",
        location: "",
        description: "",
        imageFile: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createEvent(form);
        alert("Event created");
        setForm({
            title: "",
            date: "",
            location: "",
            description: "",
            imageFile: null
        });
    };

    return (
        <div className="events-page">
            <div className="events-wrapper">
                <div className="events-title-wrapper">
                    <div className="events-title-badge">All Events</div>
                </div>
                <section className="events-list">
                    {events.length === 0 ? (
                        <p>No events available.</p>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="event-card">
                                {event.imageUrl && (
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        width={300}
                                        height={200}
                                        className="event-image"
                                        onClick={() => setPreviewImage(event.imageUrl)}
                                        unoptimized
                                    />
                                )}
                                <h3>{event.title}</h3>
                                <h4>{event.date}</h4>
                                {event.location && <p>Location: {event.location}</p>}
                                {event.description && <p>{event.description}</p>}
                            </div>
                        ))
                    )}
                </section>

                {previewImage && (
                    <div
                        className="modal-img"
                        onClick={() => setPreviewImage(null)}
                    >
                        <div
                            className="modal-content-img"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={previewImage}
                                alt="Preview"
                                width={200}
                                height={200}
                                style={{ objectFit: "contain", borderRadius: "10px" }}
                                sizes="100vw"
                                unoptimized
                            />
                        </div>
                    </div>
                )}

                {isAdmin && (
                    <form onSubmit={handleSubmit} className="create-event-form">
                        <h2>Create Event</h2>

                        <input
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />

                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            required
                        />

                        <input
                            placeholder="Location"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                        />

                        <textarea
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
                        />

                        <button type="submit">Create Event</button>
                    </form>
                )}
            </div>
        </div>
    );
}