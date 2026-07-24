import {useNavigation} from '@react-navigation/native';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {fallbackMoviePoster, image185} from '../api/moviedb';
import {styles} from '../theme';
import type {MediaItem, MediaType} from '../types';
import type {AppNavigationProp} from '../types/navigation';

interface MovieListProps {
  data: MediaItem[];
  hideSeeAll?: boolean;
  title: string;
  type?: MediaType;
}

const {width, height} = Dimensions.get('window');
const componentStyles = StyleSheet.create({
  scrollContent: {paddingHorizontal: 15},
});

export default function MovieList({
  title,
  data,
  hideSeeAll = false,
  type = 'movie',
}: MovieListProps) {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View className="mb-8 gap-4">
      <View className="mx-4 flex-row items-center justify-between">
        <Text className="text-xl text-white">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.text} className="text-lg">
              See all
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={componentStyles.scrollContent}>
        {data.map(item => {
          const itemTitle = type === 'tv' ? item.name : item.title;
          const displayTitle =
            itemTitle && itemTitle.length > 14
              ? `${itemTitle.slice(0, 14)}...`
              : itemTitle;

          return (
            <TouchableWithoutFeedback
              key={item.id}
              onPress={() =>
                type === 'tv'
                  ? navigation.navigate('TvSeriesDetails', item)
                  : navigation.navigate('MovieDetails', item)
              }>
              <View className="mr-4 gap-1">
                <Image
                  source={{
                    uri: image185(item.poster_path) || fallbackMoviePoster,
                  }}
                  className="rounded-3xl"
                  style={{width: width * 0.33, height: height * 0.22}}
                />
                <Text className="ml-1 text-neutral-300">{displayTitle}</Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
}
