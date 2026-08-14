

/**
 * LUXDRIVE — Hero Section
 *
 * Full-viewport hero:
 *   - Luxury car background with directional dark overlay
 *   - Vehicle tags, headline, subtitle, price badge (left column)
 *   - Vehicle preview cards — desktop only (bottom-right)
 *   - Glass-morphism search bar — bottom, full-width
 *
 * Animations reference @keyframes lux-up in src/index.css
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VEHICLE_TAGS = ['BMW M4', 'Porsche 911', 'Mercedes G63'];

const PREVIEW_CARDS = [
    {
    id:        'bmw-m4',
    name:      'BMW M4 Competition',
    category:  'Sports Car',
    price:     'KSh 25,000/day',
    showPrice: true,
    featured:  true,
    src:       'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=400&q=80',
    alt:       'BMW M4 Competition available for rental',
    },
    {
    id:       'porsche-911',
    name:     'Porsche 911',
    category: 'Coupe',
    featured: false,
    src:      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
    alt:      'Porsche 911 available for rental',
    },
    {
    id:       'mercedes-g63',
    name:     'Mercedes G63 AMG',
    category: 'Luxury SUV',
    featured: false,
    src:      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80',
    alt:      'Mercedes G63 AMG available for rental',
    },
];

const VEHICLE_TYPES = [
    { value: '',            label: 'All Types'   },
    { value: 'sedan',       label: 'Sedan'       },
    { value: 'suv',         label: 'SUV'         },
    { value: 'coupe',       label: 'Coupe'       },
    { value: 'sports',      label: 'Sports Car'  },
    { value: 'convertible', label: 'Convertible' },
    { value: 'electric',    label: 'Electric'    },
];

const toDateStr = (d) => d.toISOString().split('T')[0];

const INPUT_STYLE = {
    background:   'transparent',
    border:       'none',
    borderBottom: '1px solid transparent',
    outline:      'none',
    color:        '#F5F5F0',
    fontFamily:   "'Manrope', sans-serif",
    fontSize:     '13px',
    fontWeight:   600,
    width:        '100%',
    padding:      0,
    transition:   'border-bottom-color 0.2s',
};

export default function Hero() {
    const navigate = useNavigate();
    const [location,    setLocation]    = useState('');
    const [pickupDate,  setPickupDate]  = useState('');
    const [returnDate,  setReturnDate]  = useState('');
    const [vehicleType, setVehicleType] = useState('');

    useEffect(() => {
    const today    = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setPickupDate(toDateStr(today));
    setReturnDate(toDateStr(tomorrow));
    }, []);

    const handlePickupChange = (val) => {
    setPickupDate(val);
    const next = new Date(val);
    next.setDate(next.getDate() + 1);
    if (!returnDate || new Date(returnDate) <= new Date(val)) {
        setReturnDate(toDateStr(next));
    }
    };

    const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location)    params.set('location', location);
    if (pickupDate)  params.set('pickup',   pickupDate);
    if (returnDate)  params.set('return',   returnDate);
    if (vehicleType) params.set('type',     vehicleType);
    navigate(`/cars?${params.toString()}`);
    };

    return (
    <section
        id="home"
        aria-label="Hero"
        style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '720px', overflow: 'hidden' }}
    >
      {/* Background image */}
        <div
        role="img"
        aria-label="Luxury BMW sports car in dramatic lighting"
        style={{
            position:           'absolute',
            inset:              0,
            backgroundImage:    "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize:     'cover',
            backgroundPosition: 'center 38%',
        }}
        />

      {/* Directional dark overlay */}
        <div
        aria-hidden="true"
        style={{
            position:   'absolute',
            inset:      0,
            background: 'linear-gradient(105deg, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.80) 36%, rgba(0,0,0,0.42) 62%, rgba(0,0,0,0.14) 100%)',
        }}
        />

      {/* Bottom vignette */}
        <div
        aria-hidden="true"
        style={{
            position:      'absolute',
            bottom: 0, left: 0, right: 0,
            height:        '350px',
            background:    'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
            pointerEvents: 'none',
        }}
        />

      {/* Left content column */}
        <div
        style={{
            position:       'relative',
            zIndex:         5,
            height:         '100%',
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'center',
            padding:        'clamp(100px, 14vh, 130px) 5% clamp(200px, 26vh, 250px)',
            maxWidth:       '700px',
        }}
        >
        {/* Vehicle tag pills */}
        <div
            aria-label="Featured vehicles"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px', animation: 'lux-up 0.7s ease 0.05s both' }}
        >
            {VEHICLE_TAGS.map((tag) => <VehicleTag key={tag} label={tag} />)}
        </div>

        {/* Headline */}
        <h1
            style={{
            fontFamily:    "'Bebas Neue', sans-serif",
            fontSize:      'clamp(56px, 8vw, 94px)',
            lineHeight:    0.98,
            letterSpacing: '2px',
            color:         '#F5F5F0',
            marginBottom:  '22px',
            animation:     'lux-up 0.8s ease 0.15s both',
            }}
        >
            DRIVE THE<br />EXTRAORDINARY
        </h1>

        {/* Sub-headline */}
        <p
            style={{
            fontFamily:   "'Manrope', sans-serif",
            fontSize:     '15px',
            fontWeight:   400,
            lineHeight:   1.75,
            color:        'rgba(245,245,240,0.60)',
            maxWidth:     '400px',
            marginBottom: '28px',
            animation:    'lux-up 0.8s ease 0.30s both',
            }}
        >
            Experience exceptional vehicles, premium service, and effortless luxury
            car rental. Pick, pay, and drive in minutes.
        </p>

        {/* Price badge */}
        <div
            aria-label="Starting from KSh 25,000 per day"
            style={{
            display:      'inline-flex',
            alignItems:   'baseline',
            gap:          '6px',
            background:   '#C9A84C',
            color:        '#0A0A0A',
            borderRadius: '100px',
            padding:      '10px 22px',
            width:        'fit-content',
            animation:    'lux-up 0.8s ease 0.42s both',
            }}
        >
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '12px', fontWeight: 600, opacity: 0.75 }}>From</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '17px', fontWeight: 800, letterSpacing: '-0.3px' }}>KSh 25,000</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: '12px', fontWeight: 600, opacity: 0.75 }}>/ day</span>
        </div>
        </div>

      {/* Vehicle preview cards — desktop only */}
        <div
        aria-label="Featured vehicles preview"
        className="hidden lg:flex items-end gap-3"
        style={{ position: 'absolute', bottom: '112px', right: '5%', zIndex: 6 }}
        >
        {PREVIEW_CARDS.map((card) => <PreviewCard key={card.id} card={card} />)}
        </div>

      {/* Search bar */}
        <div
        role="search"
        aria-label="Search vehicles"
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 5%', zIndex: 7 }}
        >
        <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row items-stretch md:items-center"
            style={{
            background:           'rgba(10,10,10,0.92)',
            backdropFilter:       'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            border:               '1px solid rgba(255,255,255,0.08)',
            borderBottom:         'none',
            borderRadius:         '16px 16px 0 0',
            padding:              '18px 22px',
            }}
        >
            <SearchField id="sf-location" label="Location" iconClass="fa-solid fa-location-dot" isLast={false}>
            <input
                id="sf-location"
                type="text"
                placeholder="Pickup Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={INPUT_STYLE}
            />
            </SearchField>

            <SearchField id="sf-pickup" label="Pickup Date" iconClass="fa-regular fa-calendar" isLast={false}>
            <input
                id="sf-pickup"
                type="date"
                value={pickupDate}
                min={toDateStr(new Date())}
                onChange={(e) => handlePickupChange(e.target.value)}
                style={{ ...INPUT_STYLE, colorScheme: 'dark' }}
            />
            </SearchField>

            <SearchField id="sf-return" label="Return Date" iconClass="fa-regular fa-calendar-check" isLast={false}>
            <input
                id="sf-return"
                type="date"
                value={returnDate}
                min={pickupDate || toDateStr(new Date())}
                onChange={(e) => setReturnDate(e.target.value)}
                style={{ ...INPUT_STYLE, colorScheme: 'dark' }}
            />
            </SearchField>

            <SearchField id="sf-type" label="Vehicle Type" iconClass="fa-solid fa-car" isLast={true}>
            <select
                id="sf-type"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={{ ...INPUT_STYLE, cursor: 'pointer', WebkitAppearance: 'none', appearance: 'none' }}
            >
                {VEHICLE_TYPES.map(({ value, label }) => (
                <option key={value} value={value} style={{ background: '#141414', color: '#F5F5F0' }}>
                    {label}
                </option>
                ))}
            </select>
            </SearchField>

            <SearchButton />
        </form>
        </div>
    </section>
        );
}

