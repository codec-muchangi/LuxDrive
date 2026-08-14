

/**
 *  LUXDRIVE — Navbar
 *
 * Fixed navigation bar used across all pages.
 * - Transparent on load; darkens + blurs on scroll past 80 px.
 * - Active link detected via React Router useLocation.
 * - Mobile hamburger menu (full-screen overlay).
 *
 * Usage:
 *   import Navbar from '@/components/layout/Navbar';
 *   // Place above the first <section> in any page component.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// ─── Navigation links data ───────────────────────────────────────────────────

const NAV_LINKS = [
    { label: 'Home',     to: '/'         },
    { label: 'Cars',     to: '/cars'     },
    { label: 'Services', to: '/services' },
    { label: 'About',    to: '/about'    },
    { label: 'Contact',  to: '/contact'  },
];

// ─── Design tokens ───────────────────────────────────────────────────────────

const C = {
    gold:    '#C9A84C',
    black:   '#0A0A0A',
    white:   '#F5F5F0',
    divider: 'rgba(255,255,255,0.08)',
};

// ─── Main component ──────────────────────────────────────────────────────────

export default function Navbar() {
    const [scrolled,   setScrolled]   = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

  // Scroll: darken nav past 80 px
    useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    }, []);

  // Lock body scroll when mobile menu is open
    useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

  // Close mobile menu on Escape
    useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    }, []);

    const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

    const openMobile  = () => setMobileOpen(true);
    const closeMobile = () => setMobileOpen(false);

    return (
    <>
      {/* ── Desktop / scroll-aware navbar ──────────────────────────────── */}
        <nav
        aria-label="Main navigation"
        style={{
            position:             'fixed',
            top: 0, left: 0, right: 0,
            zIndex:               500,
            display:              'flex',
            alignItems:           'center',
            justifyContent:       'space-between',
            padding:              scrolled ? '16px 5%' : '22px 5%',
            background:           scrolled ? 'rgba(10,10,10,0.96)' : 'transparent',
            backdropFilter:       scrolled ? 'blur(14px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
            borderBottom:         scrolled ? `1px solid ${C.divider}` : 'none',
            transition:           'background 0.35s ease, padding 0.35s ease',
        }}
        >
        {/* Logo */}
        <Link
            to="/"
            aria-label="LUXDRIVE home"
            style={{
            fontFamily:     "'Manrope', sans-serif",
            fontWeight:     800,
            fontSize:       '20px',
            letterSpacing:  '3px',
            color:          C.gold,
            textDecoration: 'none',
            flexShrink:     0,
            }}
        >
            LUXDRIVE
        </Link>

        {/* Center nav links — hidden on mobile */}
        <ul
            className="hidden md:flex items-center gap-7 m-0 list-none"
            style={{
            background:   'rgba(245,245,240,0.06)',
            border:       `1px solid ${C.divider}`,
            borderRadius: '100px',
            padding:      '10px 28px',
            }}
        >
            {NAV_LINKS.map(({ label, to }) => (
            <li key={label}>
                <NavLink to={to} active={isActive(to)}>
                {label}
                </NavLink>
            </li>
            ))}
        </ul>

        {/* Right action buttons */}
        <div className="flex items-center gap-2.5" style={{ flexShrink: 0 }}>
            <GhostButton
            className="hidden md:block"
            onClick={() => navigate('/login')}
            >
            Login
            </GhostButton>

            <GoldButton onClick={() => navigate('/cars')}>
            Book Now
            </GoldButton>

          {/* Hamburger — visible on mobile only */}
            <button
            className="flex md:hidden flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer"
            onClick={openMobile}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            >
            <span style={{ display: 'block', width: '22px', height: '2px', background: C.white, borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: C.white, borderRadius: '2px' }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: C.white, borderRadius: '2px' }} />
            </button>
        </div>
        </nav>

      {/* ── Mobile full-screen overlay menu ────────────────────────────── */}
        {mobileOpen && (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            style={{
            position:       'fixed',
            inset:          0,
            zIndex:         600,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            '36px',
            background:     'rgba(10,10,10,0.98)',
            }}
        >
          {/* Close button */}
            <button
            onClick={closeMobile}
            aria-label="Close navigation menu"
            style={{
                position:       'absolute',
                top:            '24px',
                right:          '5%',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                width:          '40px',
                height:         '40px',
                borderRadius:   '50%',
                background:     'transparent',
                border:         `1px solid ${C.divider}`,
                color:          C.white,
                fontSize:       '16px',
                cursor:         'pointer',
            }}
            >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>

          {/* Nav links */}
            {NAV_LINKS.map(({ label, to }) => (
            <Link
                key={label}
                to={to}
                onClick={closeMobile}
                style={{
                fontSize:       '26px',
                fontWeight:     700,
                color:          C.white,
                textDecoration: 'none',
                fontFamily:     "'Manrope', sans-serif",
                transition:     'color 0.2s',
                }}
            >
                {label}
            </Link>
            ))}

          {/* Mobile Book Now */}
            <button
            onClick={() => { closeMobile(); navigate('/cars'); }}
            style={{
                padding:      '14px 40px',
                background:   C.gold,
                color:        C.black,
                borderRadius: '100px',
                fontFamily:   "'Manrope', sans-serif",
                fontSize:     '15px',
                fontWeight:   700,
                border:       'none',
                cursor:       'pointer',
            }}
            >
            Book Now
            </button>
        </div>
        )}
    </>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function NavLink({ to, active, children }) {
    const [hov, setHov] = useState(false);
    return (
    <Link
        to={to}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
        fontSize:       '13px',
        fontWeight:     600,
        color:          active || hov ? '#F5F5F0' : 'rgba(245,245,240,0.80)',
        textDecoration: 'none',
        position:       'relative',
        paddingBottom:  '2px',
        transition:     'color 0.2s',
        }}
    >
        {children}
        {active && (
        <span
            aria-hidden="true"
            style={{
            position:     'absolute',
            bottom:       '-4px',
            left:         0,
            right:        0,
            height:       '2px',
            background:   '#C9A84C',
            borderRadius: '2px',
            }}
        />
        )}
    </Link>
    );
}

function GhostButton({ children, onClick, className = '' }) {
    const [hov, setHov] = useState(false);
    return (
    <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className={className}
        style={{
        padding:      '9px 20px',
        border:       `1px solid ${hov ? '#C9A84C' : 'rgba(245,245,240,0.28)'}`,
        borderRadius: '8px',
        background:   'transparent',
        color:        hov ? '#C9A84C' : '#F5F5F0',
        fontFamily:   "'Manrope', sans-serif",
        fontSize:     '13px',
        fontWeight:   600,
        cursor:       'pointer',
        transition:   'border-color 0.2s, color 0.2s',
        }}
    >
        {children}
    </button>
    );
}

function GoldButton({ children, onClick }) {
    const [hov, setHov] = useState(false);
    return (
    <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
        padding:      '9px 20px',
        border:       'none',
        borderRadius: '8px',
        background:   '#C9A84C',
        color:        '#0A0A0A',
        fontFamily:   "'Manrope', sans-serif",
        fontSize:     '13px',
        fontWeight:   700,
        cursor:       'pointer',
        transform:    hov ? 'scale(1.03)' : 'scale(1)',
        boxShadow:    hov ? '0 4px 20px rgba(201,168,76,0.32)' : 'none',
        transition:   'transform 0.2s, box-shadow 0.2s',
        }}
    >
        {children}
    </button>
    );
}
