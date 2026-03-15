import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::customer.customer', {
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    findOne: {
      auth: false,
      policies: [],
      middlewares: [],
    },
  },
});