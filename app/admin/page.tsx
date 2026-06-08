"use client";

import "../../styles/admin.css";
import { useState, useEffect, useRef } from "react";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../lib/firebase";

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    hoverImageUrl: string;
};

export default function AdminPage() {
    /* ================= CREATE STATES ================= */
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [mainFile, setMainFile] = useState<File | null>(null);
    const [hoverFile, setHoverFile] = useState<File | null>(null);

    const [mainPreview, setMainPreview] = useState<string | null>(null);
    const [hoverPreview, setHoverPreview] = useState<string | null>(null);

    const mainFileInputRef = useRef<HTMLInputElement | null>(null);
    const hoverFileInputRef = useRef<HTMLInputElement | null>(null);

    /* ================= PRODUCTS ================= */
    const [products, setProducts] = useState<Product[]>([]);

    /* ================= EDIT STATES ================= */
    const [editingId, setEditingId] = useState<string | null>(null);

    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const [editMainFile, setEditMainFile] = useState<File | null>(null);
    const [editHoverFile, setEditHoverFile] = useState<File | null>(null);

    const [editMainPreview, setEditMainPreview] = useState<string | null>(null);
    const [editHoverPreview, setEditHoverPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    /* ================= FETCH PRODUCTS ================= */
    const fetchProducts = async () => {
        const snapshot = await getDocs(collection(db, "pickups"));

        const data = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Product, "id">),
        }));

        setProducts(data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    /* ================= CREATE PRODUCT ================= */
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !price || !description || !mainFile || !hoverFile) {
            alert("Please fill in all fields and upload both images.");
            return;
        }

        // Upload main image
        const mainStorageRef = ref(
            storage,
            `products/${Date.now()}-main-${mainFile.name}`
        );

        await uploadBytes(mainStorageRef, mainFile);
        const imageUrl = await getDownloadURL(mainStorageRef);

        // Upload hover image
        const hoverStorageRef = ref(
            storage,
            `products/${Date.now()}-hover-${hoverFile.name}`
        );

        await uploadBytes(hoverStorageRef, hoverFile);
        const hoverImageUrl = await getDownloadURL(hoverStorageRef);

        // Save product to Firestore
        await addDoc(collection(db, "pickups"), {
            name,
            price: Number(price),
            description,
            imageUrl,
            hoverImageUrl,
        });

        // Reset form
        setName("");
        setPrice("");
        setDescription("");

        setMainFile(null);
        setHoverFile(null);

        setMainPreview(null);
        setHoverPreview(null);

        if (mainFileInputRef.current) mainFileInputRef.current.value = "";
        if (hoverFileInputRef.current) hoverFileInputRef.current.value = "";

        fetchProducts();
    };

    /* ================= DELETE PRODUCT ================= */
    const handleDelete = async (id: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this product?");

        if (!confirmDelete) return;

        await deleteDoc(doc(db, "pickups", id));

        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    /* ================= START EDIT ================= */
    const startEdit = (p: Product) => {
        setEditingId(p.id);

        setEditName(p.name);
        setEditPrice(String(p.price));
        setEditDescription(p.description || "");

        setEditMainPreview(p.imageUrl || null);
        setEditHoverPreview(p.hoverImageUrl || null);

        setEditMainFile(null);
        setEditHoverFile(null);
    };

    /* ================= UPDATE PRODUCT ================= */
    const handleUpdate = async (id: string) => {
        try {
            setIsSaving(true);
            console.log("Start updating product:", id);

            if (!editName || !editPrice) {
                alert("Please fill in product name and price.");
                return;
            }

            let newImageUrl = editMainPreview || "";
            let newHoverImageUrl = editHoverPreview || "";

            // Upload new main image if selected
            if (editMainFile) {
                console.log("Uploading main image...");

                const mainStorageRef = ref(
                    storage,
                    `products/${Date.now()}-main-${editMainFile.name}`
                );

                await uploadBytes(mainStorageRef, editMainFile);
                newImageUrl = await getDownloadURL(mainStorageRef);

                console.log("Main image uploaded:", newImageUrl);
            }

            // Upload new hover image if selected
            if (editHoverFile) {
                console.log("Uploading hover image...");

                const hoverStorageRef = ref(
                    storage,
                    `products/${Date.now()}-hover-${editHoverFile.name}`
                );

                await uploadBytes(hoverStorageRef, editHoverFile);
                newHoverImageUrl = await getDownloadURL(hoverStorageRef);

                console.log("Hover image uploaded:", newHoverImageUrl);
            }

            console.log("Updating Firestore...");

            await updateDoc(doc(db, "pickups", id), {
                name: editName,
                price: Number(editPrice),
                description: editDescription,
                imageUrl: newImageUrl,
                hoverImageUrl: newHoverImageUrl,
            });

            console.log("Firestore updated successfully.");

            setProducts((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? {
                            ...p,
                            name: editName,
                            price: Number(editPrice),
                            description: editDescription,
                            imageUrl: newImageUrl,
                            hoverImageUrl: newHoverImageUrl,
                        }
                        : p
                )
            );

            setEditingId(null);
            setEditMainFile(null);
            setEditHoverFile(null);
            setEditMainPreview(null);
            setEditHoverPreview(null);

            alert("Product updated successfully!");
        } catch (error) {
            console.error("UPDATE ERROR:", error);
            alert("Update failed. Open Console with F12 to see the error.");
        } finally {
            setIsSaving(false);
        }
    };

    /* ================= CANCEL EDIT ================= */
    const cancelEdit = () => {
        setEditingId(null);

        setEditName("");
        setEditPrice("");
        setEditDescription("");

        setEditMainFile(null);
        setEditHoverFile(null);

        setEditMainPreview(null);
        setEditHoverPreview(null);
    };

    return (
        <main className="admin">
            <h1>Admin Panel</h1>

            {/* ================= CREATE FORM ================= */}
            <form onSubmit={handleCreate} className="admin-form">
                <h2>Add New Product</h2>

                <input
                    placeholder="Product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    placeholder="Price (€)"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <textarea
                    placeholder="Product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <label>Main image</label>
                <input
                    type="file"
                    accept="image/*"
                    ref={mainFileInputRef}
                    onChange={(e) => {
                        const f = e.target.files?.[0];

                        if (f) {
                            setMainFile(f);
                            setMainPreview(URL.createObjectURL(f));
                        }
                    }}
                />

                {mainPreview && (
                    <img src={mainPreview} alt="Main preview" className="preview" />
                )}

                <label>Hover image</label>
                <input
                    type="file"
                    accept="image/*"
                    ref={hoverFileInputRef}
                    onChange={(e) => {
                        const f = e.target.files?.[0];

                        if (f) {
                            setHoverFile(f);
                            setHoverPreview(URL.createObjectURL(f));
                        }
                    }}
                />

                {hoverPreview && (
                    <img src={hoverPreview} alt="Hover preview" className="preview" />
                )}

                <button type="submit">Add Product</button>
            </form>

            {/* ================= PRODUCT LIST ================= */}
            <div className="product-list">
                <h2>Products</h2>

                {products.map((p) => (
                    <div className="product-item" key={p.id}>
                        {editingId === p.id ? (
                            /* ================= EDIT FORM ================= */
                            <div className="edit-form">
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />

                                <input
                                    type="number"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                />

                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />

                                <label>Main image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];

                                        if (f) {
                                            setEditMainFile(f);
                                            setEditMainPreview(URL.createObjectURL(f));
                                        }
                                    }}
                                />

                                {editMainPreview && (
                                    <img
                                        src={editMainPreview}
                                        alt="Edit main preview"
                                        className="preview"
                                    />
                                )}

                                <label>Hover image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];

                                        if (f) {
                                            setEditHoverFile(f);
                                            setEditHoverPreview(URL.createObjectURL(f));
                                        }
                                    }}
                                />

                                {editHoverPreview && (
                                    <img
                                        src={editHoverPreview}
                                        alt="Edit hover preview"
                                        className="preview"
                                    />
                                )}

                                <div className="edit-actions">
                                    <button
                                        type="button"
                                        onClick={() => handleUpdate(p.id)}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "Saving..." : "Save"}
                                    </button>

                                    <button type="button" onClick={cancelEdit}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ================= PRODUCT DISPLAY ================= */
                            <>
                                <div className="product-left">
                                    <div className="product-images">
                                        {p.imageUrl && (
                                            <img src={p.imageUrl} alt={p.name} className="thumb" />
                                        )}

                                        {p.hoverImageUrl && (
                                            <img
                                                src={p.hoverImageUrl}
                                                alt={`${p.name} hover`}
                                                className="thumb"
                                            />
                                        )}
                                    </div>

                                    <div className="product-info-admin">
                                        <strong>{p.name}</strong>
                                        <span>${p.price}</span>
                                        <p>{p.description}</p>
                                    </div>
                                </div>

                                <div className="product-actions">
                                    <button className="edit-btn" onClick={() => startEdit(p)}>
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}