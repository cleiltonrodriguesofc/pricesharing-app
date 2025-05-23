module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['@babel/plugin-proposal-export-namespace-from'],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-flow-strip-types']
    }
  }
};