function VehicleTag({ label }) {
    const [hov, setHov] = useState(false);
    return (
    <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '7px',
        padding:      '6px 16px',
        background:   hov ? 'rgba(201,168,76,0.12)' : 'rgba(245,245,240,0.06)',
        border:       '1px solid rgba(255,255,255,0.08)',
        borderLeft:   '3px solid #C9A84C',
        borderRadius: '6px',
        fontSize:     '12px',
        fontWeight:   700,
        fontFamily:   "'Manrope', sans-serif",
        color:        '#F5F5F0',
        cursor:       'pointer',
        transition:   'background 0.2s',
        }}
    >
        <span aria-hidden="true" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A84C', flexShrink: 0 }} />
        {label}
    </div>
    );
}

function PreviewCard({ card }) {
    const [hov, setHov] = useState(false);
    return (
    <article
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label={card.name}
        style={{
        background:           'rgba(18,18,18,0.94)',
        backdropFilter:       'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border:               '1px solid rgba(255,255,255,0.08)',
        borderRadius:         '14px',
        overflow:             'hidden',
        cursor:               'pointer',
        width:                card.featured ? '220px' : '166px',
        flexShrink:           0,
        transform:            hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:            hov ? '0 14px 44px rgba(201,168,76,0.22)' : 'none',
        transition:           'transform 0.3s ease, box-shadow 0.3s ease',
        }}
    >
        <div style={{ position: 'relative', height: card.featured ? '150px' : '110px', overflow: 'hidden' }}>
        <img
            src={card.src}
            alt={card.alt}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s ease' }}
        />
        {card.showPrice && (
            <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: '#C9A84C', color: '#0A0A0A', fontFamily: "'Manrope', sans-serif", fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '100px' }}>
            {card.price}
            </span>
        )}
        </div>
        <div style={{ padding: '12px 14px 13px' }}>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '13px', fontWeight: 700, color: '#F5F5F0', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {card.name}
        </div>
        <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: '10px', fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            {card.category}
        </div>
        </div>
    </article>
    );
}

