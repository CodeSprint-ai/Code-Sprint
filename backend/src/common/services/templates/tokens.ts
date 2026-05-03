export interface EmailTokens {
  bodyBg: string; cardBg: string; cardBorder: string;
  headerBg: string; divider: string; footerBg: string;
  textPrimary: string; textSecondary: string; textMuted: string; textLink: string;
  accent: string; accentBtnBg: string; accentBtnText: string;
  badgeBg: string; badgeBorder: string; badgeText: string;
  warnBg: string; warnBorder: string; warnText: string; warnStrong: string;
  expireBg: string; expireBorder: string; expireText: string;
  infoBg: string; infoBorder: string; infoText: string;
  dotColor: string;
}

export const darkTokens: EmailTokens = {
  bodyBg:        '#0b0d12',
  cardBg:        '#0f1117',
  cardBorder:    '#1e2433',
  headerBg:      '#0b0d12',
  divider:       '#1e2433',
  footerBg:      '#080a0f',
  textPrimary:   '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted:     '#64748b',
  textLink:      '#475569',
  accent:        '#10b981',
  accentBtnBg:   '#10b981',
  accentBtnText: '#0b0d12',
  badgeBg:       '#10b98120',
  badgeBorder:   '#10b98140',
  badgeText:     '#10b981',
  warnBg:        '#18100e',
  warnBorder:    '#f43f5e20',
  warnText:      '#94a3b8',
  warnStrong:    '#fbbf24',
  expireBg:      '#1c0a0e',
  expireBorder:  '#f43f5e30',
  expireText:    '#f87171',
  infoBg:        '#0f1a12',
  infoBorder:    '#10b98120',
  infoText:      '#64748b',
  dotColor:      '#1e2d3d',
};

export const lightTokens: EmailTokens = {
  bodyBg:        '#f0fdf9',
  cardBg:        '#ffffff',
  cardBorder:    '#d1fae5',
  headerBg:      '#f8fffe',
  divider:       '#e2e8f0',
  footerBg:      '#f0fdf9',
  textPrimary:   '#0f172a',
  textSecondary: '#475569',
  textMuted:     '#94a3b8',
  textLink:      '#059669',
  accent:        '#10b981',
  accentBtnBg:   '#10b981',
  accentBtnText: '#ffffff',
  badgeBg:       '#d1fae5',
  badgeBorder:   '#6ee7b7',
  badgeText:     '#065f46',
  warnBg:        '#fff7ed',
  warnBorder:    '#fed7aa',
  warnText:      '#92400e',
  warnStrong:    '#b45309',
  expireBg:      '#fef2f2',
  expireBorder:  '#fecaca',
  expireText:    '#dc2626',
  infoBg:        '#f0fdf4',
  infoBorder:    '#bbf7d0',
  infoText:      '#166534',
  dotColor:      '#a7f3d0',
};
