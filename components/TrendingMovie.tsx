import {useNavigation} from '@react-navigation/native';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel-new';

import {fallbackMoviePoster, image500} from '../api/moviedb';
import type {MediaItem} from '../types';
import type {AppNavigationProp} from '../types/navigation';

interface TrendingMoviesProps {
  data: MediaItem[];
  title: string;
}

interface MovieCardProps {
  item: MediaItem;
  onPress: (item: MediaItem) => void;
}

const {width, height} = Dimensions.get('window');
const componentStyles = StyleSheet.create({
  slide: {display: 'flex', alignItems: 'center'},
});

export default function TrendingMovies({title, data}: TrendingMoviesProps) {
  const navigation = useNavigation<AppNavigationProp>();

  const onPress = (item: MediaItem) => {
    if (item.media_type === 'tv') {
      navigation.navigate('TvSeriesDetails', item);
    } else {
      navigation.navigate('MovieDetails', item);
    }
  };

  return (
    <View className="mb-8">
      <Text className="mx-4 mb-5 text-xl text-white">{title}</Text>
      <Carousel<MediaItem>
        data={data}
        renderItem={({item}) => <MovieCard item={item} onPress={onPress} />}
        firstItem={data.length > 1 ? 1 : 0}
        inactiveSlideOpacity={0.6}
        sliderWidth={width}
        itemWidth={width * 0.62}
        slideStyle={componentStyles.slide}
      />
    </View>
  );
}

function MovieCard({item, onPress}: MovieCardProps) {
  return (
    <TouchableWithoutFeedback onPress={() => onPress(item)}>
      <Image
        source={{uri: image500(item.poster_path) || fallbackMoviePoster}}
        style={{width: width * 0.6, height: height * 0.4}}
        className="rounded-3xl"
      />
    </TouchableWithoutFeedback>
  );
}
