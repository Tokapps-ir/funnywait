import type { Schema, Struct } from '@strapi/strapi';

export interface FooterLink extends Struct.ComponentSchema {
  collectionName: 'components_footer_links';
  info: {
    description: '\u06CC\u06A9 \u0644\u06CC\u0646\u06A9 \u062F\u0631 \u0628\u062E\u0634 \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u0633\u0631\u06CC\u0639 \u0641\u0648\u062A\u0631';
    displayName: '\u0644\u06CC\u0646\u06A9 \u0641\u0648\u062A\u0631';
  };
  attributes: {
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'footer.link': FooterLink;
    }
  }
}
