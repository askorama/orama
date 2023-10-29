import Script from 'next/script'
import { useState, useEffect } from 'react'
import { useConfig } from 'nextra-theme-docs'
import '../styles.css'

const useDark = () => {
  const { resolvedTheme } = useTheme()
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(resolvedTheme === 'dark')
    return () => false
  }, [resolvedTheme])
  return isDark
}

export default function App({ Component, pageProps }) {
  const { darkMode } = useConfig()
  const googleAnalyticsID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

  console.log({ darkMode })

  return (
    <>
      <Component {...pageProps} />
      {googleAnalyticsID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsID}`} />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${googleAnalyticsID}');
              `}
          </Script>
        </>
      )}
    </>
  )
}
