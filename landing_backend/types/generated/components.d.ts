import type { Schema, Struct } from '@strapi/strapi';

export interface ExperiencecardsExperiencecards extends Struct.ComponentSchema {
  collectionName: 'components_experiencecards_experiencecards';
  info: {
    displayName: 'experiencecards';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    icon: Schema.Attribute.Media<'images'>;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

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

export interface FooterSlider extends Struct.ComponentSchema {
  collectionName: 'components_footer_sliders';
  info: {
    displayName: 'certificates';
    icon: 'code';
  };
  attributes: {
    certificate: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface NarrativeHeroExperienceGrid extends Struct.ComponentSchema {
  collectionName: 'components_narrative_hero_experience_grids';
  info: {
    displayName: 'experience-grid';
  };
  attributes: {
    card: Schema.Attribute.Component<'experiencecards.experiencecards', true>;
    description: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface NarrativeHeroMap extends Struct.ComponentSchema {
  collectionName: 'components_narrative_hero_maps';
  info: {
    displayName: 'map';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    location: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<
        'plugin::strapi-location-picker.location-picker',
        {
          info: true;
        }
      >;
    title: Schema.Attribute.String;
  };
}

export interface NarrativeHeroMerfyAsbabBazyHa extends Struct.ComponentSchema {
  collectionName: 'components_narrative_hero_merfy_asbab_bazy_ha';
  info: {
    displayName: '\u0645\u0639\u0631\u0641\u06CC \u0627\u0633\u0628\u0627\u0628 \u0628\u0627\u0632\u06CC \u0647\u0627';
  };
  attributes: {
    description: Schema.Attribute.String;
    product: Schema.Attribute.Component<
      'narrative-hero.toy-showcase-products',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface NarrativeHeroMsharkt extends Struct.ComponentSchema {
  collectionName: 'components_narrative_hero_msharkt';
  info: {
    displayName: '\u0645\u0634\u0627\u0631\u06A9\u062A';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    step: Schema.Attribute.Component<'narrative-hero.products', true>;
    title: Schema.Attribute.String;
  };
}

export interface NarrativeHeroNarrativeHero extends Struct.ComponentSchema {
  collectionName: 'components_narrative_hero_narrative_heroes';
  info: {
    displayName: 'narrative-hero';
  };
  attributes: {
    badge: Schema.Attribute.String;
    cta_text: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    morph_1_threshold: Schema.Attribute.Decimal;
    morph_2_threshold: Schema.Attribute.Decimal;
    morph_3_threshold: Schema.Attribute.Decimal;
    scroll_fade_end: Schema.Attribute.Decimal;
    scroll_fade_start: Schema.Attribute.Decimal;
    scroll_hint: Schema.Attribute.String;
    scroll_scale_end: Schema.Attribute.Decimal;
    scroll_y_end: Schema.Attribute.Decimal;
    subtitle: Schema.Attribute.String;
    subtitle_highlight_1: Schema.Attribute.String;
    subtitle_highlight_2: Schema.Attribute.String;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface NarrativeHeroProblemStory extends Struct.ComponentSchema {
  collectionName: 'components_narrative_hero_problem_stories';
  info: {
    displayName: 'problem-story';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    icon: Schema.Attribute.Media<'images'>;
    image: Schema.Attribute.Media<'images', true>;
    title: Schema.Attribute.String;
  };
}

export interface NarrativeHeroProducts extends Struct.ComponentSchema {
  collectionName: 'components_narrative_hero_products';
  info: {
    displayName: 'products';
  };
  attributes: {
    title: Schema.Attribute.String;
  };
}

export interface NarrativeHeroScenarioSlider extends Struct.ComponentSchema {
  collectionName: 'components_narrative_hero_scenario_sliders';
  info: {
    displayName: 'scenario-slider';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    image: Schema.Attribute.Media<'images'>;
    place_name: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface NarrativeHeroToyShowcaseProducts
  extends Struct.ComponentSchema {
  collectionName: 'components_narrative_hero_toy_showcase_products';
  info: {
    displayName: 'toy_showcase_products';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ScenarioScenario extends Struct.ComponentSchema {
  collectionName: 'components_scenario_scenarios';
  info: {
    displayName: 'scenario';
  };
  attributes: {};
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'experiencecards.experiencecards': ExperiencecardsExperiencecards;
      'footer.link': FooterLink;
      'footer.slider': FooterSlider;
      'narrative-hero.experience-grid': NarrativeHeroExperienceGrid;
      'narrative-hero.map': NarrativeHeroMap;
      'narrative-hero.merfy-asbab-bazy-ha': NarrativeHeroMerfyAsbabBazyHa;
      'narrative-hero.msharkt': NarrativeHeroMsharkt;
      'narrative-hero.narrative-hero': NarrativeHeroNarrativeHero;
      'narrative-hero.problem-story': NarrativeHeroProblemStory;
      'narrative-hero.products': NarrativeHeroProducts;
      'narrative-hero.scenario-slider': NarrativeHeroScenarioSlider;
      'narrative-hero.toy-showcase-products': NarrativeHeroToyShowcaseProducts;
      'scenario.scenario': ScenarioScenario;
    }
  }
}
