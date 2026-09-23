import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// VerifyEmail Page
// Shown after a customer or owner registers.
// Tells the user to check their inbox and provides a resend option.
// Route: /verify-email
// ─────────────────────────────────────────────────────────────────────────────

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [resent, setResent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
    setLoading(true);
    // TODO: wire up to POST /api/v1/auth/resend-verification
    await new Promise((r) => setTimeout(r, 1200));
    setResent(true);
    setLoading(false);
    };

    return (
    <div style={styles.page}>
      {/* Card */}
        <div style={styles.card}>

        {/* Icon */}
        <div style={styles.iconWrap}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
        </div>

        {/* Heading */}
        <h1 style={styles.heading}>Check your inbox</h1>
        <p style={styles.subtext}>
            We sent a verification link to your email address. Click the link
            in the email to activate your account.
        </p>

        {/* Tip box */}
        <div style={styles.tip}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
            Cannot find the email? Check your <strong>Spam</strong> or{" "}
            <strong>Junk</strong> folder before resending.
            </span>
        </div>

        {/* Resend button */}
        {!resent ? (
            <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            onClick={handleResend}
            disabled={loading}
            >
            {loading ? "Sending..." : "Resend verification email"}
            </button>
        ) : (
            <div style={styles.successMsg}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
            Email resent successfully
            </div>
        )}

        {/* Back to login */}
        <button style={styles.ghost} onClick={() => navigate("/login")}>
            Back to login
        </button>
        </div>
    </div>
    );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
    page: {
    minHeight: "100vh",
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    card: {
    background: "#fff",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    padding: "48px 44px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    },
    iconWrap: {
    width: "64px",
    height: "64px",
    background: "#EFF6FF",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    border: "1px solid #bfdbfe",
    },
    heading: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "10px",
    },
    subtext: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.75,
    marginBottom: "20px",
    },
    tip: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "12px 14px",
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    fontSize: "13px",
    color: "#1e40af",
    textAlign: "left",
    marginBottom: "24px",
    lineHeight: 1.6,
    },
    btn: {
    width: "100%",
    padding: "13px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "12px",
    transition: "background 0.15s",
    },
    ghost: {
    width: "100%",
    padding: "11px",
    background: "transparent",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    },
    successMsg: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    background: "#dcfce7",
    border: "1px solid #86efac",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "13.5px",
    color: "#15803d",
    fontWeight: 500,
    marginBottom: "12px",
    },
};

export default VerifyEmail;
