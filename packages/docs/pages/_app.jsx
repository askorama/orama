import Script from 'next/script'

export default function App({ Component, pageProps }) {
  const googleAnalyticsID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

  return (
    <>
      <Component {...pageProps} />
      {
        googleAnalyticsID && (
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
        )
      }
    </>
  )
}