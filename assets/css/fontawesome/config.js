// Font Awesome Configuration
const config = {
  version: '6.5.1',
  cdn: {
    primary: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    integrity: 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==',
    fallback: 'https://use.fontawesome.com/releases/v6.5.1/css/all.css',
    fallbackIntegrity: 'sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm'
  },
  local: {
    css: 'assets/css/fontawesome/fontawesome.css',
    fonts: 'assets/webfonts'
  },
  checkDelay: 1000, // Delay in ms before checking if Font Awesome loaded
  icons: {
    solid: [
      'home', 'star', 'play-circle', 'quote-left', 'tags', 'question-circle',
      'bolt', 'lock', 'shield-alt', 'headset', 'tools', 'network-wired',
      'microchip', 'tachometer-alt', 'volume-up', 'expand', 'database',
      'wifi', 'infinity', 'envelope', 'info-circle', 'file-pdf', 'download',
      'exclamation-triangle', 'brain', 'rocket', 'graduation-cap', 'code',
      'laptop-code', 'trophy', 'paper-plane', 'moon', 'external-link-alt',
      'book', 'file-alt', 'palette'
    ],
    brands: [
      'facebook', 'twitter', 'discord', 'github', 'linkedin', 'python',
      'js', 'react', 'rust', 'golang', 'x-twitter'
    ],
    regular: [
      'clock', 'calendar'
    ]
  }
};

export default config; 