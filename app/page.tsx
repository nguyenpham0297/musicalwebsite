import { getProducts } from "../lib/getProducts";
import Link from "next/link";
import Image from "next/image";

import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

export default async function Home() {
  const pickups = await getProducts();

  return (
    <main className="home">

      {/* ================= HERO ================= */}
      <section className="hero">

        {/* HEADER */}
        <header className="header">
          <div className="container header-inner">

            {/* LOGO */}
            <div className="logo">
              <Image
                src="/logo.jpg"
                alt="Pointy Head Rock logo"
                width={100}
                height={100}
                priority
              />
            </div>

            {/* NAV */}
            <nav className="nav">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>

          </div>
        </header>

        {/* HERO CONTENT */}
        <div className="hero-overlay">

          <h1>POINTY HEAD ROCK</h1>

          <p className="hero-subtitle">
            Handmade guitar pickups crafted with patience,
            precision, and obsession for tone.
          </p>

          {/* SOCIAL LINKS */}
          <div className="socials">

            <a
              href="https://instagram.com/yourshop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://youtube.com/yourshop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>

            <a
              href="https://tiktok.com/@yourshop"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>

          </div>

        </div>

      </section>

      {/* ================= CATEGORY ================= */}
      <section className="categories">
        <span>Pickups</span>
        <span>Pedals</span>
        <span>Guitars</span>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="products">

        {pickups.map((item: any) => (
          <Link
            href={`/product/${item.id}`}
            className="card"
            key={item.id}
          >

            <div className="image-container">

              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={600}
                  height={600}
                  className="main-img"
                />
              )}

              {item.hoverImageUrl && (
                <Image
                  src={item.hoverImageUrl}
                  alt={`${item.name} hover`}
                  width={600}
                  height={600}
                  className="hover-img"
                />
              )}

            </div>

            <div className="info">
              <h2>{item.name}</h2>

              {/*
                Price intentionally hidden for now.
                Uncomment below if needed later.
              */}

              {/* <p>${item.price}</p> */}
            </div>

          </Link>
        ))}

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <h2>POINTY HEAD ROCK</h2>
        <p>email@gmail.com</p>
        <p>Hanoi, Vietnam</p>
      </footer>

    </main>
  );
}