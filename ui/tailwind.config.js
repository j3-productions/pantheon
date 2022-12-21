module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'Inter UI', 'San Francisco', 'Helvetica Neue', 'Arial', 'sans-serif'],
      mono: ['Source Code Pro', 'Roboto mono', 'Courier New', 'monospace'],
    },
    colors: { // nord palette: https://www.nordtheme.com/docs/colors-and-palettes
      fgp1: '#3B4252',
      fgp2: '#8FBCBB',
      fgs1: '#D08770',
      fgs2: '#5E81AC',
      bgp1: '#ECEFF4',
      bgp2: '#D8DEE9',
      bgs1: '#88C0D0',
      bgs2: '#5E81AC',
    },
    // colors: { // slate.host palette: https://slate.host/narative/slate-brand-identity?id=37e4f395-7b56-4778-9fbe-e7f1a3bfa1ba
    //   fgp1: '#0d0d0d',
    //   fgp2: '#141318',
    //   fgs1: '#D08770',
    //   fgs2: '#5E81AC',
    //   bgp1: '#7e7d78',
    //   bgp2: '#26272b',
    //   bgs1: '#88C0D0',
    //   bgs2: '#5E81AC',
    // },
  },
  screens: {},
  plugins: []
};