function SearchField({ id, label, iconClass, isLast, children }) {
    return (
    <div
        className={[
        'flex items-center gap-2.5 min-w-0 flex-1 py-3 md:py-1 px-0 md:px-5',
        isLast ? '' : 'border-b md:border-b-0 md:border-r border-white/[0.08]',
        ].join(' ')}
    >
        <i className={iconClass} aria-hidden="true" style={{ color: '#C9A84C', fontSize: '14px', width: '16px', textAlign: 'center', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, width: '100%' }}>
        <label htmlFor={id} style={{ fontFamily: "'Manrope', sans-serif", fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#C9A84C' }}>
            {label}
        </label>
        {children}
        </div>
    </div>
    );
}

function SearchButton() {
    const [hov, setHov] = useState(false);
    return (
    <button
        type="submit"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="mt-3.5 md:mt-0 md:ml-[18px]"
        style={{
        flexShrink:   0,
        display:      'flex',
        alignItems:   'center',
        gap:          '8px',
        padding:      '13px 26px',
        background:   '#C9A84C',
        border:       'none',
        borderRadius: '10px',
        color:        '#0A0A0A',
        fontFamily:   "'Manrope', sans-serif",
        fontSize:     '13px',
        fontWeight:   700,
        whiteSpace:   'nowrap',
        cursor:       'pointer',
        transform:    hov ? 'scale(1.02)' : 'scale(1)',
        boxShadow:    hov ? '0 6px 24px rgba(201,168,76,0.32)' : 'none',
        transition:   'transform 0.2s, box-shadow 0.2s',
        }}
    >
        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
        Search Vehicles
    </button>
    );
}

