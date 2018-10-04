//const postcssCustomProperties = require('postcss-custom-properties');
const postcssPresetEnv = require('postcss-preset-env');
const postcssSimpleVars = require('postcss-simple-vars');

module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-url"),
    postcssPresetEnv({
      /* use stage 3 features + css color-mod (warning on unresolved) */
      stage: 3,
      features: {
        'color-mod-function': { unresolved: 'warn' }
      },
      insertBefore: {
        'all-property': postcssSimpleVars
      }
    }),
    require("postcss-browser-reporter")
    // require('precss'),
    // require('autoprefixer')({
    //   'browsers': ['last 4 versions']
    // }),    
  ]
}