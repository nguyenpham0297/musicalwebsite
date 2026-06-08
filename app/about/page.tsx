// app/about/page.tsx

import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="about-page">

            {/* ================= HEADER ================= */}
            <header className="about-header">

                <Link href="/" className="about-logo">
                    PULSE PICKUPS
                </Link>

                <nav className="about-nav">
                    <Link href="/">Shop</Link>
                    <Link href="/about" className="active">About</Link>
                    <Link href="/contact">Contact</Link>
                </nav>

            </header>

            {/* ================= CONTENT ================= */}
            <section className="about-content">

                {/* LEFT */}
                <div className="about-text">

                    <h1>
                        THE STORY <br />
                        BEHIND <br />
                        THE SOUND
                    </h1>

                    <p>
                        At Pointy Head Rock, every pickup is built by hand
                        with patience, precision, and attention to the
                        smallest details.
                    </p>

                    <p>
                        We believe great tone doesn’t come from mass
                        production. It comes from careful winding,
                        thoughtful craftsmanship, and countless hours
                        spent chasing the right sound.
                    </p>

                    <p>
                        Each pickup is made slowly and intentionally —
                        for players who care about character, dynamics,
                        and feel as much as sound.
                    </p>

                    <div className="signature">
                        <span>Built by hand.</span>
                        <span>Made to be felt.</span>
                    </div>

                </div>

                {/* RIGHT */}
                <div className="about-image">

                    <Image
                        src="/about.jpg"
                        alt="studio"
                        fill
                        className="studio-img"
                        priority
                    />

                </div>

            </section>

        </main>
    );
}