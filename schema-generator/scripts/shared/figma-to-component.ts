/**
 * Utility functions to convert Figma design context to React components with CSS Modules
 */

export interface FigmaDesignContext {
  code?: string;
  styles?: string;
  images?: string;
}

/**
 * Convert Tailwind classes to CSS Module properties
 */
export function tailwindToCSSModule(tailwindClass: string): { className: string; css: string } {
  // Map common Tailwind patterns to CSS
  const mappings: Record<string, string> = {
    'bg-white': 'background-color: #FFFFFF;',
    'bg-\\[#f7f7f7\\]': 'background-color: #F7F7F7;',
    'bg-\\[#042a47\\]': 'background-color: #042A47;',
    'text-white': 'color: #FFFFFF;',
    'text-\\[#161616\\]': 'color: #161616;',
    'text-\\[#464646\\]': 'color: #464646;',
    'text-\\[#5690f5\\]': 'color: #5690F5;',
    'font-\\[\'Venn:Bold\',sans-serif\\]': 'font-family: \'Venn\', sans-serif;\n  font-weight: 700;',
    'font-\\[\'Venn:Regular\',sans-serif\\]': 'font-family: \'Venn\', sans-serif;\n  font-weight: 400;',
    'text-\\[40px\\]': 'font-size: 40px;',
    'text-\\[24px\\]': 'font-size: 24px;',
    'text-\\[20px\\]': 'font-size: 20px;',
    'text-\\[16px\\]': 'font-size: 16px;',
    'text-\\[14px\\]': 'font-size: 14px;',
    'leading-\\[48px\\]': 'line-height: 48px;',
    'leading-\\[32px\\]': 'line-height: 32px;',
    'leading-\\[24px\\]': 'line-height: 24px;',
    'leading-\\[20px\\]': 'line-height: 20px;',
    'flex': 'display: flex;',
    'flex-col': 'flex-direction: column;',
    'items-center': 'align-items: center;',
    'items-start': 'align-items: flex-start;',
    'justify-center': 'justify-content: center;',
    'gap-\\[48px\\]': 'gap: 48px;',
    'gap-\\[32px\\]': 'gap: 32px;',
    'gap-\\[24px\\]': 'gap: 24px;',
    'gap-\\[16px\\]': 'gap: 16px;',
    'gap-\\[12px\\]': 'gap: 12px;',
    'gap-\\[10px\\]': 'gap: 10px;',
    'gap-\\[8px\\]': 'gap: 8px;',
    'gap-\\[2px\\]': 'gap: 2px;',
    'px-0': 'padding-left: 0;\n  padding-right: 0;',
    'py-\\[96px\\]': 'padding-top: 96px;\n  padding-bottom: 96px;',
    'w-full': 'width: 100%;',
    'w-\\[1440px\\]': 'width: 1440px;',
    'w-\\[1216px\\]': 'width: 1216px;\n  max-width: 1216px;',
    'w-\\[800px\\]': 'width: 800px;',
    'w-\\[592px\\]': 'width: 592px;',
    'w-\\[280px\\]': 'width: 280px;',
    'text-center': 'text-align: center;',
    'flex-wrap': 'flex-wrap: wrap;',
    'rounded-\\[8px\\]': 'border-radius: 8px;',
    'rounded-\\[4px\\]': 'border-radius: 4px;',
    'size-\\[40px\\]': 'width: 40px;\n  height: 40px;',
    'size-\\[24px\\]': 'width: 24px;\n  height: 24px;',
    'shrink-0': 'flex-shrink: 0;',
    'opacity-\\[0\\.72\\]': 'opacity: 0.72;',
    'relative': 'position: relative;',
    'overflow-clip': 'overflow: clip;',
  };

  // Generate a CSS class name from Tailwind classes
  const className = tailwindClass
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  // Build CSS from mappings
  let css = '';
  const classes = tailwindClass.split(' ');
  for (const cls of classes) {
    for (const [pattern, cssValue] of Object.entries(mappings)) {
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(cls)) {
        css += `  ${cssValue}\n`;
      }
    }
  }

  return { className, css };
}

/**
 * Extract component structure from Figma design code
 */
