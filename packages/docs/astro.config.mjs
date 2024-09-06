import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import cookieconsent from '@jop-software/astro-cookieconsent'
import {openSourceMenu, oramaCloudMenu, head, cookieConsentConfig } from './config'

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.orama.com',
  vite: {
    ssr: {
      noExternal: ['nanoid']
    }
  },
  integrations: [
    starlight({
      pagefind: false,
      plugins: [],
      title: 'Orama Docs',
      description: 'Your product answer engine.',
      favicon: '/favicon.png',
      head: head,
      social: {
        github: 'https://github.com/askorama/orama',
        slack: 'https://orama.to/slack',
        twitter: 'https://x.com/askorama',
        youtube: 'https://www.youtube.com/@askorama'
      },
      customCss: ['./src/tailwind.css', './src/styles/custom.css'],
      logo: {
        replacesTitle: true,
        dark: '/src/assets/logo-dark.svg',
        light: '/src/assets/logo-light.svg'
      },
      components: {
        Sidebar: './src/components/Sidebar.astro',
        Header: './src/components/Header.astro',
        Search: './src/components/Search.astro',
        Hero: "./src/components/Hero.astro",
        Head: './src/components/Head.astro'
      },
      sidebar: [
        ...oramaCloudMenu,
        ...openSourceMenu,
      ],
      editLink: {
        baseUrl: 'https://github.com/askorama/orama/edit/main/packages/docs'
      }
    }),
    react(),
    tailwind({
      applyBaseStyles: true
    }),
    cookieconsent(cookieConsentConfig)
  ]
})
