const logoStyle = `
.orama-logo {
  --logo-color-intense: #08041a;
  --logo-color-mid: #160b47;
  --logo-color-soft: #6a4fe3;
}

[data-theme='dark'] .orama-logo {
  --logo-color-intense: white;
  --logo-color-mid: #f3f3f3;
  --logo-color-soft: #707070;
}

.orama-logo #logo-upper-def stop {
  stop-color: var(--logo-color-soft);
}

.orama-logo #logo-upper-def stop:nth-of-type(2) {
  stop-color: var(--logo-color-intense);
}

.orama-logo #logo-lower-def stop:nth-of-type(1) {
  stop-color: var(--logo-color-intense);
}

.orama-logo #logo-lower-def stop:nth-of-type(2) {
  stop-color: var(--logo-color-mid);
}

.orama-logo #logo-type-l-def stop:nth-of-type(1),
.orama-logo #logo-type-y-def stop:nth-of-type(1),
.orama-logo #logo-type-r-def stop:nth-of-type(1),
.orama-logo #logo-tyoe-a-def stop:nth-of-type(1) {
  stop-color: var(--logo-color-mid);
}

.orama-logo #logo-type-l-def stop:nth-of-type(2),
.orama-logo #logo-type-y-def stop:nth-of-type(2),
.orama-logo #logo-type-r-def stop:nth-of-type(2),
.orama-logo #logo-tyoe-a-def stop:nth-of-type(2) {
  stop-color: var(--logo-color-intense);
}
`

export function OramaLogo(): JSX.Element {
  return (
    <svg width="4em" viewBox="0 0 727 128" role="img" className="orama-logo">
      <style>{logoStyle}</style>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M127.003 60.7266H98.2154C91.5831 60.7266 84.451 57.344 87.7736 45.4956C91.8762 30.8635 111.512 20.9665 127.003 20.9665C142.494 20.9665 162.129 30.863 166.231 45.4956C169.556 57.3436 162.422 60.7266 155.79 60.7266H127.003ZM13.1662 62.0192C8.75252 61.992 0 62.9469 0 68.1101H254C254 62.9469 245.248 61.9899 240.834 62.0172H236.038C227.349 61.9529 218.88 61.4713 211.535 59.4982C193.927 54.7664 191.878 45.8584 183.013 33.1678C172.684 18.3895 155.008 0 127.002 0C98.9967 0 81.3185 18.3855 70.9862 33.1718C62.1214 45.8584 60.0722 54.7666 42.4646 59.5022C35.1218 61.4753 26.6526 61.9569 17.9611 62.0212L13.1662 62.0192Z"
        fill="url(#logo-upper-def)"
      />
      <path
        d="M188.148 75.1562H169.145C169.145 83.0066 159.1 110.148 127.002 110.148C94.9039 110.148 84.8589 83.0066 84.8589 75.1562H65.8516C65.8516 87.6646 80.4239 128 127 128C173.572 128 188.148 87.6646 188.148 75.1562Z"
        fill="url(#logo-lower-def)"
      />
      <path d="M276.522 17H295.09V93.0188H351.432V110.698H276.522V17Z" fill="url(#logo-type-l-def)" />
      <path
        d="M430.586 110.698H412.018V67.0663L369.779 17H393.875L421.373 50.5897L448.445 17H472.896L430.515 67.0663V110.698H430.586Z"
        fill="url(#logo-type-y-def)"
      />
      <path
        d="M552.792 74.1378H525.861V110.768H507.293V17H561.154C562.714 17 564.414 17.0707 566.257 17.2829C568.171 17.4243 570.084 17.8486 572.068 18.3436C574.053 18.9093 576.108 19.6872 578.092 20.7479C580.077 21.8086 581.99 23.2229 583.762 24.9908C586.951 28.173 589.006 31.7087 589.999 35.5981C590.92 39.4874 591.416 43.0232 591.416 46.2054C591.416 48.8925 591.062 51.7211 590.424 54.6912C589.786 57.6612 588.298 60.4898 586.101 63.3184C582.912 67.4199 578.518 70.5314 572.99 72.5114L595.314 110.698H574.407L552.792 74.1378ZM564.84 55.6105C566.47 55.3276 567.958 54.479 569.234 53.2062C570.297 52.1454 571.076 50.8726 571.502 49.3875C571.998 47.9025 572.21 46.4175 572.21 44.8618C572.21 42.5989 571.785 40.7603 570.935 39.4167C570.084 38.0731 569.234 37.0831 568.241 36.4467C566.966 35.5274 565.407 34.9616 563.635 34.8202C561.863 34.6788 560.091 34.6081 558.32 34.6081H525.719V55.964H559.737C561.509 56.0348 563.21 55.8933 564.84 55.6105Z"
        fill="url(#logo-type-r-def)"
      />
      <path
        d="M694.895 87.3616H652.231L641.034 110.698H620.481L666.547 17H680.579L727 110.698H706.447L694.895 87.3616ZM661.09 69.6828H686.037L673.492 44.5789L661.09 69.6828Z"
        fill="url(#logo-tyoe-a-def)"
      />
      <defs>
        <linearGradient
          id="logo-upper-def"
          x1="254"
          y1="67.5527"
          x2="-1.30113e-06"
          y2="67.5527"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="0.5" />
          <stop offset="0.994792" />
        </linearGradient>
        <linearGradient id="logo-lower-def" x1="127" y1="75.1562" x2="127" y2="128" gradientUnits="userSpaceOnUse">
          <stop stopOpacity="0" />
          <stop offset="0.583333" />
        </linearGradient>
        <linearGradient
          id="logo-type-l-def"
          x1="313.977"
          y1="17"
          x2="313.977"
          y2="110.698"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" />
        </linearGradient>
        <linearGradient
          id="logo-type-y-def"
          x1="421.337"
          y1="17"
          x2="421.337"
          y2="110.698"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" />
        </linearGradient>
        <linearGradient
          id="logo-type-r-def"
          x1="551.303"
          y1="17"
          x2="551.303"
          y2="110.768"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" />
        </linearGradient>
        <linearGradient
          id="logo-tyoe-a-def"
          x1="673.741"
          y1="17"
          x2="673.741"
          y2="110.698"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" />
        </linearGradient>
      </defs>
    </svg>
  )
}
