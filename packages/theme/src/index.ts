
import { defaultTokens } from './tokens';

export * from './tokens';

/**
 * Generates a CSS string containing the default DateDreamer design tokens as CSS variables.
 */
export function generateDefaultThemeCSS() {
  return `
    :root {
      --dd-primary: ${defaultTokens.colors.primary};
      --dd-primary-contrast: ${defaultTokens.colors.primary-contrast};
      --dd-background: ${defaultTokens.colors.background};
      --dd-text: ${defaultTokens.colors.text};
      --dd-border: ${defaultTokens.colors.border};
      --dd-error: ${defaultTokens.colors.error};
      
      --dd-radius-sm: ${defaultTokens.radius.sm};
      --dd-radius-md: ${defaultTokens.radius.md};
      --dd-radius-lg: ${defaultTokens.radius.lg};
      
      --dd-spacing-sm: ${defaultTokens.spacing.sm};
      --dd-spacing-md: ${defaultTokens.spacing.md};
      --dd-spacing-lg: ${defaultTokens.spacing.lg};
    }
  `;
}