export function extractComponentStructure(figmaCode: string, schema: any): {
  jsx: string;
  css: string;
} {
  // This is a simplified version - in production, you'd parse the Figma code more carefully
  // For now, we'll generate a structure based on the schema and common patterns
  
  const componentName = schema.name;
  const pascalName = componentName.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  
  // Generate JSX based on schema structure
  let jsx = '';
  let css = '';

  // Section wrapper
  jsx += `    <div className={\`\${styles.section} \${background === 'White' ? styles.sectionWhite : background === 'Grey' ? styles.sectionGrey : styles.sectionDark} \${className}\`}\n`;
  jsx += `      style={{\n`;
  jsx += `        paddingTop: \`\${padding_top}px\`,\n`;
  jsx += `        paddingBottom: \`\${padding_bottom}px\`,\n`;
  jsx += `      }}\n`;
  jsx += `    >\n`;

  css += `.section {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding-left: 0;\n  padding-right: 0;\n  width: 100%;\n}\n\n`;
  css += `.sectionWhite {\n  background-color: #FFFFFF;\n}\n\n`;
  css += `.sectionGrey {\n  background-color: #F7F7F7;\n}\n\n`;
  css += `.sectionDark {\n  background-color: #042A47;\n}\n\n`;

  // Container
  jsx += `      <div className={styles.container}>\n`;
  css += `.container {\n  display: flex;\n  flex-direction: column;\n  gap: 48px;\n  align-items: center;\n  width: 100%;\n  max-width: 1216px;\n}\n\n`;

  // Header section
  if (schema.schema.headline) {
    const HeadingTag = `heading_level || 'h2'`;
    jsx += `        <div className={styles.header}>\n`;
    jsx += `          <${HeadingTag} className={styles.headline}>\n`;
    jsx += `            {headline}\n`;
    jsx += `          </${HeadingTag}>\n`;
    
    if (schema.schema.subtext) {
      jsx += `          {subtext && (\n`;
      jsx += `            <p className={styles.subtext}>{subtext}</p>\n`;
      jsx += `          )}\n`;
    }
    jsx += `        </div>\n`;

    css += `.header {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  align-items: ${schema.schema.alignment?.default_value === 'Center' ? 'center' : 'flex-start'};\n  text-align: ${schema.schema.alignment?.default_value === 'Center' ? 'center' : 'left'};\n  width: 100%;\n  max-width: 800px;\n}\n\n`;
    css += `.headline {\n  font-family: 'Venn', sans-serif;\n  font-weight: 700;\n  line-height: 48px;\n  font-size: 40px;\n  color: #161616;\n  width: 100%;\n}\n\n`;
    css += `.subtext {\n  font-family: 'Venn', sans-serif;\n  font-weight: 400;\n  font-size: 20px;\n  line-height: 32px;\n  color: #464646;\n  width: 100%;\n}\n\n`;
  }

  // Benefits grid
  if (schema.schema.benefits) {
    jsx += `        <div className={styles.benefitsGrid}>\n`;
    jsx += `          {benefits?.map((benefit) => (\n`;
    jsx += `            <BenefitItem key={benefit._uid} {...benefit} />\n`;
    jsx += `          ))}\n`;
    jsx += `        </div>\n`;

    css += `.benefitsGrid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 32px;\n  align-items: flex-start;\n  width: 100%;\n}\n\n`;
  }

  jsx += `      </div>\n`;
  jsx += `    </div>\n`;

  return { jsx, css };
}

/**
 * Generate component implementation from Figma design
 */
export function generateComponentFromFigma(
  schema: any,
  figmaCode?: string
): { componentCode: string; cssCode: string } {
  const componentName = schema.name.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const propsName = `${componentName}Props`;
  const cssModuleName = `${componentName}.module.css`;

  // Generate props interface
  const props: string[] = [];
  for (const [fieldName, field] of Object.entries(schema.schema)) {
    const tsType = getTypeScriptType(field as any, fieldName);
    props.push(`  ${fieldName}: ${tsType}`);
  }
  props.push('  className?: string');

  // Generate component structure
  const { jsx, css } = extractComponentStructure(figmaCode || '', schema);

  // Build component code
  const componentCode = `import styles from './${cssModuleName}'
${schema.schema.benefits ? `import { BenefitItem } from './BenefitItem'\n` : ''}

export interface ${propsName} {
${props.join('\n')}
}

export function ${componentName}({
${Object.keys(schema.schema).map(key => `  ${key},`).join('\n')}
  className = '',
}: ${propsName}) {
  const HeadingTag = (heading_level || 'h2') as keyof JSX.IntrinsicElements
  
  return (
${jsx}  )
}
`;

  const cssCode = `/* ${schema.display_name} - Exact Figma specs */\n\n${css}`;

  return { componentCode, cssCode };
}

function getTypeScriptType(field: any, fieldName: string): string {
  const isRequired = field.required !== false;
  const optional = isRequired ? '' : '?';

  switch (field.type) {
    case 'text':
    case 'textarea':
      return `string${optional}`;
    case 'number':
      return `number${optional}`;
    case 'boolean':
      return `boolean${optional}`;
    case 'option':
      if (field.options && field.options.length > 0) {
        const values = field.options.map((opt: any) => `'${opt.value}'`).join(' | ');
        return `${values}${optional}`;
      }
      return `string${optional}`;
    case 'multilink':
      return `{\n    url?: string\n    cached_url?: string\n    id?: string\n    email?: string\n    linktype?: string\n  }${optional}`;
    case 'asset':
      return `string${optional}`;
    case 'bloks':
      return `Array<{\n    _uid: string\n    component: string\n    [key: string]: any\n  }>${optional}`;
    default:
      return `any${optional}`;
  }
}

