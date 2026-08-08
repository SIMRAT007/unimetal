const BoltsIllustration = (props) => (
  <svg
    viewBox="0 0 560 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="about-featured-svg"
    {...props}
  >
    <defs>
      <linearGradient id="boltShaft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e9edf0" />
        <stop offset="35%" stopColor="#f8f9fa" />
        <stop offset="60%" stopColor="#b5bcc3" />
        <stop offset="100%" stopColor="#e9edf0" />
      </linearGradient>
      <linearGradient id="boltHead" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#d8dde2" />
        <stop offset="100%" stopColor="#a6afb8" />
      </linearGradient>
      <linearGradient id="boltThread" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8f97a0" />
        <stop offset="50%" stopColor="#bcc2c8" />
        <stop offset="100%" stopColor="#8f97a0" />
      </linearGradient>
      <filter id="boltShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="rgba(0,0,0,0.12)" />
      </filter>
    </defs>

    {/* Bolt 1 — rear left, nearly horizontal */}
    <g transform="translate(165, 210) rotate(6)" filter="url(#boltShadow)">
      <rect x="-105" y="-12" width="210" height="24" rx="5" fill="url(#boltShaft)" />
      <g>
        {[...Array(10)].map((_, i) => (
          <rect key={i} x={-80 + i * 16} y="-12" width="3" height="24" fill="url(#boltThread)" opacity="0.55" />
        ))}
      </g>
      <rect x="-90" y="-12" width="16" height="24" fill="#d1d7dc" />
      <ellipse cx="-105" cy="0" rx="32" ry="22" fill="url(#boltHead)" />
      <circle cx="-105" cy="0" r="7" stroke="#7e8892" strokeWidth="1.5" fill="none" />
    </g>

    {/* Bolt 2 — top right, angled down-left */}
    <g transform="translate(360, 110) rotate(-42)" filter="url(#boltShadow)">
      <rect x="-95" y="-11" width="190" height="22" rx="5" fill="url(#boltShaft)" />
      <g>
        {[...Array(9)].map((_, i) => (
          <rect key={i} x={-70 + i * 15} y="-11" width="3" height="22" fill="url(#boltThread)" opacity="0.55" />
        ))}
      </g>
      <rect x="-80" y="-11" width="14" height="22" fill="#d1d7dc" />
      <ellipse cx="-95" cy="0" rx="30" ry="20" fill="url(#boltHead)" />
      <line x1="-103" y1="-5" x2="-95" y2="5" stroke="#7e8892" strokeWidth="1.5" />
    </g>

    {/* Bolt 3 — front lower right, angled up-right */}
    <g transform="translate(390, 240) rotate(16)" filter="url(#boltShadow)">
      <rect x="-100" y="-13" width="200" height="26" rx="5" fill="url(#boltShaft)" />
      <g>
        {[...Array(10)].map((_, i) => (
          <rect key={i} x={-75 + i * 15} y="-13" width="3" height="26" fill="url(#boltThread)" opacity="0.55" />
        ))}
      </g>
      <rect x="-86" y="-13" width="16" height="26" fill="#d1d7dc" />
      <ellipse cx="-100" cy="0" rx="33" ry="23" fill="url(#boltHead)" />
      <circle cx="-100" cy="0" r="7" stroke="#7e8892" strokeWidth="1.5" fill="none" />
    </g>
  </svg>
)

export default BoltsIllustration
