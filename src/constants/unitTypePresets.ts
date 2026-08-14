import type { UnitTypeTemplate } from '../types';

/**
 * Small starter catalog so the MVP is usable immediately. This is an
 * assumption, not a confirmed decision — see ARCHITECTURE.md open decision
 * #4 (whether to seed presets at all, and with what sizes).
 */
export const unitTypePresets: UnitTypeTemplate[] = [
  {
    id: 'preset-wire-24x48',
    name: '24x48 Wire Shelving',
    category: 'wire_shelving',
    defaultWidthIn: 48,
    defaultDepthIn: 24,
    defaultHeightIn: 74,
    defaultShelfCount: 4,
    color: '#4a90d9',
  },
  {
    id: 'preset-wire-18x36',
    name: '18x36 Wire Shelving',
    category: 'wire_shelving',
    defaultWidthIn: 36,
    defaultDepthIn: 18,
    defaultHeightIn: 74,
    defaultShelfCount: 4,
    color: '#4a90d9',
  },
  {
    id: 'preset-walkin-rack',
    name: 'Walk-In Rack',
    category: 'walk_in_rack',
    defaultWidthIn: 60,
    defaultDepthIn: 24,
    defaultHeightIn: 72,
    defaultShelfCount: 5,
    color: '#7fb069',
  },
  {
    id: 'preset-cabinet',
    name: 'Storage Cabinet',
    category: 'cabinet',
    defaultWidthIn: 36,
    defaultDepthIn: 24,
    defaultHeightIn: 84,
    defaultShelfCount: 3,
    color: '#c97b4a',
  },
];
