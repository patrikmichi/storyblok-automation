export interface StoryblokField {
  type: string;
  required?: boolean;
  pos?: number;
  description?: string;
  default_value?: any;
  translatable?: boolean;
  options?: Array<{ value: string; name: string }>;
  restrict_components?: boolean;
  component_whitelist?: string[];
  filetypes?: string[];
  [key: string]: any; // Allow additional Storyblok-specific fields
}

export interface StoryblokSchema {
  name: string;
  display_name: string;
  is_nestable: boolean;
  is_root: boolean;
  schema: Record<string, StoryblokField>;
}

export class SchemaMapper {
  private fieldPosition = 0;

  /**
   * Maps Figma component structure to Storyblok schema
   * Based on the BenefitsDesktop component structure
   */
  mapFigmaToStoryblok(
    blockName: string,
    displayName?: string
  ): StoryblokSchema {
    this.fieldPosition = 0;

    const schema: Record<string, StoryblokField> = {};

    // Section Header fields
    schema.headline = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      description: 'Main section headline',
    };

    // Heading level option - immediately after headline for semantic workflow
    schema.heading_level = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'h2',
      options: [
        { value: 'h1', name: 'H1' },
        { value: 'h2', name: 'H2' },
        { value: 'h3', name: 'H3' },
        { value: 'h4', name: 'H4' },
        { value: 'h5', name: 'H5' },
        { value: 'h6', name: 'H6' },
      ],
      description: 'Heading tag level',
    };

    schema.subtext = {
      type: 'textarea',
      required: false,
      pos: this.fieldPosition++,
      description: 'Section description/subtext',
    };

    schema.alignment = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'Left',
      options: [
        { value: 'Left', name: 'Left' },
        { value: 'Center', name: 'Center' },
      ],
      description: 'Text alignment for header',
    };

    // Background option
    schema.background = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'White',
      options: [
        { value: 'White', name: 'White' },
        { value: 'Grey', name: 'Grey' },
        { value: 'Dark', name: 'Dark' },
      ],
      description: 'Section background color',
    };

    // Dynamic padding fields
    schema.padding_top = {
      type: 'number',
      required: false,
      pos: this.fieldPosition++,
      default_value: 96,
      description: 'Padding top in pixels',
    };

    schema.padding_bottom = {
      type: 'number',
      required: false,
      pos: this.fieldPosition++,
      default_value: 96,
      description: 'Padding bottom in pixels',
    };

    // Benefits/Features grid - using bloks for nested items
    schema.benefits = {
      type: 'bloks',
      required: false,
      pos: this.fieldPosition++,
      description: 'List of benefit items',
      // Restrict to benefit_item component
      restrict_components: true,
      component_whitelist: ['benefit_item'],
    };

    return {
      name: this.toSnakeCase(blockName),
      display_name: displayName || this.toDisplayName(blockName),
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Generate schema for nested benefit_item component
   */
  generateBenefitItemSchema(): StoryblokSchema {
    this.fieldPosition = 0;

    const schema: Record<string, StoryblokField> = {};

    schema.icon = {
      type: 'asset',
      required: false,
      pos: this.fieldPosition++,
      description: 'Icon image for the benefit',
      filetypes: ['images'],
    };

    schema.headline = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      description: 'Benefit headline',
    };

    schema.description = {
      type: 'textarea',
      required: false,
      pos: this.fieldPosition++,
      description: 'Benefit description',
    };

    schema.link = {
      type: 'multilink',
      required: false,
      pos: this.fieldPosition++,
      description: 'Optional link for the benefit',
    };

    schema.link_label = {
      type: 'text',
      required: false,
      pos: this.fieldPosition++,
      description: 'Link label text (shown if link is provided)',
    };

    schema.light_dark = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'false',
      options: [
        { value: 'false', name: 'Light' },
        { value: 'true', name: 'Dark' },
      ],
      description: 'Use dark/light variant (for dark backgrounds)',
    };

    return {
      name: 'benefit_item',
      display_name: 'Benefit Item',
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Converts to snake_case
   */
  private toSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '')
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_');
  }

  /**
   * Generate schema for business_types_section component
   * Based on BusinessTypes component structure
   */
  generateBusinessTypesSchema(): StoryblokSchema {
    this.fieldPosition = 0;

    const schema: Record<string, StoryblokField> = {};

    // Header fields - semantic order: content first, then styling
    schema.headline = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      description: 'Main section headline',
    };

    // Heading level - immediately after headline for semantic workflow
    schema.heading_level = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'h2',
      options: [
        { value: 'h1', name: 'H1' },
        { value: 'h2', name: 'H2' },
        { value: 'h3', name: 'H3' },
        { value: 'h4', name: 'H4' },
        { value: 'h5', name: 'H5' },
        { value: 'h6', name: 'H6' },
      ],
      description: 'Heading tag level',
    };

    schema.subtext = {
      type: 'textarea',
      required: false,
      pos: this.fieldPosition++,
      description: 'Section description/subtext',
    };

    schema.show_subtext = {
      type: 'boolean',
      required: false,
      pos: this.fieldPosition++,
      default_value: true,
      description: 'Show/hide subtext',
    };

    schema.alignment = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'Center',
      options: [
        { value: 'Left', name: 'Left' },
        { value: 'Center', name: 'Center' },
      ],
      description: 'Text alignment for header',
    };

    // Background option - styling comes after content
    schema.background = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'White',
      options: [
        { value: 'White', name: 'White' },
        { value: 'Grey', name: 'Grey' },
      ],
      description: 'Section background color',
    };

    // Dynamic padding fields
    schema.padding_top = {
      type: 'number',
      required: false,
      pos: this.fieldPosition++,
      default_value: 96,
      description: 'Padding top in pixels',
    };

    schema.padding_bottom = {
      type: 'number',
      required: false,
      pos: this.fieldPosition++,
      default_value: 96,
      description: 'Padding bottom in pixels',
    };

    // Business type cards - using bloks for nested items
    schema.business_cards = {
      type: 'bloks',
      required: false,
      pos: this.fieldPosition++,
      description: 'List of business type cards',
      restrict_components: true,
      component_whitelist: ['business_type_card'],
    };

    return {
      name: 'business_types_section',
      display_name: 'Business Types Section',
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Generate schema for nested business_type_card component
   */
  generateBusinessTypeCardSchema(): StoryblokSchema {
    this.fieldPosition = 0;

    const schema: Record<string, StoryblokField> = {};

    schema.headline = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      description: 'Business type headline (e.g., "HR people")',
    };

    schema.description = {
      type: 'textarea',
      required: false,
      pos: this.fieldPosition++,
      description: 'Business type description',
    };

    // Chips/tags - using a textarea with newlines or a custom field
    // For Storyblok, we'll use a textarea where users can enter tags separated by commas
    // Or we could use a custom field, but textarea is simpler
    schema.tags = {
      type: 'textarea',
      required: false,
      pos: this.fieldPosition++,
      description: 'Tags/chips (one per line or comma-separated)',
    };

    // Image
    schema.image = {
      type: 'asset',
      required: false,
      pos: this.fieldPosition++,
      description: 'Business type image',
      filetypes: ['images'],
    };

    return {
      name: 'business_type_card',
      display_name: 'Business Type Card',
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Generate schema for primary_button component
   */
  generatePrimaryButtonSchema(): StoryblokSchema {
    this.fieldPosition = 0;

    const schema: Record<string, StoryblokField> = {};

    schema.label = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      default_value: 'Button',
      description: 'Button label',
    };

    schema.link = {
      type: 'multilink',
      required: true,
      pos: this.fieldPosition++,
      description: 'Button link (URL or page)',
      allow_target_blank: true,
      link_type: ['url', 'story', 'email'],
    };

    schema.variant = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'On Dark',
      options: [
        { value: 'On Dark', name: 'On Dark' },
        { value: 'On Light', name: 'On Light' },
      ],
      description: 'Button variant for different backgrounds',
    };

    return {
      name: 'primary_button',
      display_name: 'Primary Button',
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Generate schema for secondary_button component
   */
  generateSecondaryButtonSchema(): StoryblokSchema {
    this.fieldPosition = 0;

    const schema: Record<string, StoryblokField> = {};

    schema.label = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      default_value: 'Button',
      description: 'Button label',
    };

    schema.link = {
      type: 'multilink',
      required: true,
      pos: this.fieldPosition++,
      description: 'Button link (URL or page)',
      allow_target_blank: true,
      link_type: ['url', 'story', 'email'],
    };

    schema.variant = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'On Dark',
      options: [
        { value: 'On Dark', name: 'On Dark' },
        { value: 'On Light', name: 'On Light' },
      ],
      description: 'Button variant for different backgrounds',
    };

    return {
      name: 'secondary_button',
      display_name: 'Secondary Button',
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Generate schema for stats_section component
   * Based on Stats component structure from Figma
   */
  generateStatsSectionSchema(): StoryblokSchema {
    this.fieldPosition = 0;

    const schema: Record<string, StoryblokField> = {};

    // Section Header fields
    schema.headline = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      description: 'Main section headline',
    };

    schema.heading_level = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'h2',
      options: [
        { value: 'h1', name: 'H1' },
        { value: 'h2', name: 'H2' },
        { value: 'h3', name: 'H3' },
        { value: 'h4', name: 'H4' },
        { value: 'h5', name: 'H5' },
        { value: 'h6', name: 'H6' },
      ],
      description: 'Heading tag level',
    };

    schema.subtext = {
      type: 'textarea',
      required: false,
      pos: this.fieldPosition++,
      description: 'Section description/subtext',
    };

    schema.show_subtext = {
      type: 'boolean',
      required: false,
      pos: this.fieldPosition++,
      default_value: true,
      description: 'Show/hide subtext',
    };

    schema.alignment = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'Center',
      options: [
        { value: 'Left', name: 'Left' },
        { value: 'Center', name: 'Center' },
      ],
      description: 'Text alignment for header',
    };

    // Background color option
    schema.background_color = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'White',
      options: [
        { value: 'White', name: 'White' },
        { value: 'Grey', name: 'Grey' },
        { value: 'Dark', name: 'Dark' },
      ],
      description: 'Section background color',
    };

    // Stats items - using bloks for nested items
    schema.stats = {
      type: 'bloks',
      required: true,
      pos: this.fieldPosition++,
      description: 'List of stat items',
      restrict_components: true,
      component_whitelist: ['stat_item'],
    };

    return {
      name: 'stats_section',
      display_name: 'Stats Section',
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Generate schema for stat_item nested component
   * Individual stat item with number and description
   */
  generateStatItemSchema(): StoryblokSchema {
    this.fieldPosition = 0;

    const schema: Record<string, StoryblokField> = {};

    schema.number = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      default_value: 'NN',
      description: 'Stat number or value',
    };

    schema.description = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      default_value: 'Description',
      description: 'Stat description text',
    };

    return {
      name: 'stat_item',
      display_name: 'Stat Item',
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Generate schema for security_card (nested component)
   * Based on CardSecurityCertification component structure
   */
  generateSecurityCardSchema(): StoryblokSchema {
    this.fieldPosition = 0;

    const schema: Record<string, StoryblokField> = {};

    schema.image = {
      type: 'asset',
      required: false,
      pos: this.fieldPosition++,
      description: 'Security certification image',
      filetypes: ['images'],
    };

    schema.headline = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      description: 'Card headline',
    };

    schema.subtext = {
      type: 'textarea',
      required: false,
      pos: this.fieldPosition++,
      description: 'Card description/subtext',
    };

    schema.show_subtext = {
      type: 'boolean',
      required: false,
      pos: this.fieldPosition++,
      default_value: true,
      description: 'Show/hide subtext',
    };

    schema.link = {
      type: 'multilink',
      required: false,
      pos: this.fieldPosition++,
      description: 'Optional link for the card',
    };

    schema.link_label = {
      type: 'text',
      required: false,
      pos: this.fieldPosition++,
      description: 'Link label text (shown if link is provided)',
    };

    schema.show_link = {
      type: 'boolean',
      required: false,
      pos: this.fieldPosition++,
      default_value: true,
      description: 'Show/hide link',
    };

    schema.card_type = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'Shadow',
      options: [
        { value: 'Shadow', name: 'Shadow' },
        { value: 'Border', name: 'Border' },
        { value: 'Dark', name: 'Dark' },
      ],
      description: 'Card visual style type',
    };

    return {
      name: 'security_card',
      display_name: 'Security Card',
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Generate schema for data_security_section component
   * Based on DataSecurity component structure
   */
  generateDataSecuritySectionSchema(): StoryblokSchema {
    this.fieldPosition = 0;
    const schema: Record<string, StoryblokField> = {};
    
    schema.headline = {
      type: 'text',
      required: true,
      pos: this.fieldPosition++,
      description: 'Main section headline',
    };
    
    schema.heading_level = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'h2',
      options: [
        { value: 'h1', name: 'H1' },
        { value: 'h2', name: 'H2' },
        { value: 'h3', name: 'H3' },
        { value: 'h4', name: 'H4' },
        { value: 'h5', name: 'H5' },
        { value: 'h6', name: 'H6' },
      ],
      description: 'Heading tag level',
    };
    
    schema.subtext = {
      type: 'textarea',
      required: false,
      pos: this.fieldPosition++,
      description: 'Section description/subtext',
    };
    
    schema.show_subtext = {
      type: 'boolean',
      required: false,
      pos: this.fieldPosition++,
      default_value: true,
      description: 'Show/hide subtext',
    };
    
    schema.alignment = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'Center',
      options: [
        { value: 'Left', name: 'Left' },
        { value: 'Center', name: 'Center' },
      ],
      description: 'Text alignment for header',
    };
    
    schema.background = {
      type: 'option',
      required: false,
      pos: this.fieldPosition++,
      default_value: 'White',
      options: [
        { value: 'White', name: 'White' },
        { value: 'Grey', name: 'Grey' },
        { value: 'Dark', name: 'Dark' },
      ],
      description: 'Section background color',
    };
    
    schema.padding_top = {
      type: 'number',
      required: false,
      pos: this.fieldPosition++,
      default_value: 96,
      description: 'Padding top in pixels',
    };
    
    schema.padding_bottom = {
      type: 'number',
      required: false,
      pos: this.fieldPosition++,
      default_value: 96,
      description: 'Padding bottom in pixels',
    };
    
    schema.security_cards = {
      type: 'bloks',
      required: true,
      pos: this.fieldPosition++,
      description: 'List of security certification cards',
      restrict_components: true,
      component_whitelist: ['security_card'],
    };
    
    return {
      name: 'data_security_section',
      display_name: 'Data Security Section',
      is_nestable: true,
      is_root: false,
      schema,
    };
  }

  /**
   * Converts to Display Name
   */
  private toDisplayName(str: string): string {
    return str
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}

