
/**
 * LUXDRIVE — About Section
 *
 * Scrolls immediately below the Hero section.
 * Zones: Stats (ghost numbers) → Content (headline + CTA) → Flanking cars
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const STATS = [
    { ghost: '500', value: '500+',   label: 'Vehicles'      },
    { ghost: '2K',  value: '2,000+', label: 'Happy Clients' },
    { ghost: '8',   value: '8+',     label: 'Years'         },
    { ghost: '12',  value: '12+',    label: 'Locations'     },
];

const IMG_LEFT  = 'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=900&q=80';
const IMG_RIGHT = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80';

export default function About() {
    const sectionRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setInView(true); },
        { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    }, []);

    return (
    <section
        ref={sectionRef}
        id="about"
        aria-labelledby="about-heading"
        style={{ position: 'relative', background: '#ffffff', overflow: 'hidden' }}
    >
      {/* Diamond tire-tread CSS texture */}
        <div
        aria-hidden="true"
        style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: [
            'repeating-linear-gradient(-45deg, rgba(0,0,0,0.022) 0, rgba(0,0,0,0.022) 1px, transparent 0, transparent 50%)',
            'repeating-linear-gradient( 45deg, rgba(0,0,0,0.022) 0, rgba(0,0,0,0.022) 1px, transparent 0, transparent 50%)',
            ].join(', '),
            backgroundSize: '22px 22px',
            pointerEvents: 'none',
        }}
        />

      {/* ── STATS ZONE ──────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', zIndex: 1, paddingTop: 'clamp(56px, 7vw, 80px)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 5%' }}>
            <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, i) => (
                <StatColumn key={stat.label} stat={stat} index={i} inView={inView} />
            ))}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.07)', margin: 0 }} />
        </div>
        </div>

      {/* ── CONTENT ZONE ────────────────────────────────────────────────── */}
        <div
        style={{
            position:   'relative',
            zIndex:     1,
            textAlign:  'center',
            maxWidth:   '660px',
            margin:     '0 auto',
            padding:    'clamp(44px, 6vw, 64px) 5% clamp(52px, 7vw, 72px)',
            opacity:    inView ? 1 : 0,
            transform:  inView ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s',
        }}
        >
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '3px', color: '#C9A84C', marginBottom: '20px' }}>
            About LUXDRIVE
        </p>
        <h2
            id="about-heading"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(38px, 4.5vw, 64px)', lineHeight: 1.04, letterSpacing: '2px', color: '#0A0A0A', marginBottom: '20px' }}
        >
            Nairobi's Premier<br />Luxury Car Rental Experience
        </h2>
        <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: '15px', fontWeight: 400, lineHeight: 1.82, color: 'rgba(10,10,10,0.52)', maxWidth: '490px', margin: '0 auto 36px' }}>
            We make luxury car rental simple and effortless — a curated fleet of premium
            vehicles, transparent KES pricing, and seamless booking from search to drive.
        </p>
        <AboutCTA />
        </div>

      {/* ── CAR ZONE — hidden on mobile ─────────────────────────────────── */}
        <div
        className="hidden md:flex"
        style={{
            position: 'relative', zIndex: 1,
            justifyContent: 'space-between', alignItems: 'flex-end',
            overflow: 'hidden', minHeight: '250px',
            opacity: inView ? 1 : 0,
            transition: 'opacity 1.1s ease 0.52s',
        }}
        aria-hidden="true"
        >
        <CarImage src={IMG_LEFT}  side="left"  />
        <CarImage src={IMG_RIGHT} side="right" />
        </div>
    </section>
    );
}

function StatColumn({ stat, index, inView }) {
    return (
    <div
        className="flex flex-col items-center text-center px-4 pb-10"
        style={{
        borderLeft: index > 0 ? '1px solid rgba(0,0,0,0.07)' : 'none',
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.75s ease ${index * 0.09}s, transform 0.75s ease ${index * 0.09}s`,
        }}
    >
        <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2.5px', color: 'rgba(10,10,10,0.40)', marginBottom: '4px' }}>
        {stat.label}
        </span>
        <span
        aria-hidden="true"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(78px, 9vw, 150px)', lineHeight: 1, letterSpacing: '-2px', color: '#0A0A0A', opacity: 0.065, userSelect: 'none' }}
        >
        {stat.ghost}
        </span>
        <span
        aria-label={`${stat.value} ${stat.label}`}
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '1px', color: '#C9A84C', marginTop: '-10px' }}
        >
        {stat.value}
        </span>
    </div>
    );
}

function CarImage({ src, side }) {
    return (
    <div style={{ position: 'relative', width: '37%', maxWidth: '530px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to bottom, #ffffff 0%, transparent 100%)', zIndex: 3, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: side === 'left' ? 'linear-gradient(to right, transparent 55%, #ffffff 100%)' : 'linear-gradient(to left, transparent 55%, #ffffff 100%)', zIndex: 2, pointerEvents: 'none' }} />
        <img
        src={src}
        alt=""
        loading="lazy"
        style={{ width: '100%', height: '266px', objectFit: 'cover', objectPosition: 'center 65%', display: 'block', filter: 'grayscale(10%) brightness(1.08)', transform: side === 'right' ? 'scaleX(-1)' : 'none' }}
        />
    </div>
    );
}

function AboutCTA() {
    const [hov, setHov] = useState(false);
    return (
    <Link
        to="/about"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
        display:        'inline-flex',
        alignItems:     'center',
        padding:        '14px 38px',
        background:     '#C9A84C',
        color:          '#0A0A0A',
        borderRadius:   '100px',
        fontFamily:     "'Manrope', sans-serif",
        fontSize:       '13px',
        fontWeight:     700,
        letterSpacing:  '0.6px',
        textDecoration: 'none',
        boxShadow:      hov ? '0 10px 36px rgba(201,168,76,0.44)' : '0 6px 24px rgba(201,168,76,0.26)',
        transform:      hov ? 'scale(1.04)' : 'scale(1)',
        transition:     'transform 0.2s ease, box-shadow 0.2s ease',
        }}
    >
        Discover LUXDRIVE
        </Link>
    );
}

