import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Protosen DPCT',
  description: 'Documentation complète du projet Protosen DPCT - Gestion des cartes diplomatiques',
  base: '/',
  ignoreDeadLinks: [
    /^\.\/index$/,
  ],

  themeConfig: {
    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API REST', link: '/api/rest' },
      { text: 'gRPC', link: '/api/grpc' },
      { text: 'Architecture', link: '/architecture/overview' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Vue d\'ensemble', link: '/guide/overview' },
          { text: 'Installation', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/guide/configuration' },
        ]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Vue d\'ensemble', link: '/architecture/overview' },
        ]
      },
      {
        text: 'API',
        items: [
          { text: 'API REST', link: '/api/rest' },
          { text: 'API gRPC', link: '/api/grpc' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/protosen/protosen-dpct-api' }
    ],

    footer: {
      message: 'Documentation Protosen DPCT',
      copyright: 'Copyright © 2024-present Protosen'
    },

    search: {
      provider: 'local'
    }
  }
})
