module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
        'custom-selectors': true,
        'color-mix': true,
        'color-contrast': true,
        'double-position-gradients': true,
        'logical-properties-and-values': true
      },
      autoprefixer: {
        flexbox: 'no-2009'
      },
      stage: 3
    },
    'postcss-import': {},
    'postcss-url': {
      url: 'rebase'
    },
    'postcss-custom-properties': {
      preserve: false
    },
    'postcss-calc': {},
    'postcss-discard-comments': {
      removeAll: true
    },
    'postcss-discard-empty': {},
    'postcss-discard-unused': {},
    'postcss-merge-idents': {},
    'postcss-merge-longhand': {},
    'postcss-merge-rules': {},
    'postcss-minify-font-values': {},
    'postcss-minify-gradients': {},
    'postcss-minify-params': {},
    'postcss-minify-selectors': {},
    'postcss-normalize-charset': {},
    'postcss-normalize-display-values': {},
    'postcss-normalize-positions': {},
    'postcss-normalize-repeat-style': {},
    'postcss-normalize-string': {},
    'postcss-normalize-timing-functions': {},
    'postcss-normalize-unicode': {},
    'postcss-normalize-url': {},
    'postcss-ordered-values': {},
    'postcss-reduce-idents': {},
    'postcss-reduce-initial': {},
    'postcss-reduce-transforms': {},
    'postcss-svgo': {},
    'postcss-unique-selectors': {},
    'postcss-zindex': {
      startIndex: 1
    }
  }
}; 