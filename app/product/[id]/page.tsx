import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import Image from "next/image";

type Props = {
    params: Promise<{ id: string }>; // 👈 QUAN TRỌNG
};

export default async function ProductPage({ params }: Props) {
    const { id } = await params; // ✅ FIX

    if (!id) {
        return <div>Invalid product ID</div>;
    }

    const docRef = doc(db, "pickups", id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
        return <div>Product not found</div>;
    }

    const product: any = {
        id: snap.id,
        ...snap.data(),
    };

    return (
        <main className="product-page">
            <div className="product-container">

                <div className="product-image">
                    {product.imageUrl && (
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={600}
                            height={400}
                        />
                    )}
                </div>

                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="price">${product.price}</p>

                    <button className="buy-btn">Add to cart</button>
                </div>

            </div>
        </main>
    );
}