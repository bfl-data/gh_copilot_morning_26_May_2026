import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'node-demo',
  tagline: 'TypeScript · Express · Node.js 20 — Developer Documentation',
  favicon: 'img/favicon.ico',

  url: 'https://your-org.github.io',
  baseUrl: '/node-demo/',

  organizationName: 'your-org',
  projectName: 'node-demo',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/your-org/node-demo/tree/main/docs-site/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
          versions: {
            current: {
              label: '1.0.0 (current)',
              path: 'current',
              badge: true,
            },
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',

    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'node-demo',
      logo: {
        alt: 'node-demo Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/your-org/node-demo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Getting Started', to: '/docs/getting-started/installation' },
            { label: 'Architecture', to: '/docs/architecture/overview' },
          ],
        },
        {
          title: 'API Reference',
          items: [
            { label: 'Users API', to: '/docs/api/users' },
            { label: 'Auth API', to: '/docs/api/auth' },
          ],
        },
        {
          title: 'Developer',
          items: [
            { label: 'Coding Standards', to: '/docs/developer-workflow/coding-standards' },
            { label: 'Contributing', to: '/docs/developer-workflow/contributing' },
            { label: 'GitHub', href: 'https://github.com/your-org/node-demo' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} node-demo. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'javascript'],
    },

    algolia: {
      // Replace with your Algolia DocSearch credentials
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'node-demo',
      contextualSearch: true,
    },

    metadata: [
      { name: 'keywords', content: 'node.js, typescript, express, api, documentation' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
