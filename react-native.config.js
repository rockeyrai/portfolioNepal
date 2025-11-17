module.exports = {
  dependencies: {},
  // tell RN to include node_modules for babel
  transformer: {
    getTransformModulePath() {
      return require.resolve("metro-react-native-babel-transformer");
    },
  },
};
