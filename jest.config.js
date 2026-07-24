module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.ts',
    '^react-native-youtube-iframe$': '<rootDir>/__mocks__/YoutubePlayer.tsx',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-.*)/)',
  ],
};
