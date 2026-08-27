// theme.js — design tokens shared across the whole app
// Import wherever you need colors/fonts: import { colors, fonts } from '../theme';

export const colors = {
  bg: '#0A0D12',
  surface: '#12161D',
  surface2: '#171C24',
  border: '#262D38',
  borderSoft: '#1C222B',

  text: '#ECEEF0',
  textDim: '#8D96A3',
  textFaint: '#545C68',

  platinum: '#C9CFD6',
  platinumSoft: 'rgba(201,207,214,0.09)',
  platinumLine: 'rgba(201,207,214,0.30)',

  racing: '#A8434F',
  racingSoft: 'rgba(168,67,79,0.15)',

  steel: '#5C8286',
  steelSoft: 'rgba(92,130,134,0.15)',
};

// Font family keys — load these with @expo-google-fonts before using
export const fonts = {
  serif: 'Fraunces_400Regular',
  serifItalic: 'Fraunces_400Regular_Italic',
  serifMedium: 'Fraunces_500Medium',
  body: 'System', // Inter can be added the same way as Fraunces if you want it exact
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
};

export const radii = {
  none: 0, // this design intentionally uses sharp corners, not rounded
};