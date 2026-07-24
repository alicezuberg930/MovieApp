const {getDefaultConfig} = require('@expo/metro-config');
const {withNativewind} = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@expo/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

module.exports = withNativewind(config);
