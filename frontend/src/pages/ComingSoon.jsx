/**
 * LUXDRIVE — ComingSoon / Placeholder Page
 * Used during development as a placeholder for routes not yet built.
 * Shows the page name and LUXDRIVE branding.
 * Remove and replace with real pages as each phase is built.
 */

function ComingSoon({ page = 'Page' }) {
  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center px-4">

      {/* Brand */}
      <div className="mb-12 text-center">
        <p className="text-gold-300 text-xs font-sans font-semibold uppercase tracking-[0.3em] mb-4">
          LUXDRIVE
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-medium text-surface-100 mb-4">
          Drive The Extraordinary
        </h1>
        <div className="w-16 h-px bg-gold-300/40 mx-auto" />
      </div>

      {/* Page indicator */}
      <div className="card p-8 text-center max-w-md w-full">
        <div className="w-12 h-12 rounded-full bg-gold-300/10 border border-gold-300/20
                        flex items-center justify-center mx-auto mb-4">
          <span className="text-gold-300 text-xl">◆</span>
        </div>
        <h2 className="font-display text-xl font-medium text-surface-100 mb-2">
          {page}
        </h2>
        <p className="text-surface-400 text-sm font-sans">
          This page is being built. Phase 1 scaffold is complete.
        </p>
      </div>

      {/* Status indicator */}
      <div className="mt-8 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gold-300 animate-pulse" />
        <p className="text-surface-500 text-xs font-sans tracking-wide">
          Development in progress — Phase 1 ✓
        </p>
      </div>

    </div>
  )
}

export default ComingSoon
