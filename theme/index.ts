import type {TextStyle, ViewStyle} from 'react-native';

export const theme = {background: '#eab308', text: '#eab308'};

export const styles = {
  text: {color: theme.text} satisfies TextStyle,
  background: {backgroundColor: theme.background} satisfies ViewStyle,
};
