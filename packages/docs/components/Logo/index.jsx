export function OramaLogo({ isDark }) {
  const logoColor = isDark ? 'dark' : 'light'

  return (
    <>
      <img
        src={`/logo/logo-orama-${logoColor}.svg`}
        alt="Orama: search, everywhere."
        style={{
          width: 140,
        }}
      />
    </>
  )
}
