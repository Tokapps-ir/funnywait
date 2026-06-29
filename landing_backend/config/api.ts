import type { Core } from '@strapi/strapi';

const config: Core.Config.Api = {
  rest: {
    defaultLimit: 2005,
    maxLimit: 5000,
    withCount: true,
  },
};

export default config;
