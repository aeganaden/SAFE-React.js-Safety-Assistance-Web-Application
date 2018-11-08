const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    config,
  );

  config = rewireLess.withLoaderOptions({
    modifyVars: {
      '@primary-color': '#112D31',
      '@link-color': '#89BDBB',
      '@success-color': '#89BDBB',
      '@text-color': 'rgba(17, 45, 49, .65)',
      '@heading-color': 'rgba(17, 45, 49, 0.9)',
      '@text-color-secondary': 'rgba(52, 82, 86, 0.73)',
    },
    javascriptEnabled: true,
  })(config, env);

  return config;
};
