import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/node-demo/__docusaurus/debug',
    component: ComponentCreator('/node-demo/__docusaurus/debug', '48f'),
    exact: true
  },
  {
    path: '/node-demo/__docusaurus/debug/config',
    component: ComponentCreator('/node-demo/__docusaurus/debug/config', '8ee'),
    exact: true
  },
  {
    path: '/node-demo/__docusaurus/debug/content',
    component: ComponentCreator('/node-demo/__docusaurus/debug/content', '8eb'),
    exact: true
  },
  {
    path: '/node-demo/__docusaurus/debug/globalData',
    component: ComponentCreator('/node-demo/__docusaurus/debug/globalData', '288'),
    exact: true
  },
  {
    path: '/node-demo/__docusaurus/debug/metadata',
    component: ComponentCreator('/node-demo/__docusaurus/debug/metadata', '808'),
    exact: true
  },
  {
    path: '/node-demo/__docusaurus/debug/registry',
    component: ComponentCreator('/node-demo/__docusaurus/debug/registry', 'a1a'),
    exact: true
  },
  {
    path: '/node-demo/__docusaurus/debug/routes',
    component: ComponentCreator('/node-demo/__docusaurus/debug/routes', '91f'),
    exact: true
  },
  {
    path: '/node-demo/search',
    component: ComponentCreator('/node-demo/search', 'd11'),
    exact: true
  },
  {
    path: '/node-demo/docs',
    component: ComponentCreator('/node-demo/docs', '05d'),
    routes: [
      {
        path: '/node-demo/docs/current',
        component: ComponentCreator('/node-demo/docs/current', '282'),
        routes: [
          {
            path: '/node-demo/docs/current',
            component: ComponentCreator('/node-demo/docs/current', 'aad'),
            routes: [
              {
                path: '/node-demo/docs/current/api/auth',
                component: ComponentCreator('/node-demo/docs/current/api/auth', '75b'),
                exact: true,
                sidebar: "apiSidebar"
              },
              {
                path: '/node-demo/docs/current/api/users',
                component: ComponentCreator('/node-demo/docs/current/api/users', '6bb'),
                exact: true,
                sidebar: "apiSidebar"
              },
              {
                path: '/node-demo/docs/current/architecture/folder-structure',
                component: ComponentCreator('/node-demo/docs/current/architecture/folder-structure', '5d8'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/architecture/overview',
                component: ComponentCreator('/node-demo/docs/current/architecture/overview', 'b0d'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/developer-workflow/coding-standards',
                component: ComponentCreator('/node-demo/docs/current/developer-workflow/coding-standards', 'cde'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/developer-workflow/contributing',
                component: ComponentCreator('/node-demo/docs/current/developer-workflow/contributing', '620'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/developer-workflow/testing',
                component: ComponentCreator('/node-demo/docs/current/developer-workflow/testing', 'ec7'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/getting-started/environment-setup',
                component: ComponentCreator('/node-demo/docs/current/getting-started/environment-setup', 'cc6'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/getting-started/installation',
                component: ComponentCreator('/node-demo/docs/current/getting-started/installation', '395'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/getting-started/local-development',
                component: ComponentCreator('/node-demo/docs/current/getting-started/local-development', '779'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/guides/build-and-run',
                component: ComponentCreator('/node-demo/docs/current/guides/build-and-run', 'd65'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/guides/error-handling',
                component: ComponentCreator('/node-demo/docs/current/guides/error-handling', 'f32'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/guides/logging',
                component: ComponentCreator('/node-demo/docs/current/guides/logging', 'b8b'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/intro',
                component: ComponentCreator('/node-demo/docs/current/intro', 'ae4'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/security/authentication-flow',
                component: ComponentCreator('/node-demo/docs/current/security/authentication-flow', 'fef'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/security/best-practices',
                component: ComponentCreator('/node-demo/docs/current/security/best-practices', 'd5e'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/node-demo/docs/current/troubleshooting/faq',
                component: ComponentCreator('/node-demo/docs/current/troubleshooting/faq', '054'),
                exact: true,
                sidebar: "mainSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
