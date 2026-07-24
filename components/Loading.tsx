import {Dimensions, View} from 'react-native';
import * as Progress from 'react-native-progress';

import {theme} from '../theme';

const {width, height} = Dimensions.get('window');

export default function Loading() {
  return (
    <View
      style={{width, height}}
      className="absolute flex-row items-center justify-center">
      <Progress.CircleSnail
        thickness={12}
        size={160}
        color={theme.background}
      />
    </View>
  );
}
