import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fallex.fintrack',
  appName: 'FinTrack',
  webDir: '.',
  server: {
    androidScheme: 'https'
  },
  plugins: {}
};

export default config;
