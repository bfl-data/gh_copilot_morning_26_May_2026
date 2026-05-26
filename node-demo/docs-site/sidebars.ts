import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/local-development',
        'getting-started/environment-setup',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/folder-structure',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/build-and-run',
        'guides/error-handling',
        'guides/logging',
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        'security/authentication-flow',
        'security/best-practices',
      ],
    },
    {
      type: 'category',
      label: 'Developer Workflow',
      items: [
        'developer-workflow/coding-standards',
        'developer-workflow/testing',
        'developer-workflow/contributing',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: [
        'troubleshooting/faq',
      ],
    },
  ],

  apiSidebar: [
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api/users',
        'api/auth',
      ],
    },
  ],
};

export default sidebars;
