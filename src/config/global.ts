export const severityColor = {
  critical: '#F53F3F',
  high: '#F77234',
  medium: '#F7BA1E',
  low: '#9FDB1D',
  none: '#e5e6eb',
};
export const severityMap = new Map([
  ['critical', '203, 39, 45'],
  ['high', '245, 63, 63'],
  ['medium', '255, 125, 0'],
  ['low', '250, 220, 25'],
  ['none', '134,144,156'],
]);
export const severityInactiveMap = new Map([
  ['critical', '243, 191, 192'],
  ['high', '251, 182, 182'],
  ['medium', '255, 202, 153'],
  ['low', '253, 244, 180'],
  ['none', '213,216,221'],
]);
export const severityColorValueMap = {
  critical: '203, 39, 45',
  high: '245, 63, 63',
  medium: '255, 125, 0',
  low: '250, 220, 25',
  none: '#e5e6eb',
};
export const riskColorMap = {
  critical: '203, 39, 45',
  high: '245, 63, 63',
  medium: '255, 180, 0',
  low: '134, 144, 156',
  none: '#e5e6eb',
};
export const serverityList = [
  { label: 'projects.risk.high', value: 'high' },
  { label: 'projects.risk.middle', value: 'medium' },
  { label: 'projects.risk.low', value: 'low' },
];

export const severityMaps = {
  critical: 'projects.risk.critical',
  high: 'projects.risk.high',
  medium: 'projects.risk.middle',
  low: 'projects.risk.low',
  none: 'projects.risk.none',
};
export const iconMap = {
  swid: 'icon-icon_apqpxiangmuguanlixitong',
  file: 'icon-file-text',
  library: 'icon-component',
};

export const compatibilityColor = {
  high: '#23C343',
  medium: '#ffb400',
  low: '#F76560',
};

export const compatibilityMap = {
  high: 'projects.risk.high',
  medium: 'projects.risk.middle',
  low: 'projects.risk.low',
};
export default {};
