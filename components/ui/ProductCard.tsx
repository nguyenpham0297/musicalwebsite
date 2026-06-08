import Link from "next/link";
import Image from "next/image";

type Props = {
    id: string;
    name: string;
    price: number;
    image: string;
    hoverImage?: string;
};

export default function ProductCard({
    id,
    name,
    price,
    image,
    hoverImage,
}: Props) {
    return (
        <Link href={`/product/${id}`}>
            <div className="card">
                <div className="image-container">
                    <Image
                        src={image}
                        alt={name}
                        width={600}
                        height={400}
                        className="main-img"
                    />

                    {hoverImage && (
                        <Image
                            src={hoverImage}
                            alt={name}
                            width={600}
                            height={400}
                            className="hover-img"
                        />
                    )}
                </div>

                <div className="info">
                    <h2>{name}</h2>
                    <p>${price}</p>
                </div>
            </div>
        </Link>
    );
}