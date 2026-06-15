export { defaultTokens } from './tokens';

/** Get all available theme names */
export const THEMES = ['lite-purple', 'forest', 'ocean', 'sunset'] as const;
export type ThemeName = (typeof THEMES)[number];
