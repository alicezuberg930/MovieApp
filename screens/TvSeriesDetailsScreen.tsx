import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {HeartIcon} from 'react-native-heroicons/solid';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {
  fallbackMoviePoster,
  fetchSimilarTvSeries,
  fetchTvSeriesCredits,
  fetchTvSeriesDetails,
  fetchTvSeriesVideos,
  image185,
  image500,
} from '../api/moviedb';
import Cast from '../components/Cast';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import {VideoList} from '../components/VideoList';
import {styles, theme} from '../theme';
import type {CastMember, MediaItem, TvSeriesDetails, Video} from '../types';
import type {AppNavigationProp, RootStackParamList} from '../types/navigation';

type TvDetailsRoute = RouteProp<RootStackParamList, 'TvSeriesDetails'>;

const {width, height} = Dimensions.get('window');
const topMargin = Platform.OS === 'ios' ? '' : 'mt-3';
const screenStyles = StyleSheet.create({
  scrollContent: {paddingBottom: 20},
  gradient: {
    position: 'absolute',
    bottom: 0,
    width,
    height: height * 0.4,
  },
  seasonsContent: {paddingHorizontal: 15},
});

export default function TvSeriesDetailsScreen() {
  const {params: item} = useRoute<TvDetailsRoute>();
  const navigation = useNavigation<AppNavigationProp>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similarTvSeries, setSimilarTvSeries] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tvSeries, setTvSeries] = useState<TvSeriesDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    let active = true;

    const loadTvSeries = async () => {
      const [details, credits, similar, trailers] = await Promise.all([
        fetchTvSeriesDetails(item.id),
        fetchTvSeriesCredits(item.id),
        fetchSimilarTvSeries(item.id),
        fetchTvSeriesVideos(item.id),
      ]);

      if (!active) {
        return;
      }

      setTvSeries(details);
      setCast(credits?.cast ?? []);
      setSimilarTvSeries(similar?.results ?? []);
      setVideos(trailers?.results ?? []);
      setLoading(false);
    };

    loadTvSeries();
    return () => {
      active = false;
    };
  }, [item.id]);

  return (
    <ScrollView
      contentContainerStyle={screenStyles.scrollContent}
      className="flex-1 bg-neutral-900">
      <View className="w-full">
        <SafeAreaView
          className={`absolute z-20 w-full flex-row items-center justify-between px-4 ${topMargin}`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.background}
            className="rounded-xl p-1">
            <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFavorite(value => !value)}>
            <HeartIcon
              size={35}
              color={isFavorite ? theme.background : 'white'}
            />
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              source={{
                uri: image500(tvSeries?.backdrop_path) || fallbackMoviePoster,
              }}
              style={{width, height: height * 0.55}}
            />
            <LinearGradient
              colors={['transparent', 'rgba(23,23,23,0.8)', 'rgba(23,23,23,1)']}
              style={screenStyles.gradient}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 1}}
            />
          </View>
        )}
        <View style={{marginTop: -(height * 0.09)}} className="gap-3">
          <Text className="text-center text-3xl font-bold tracking-wider text-white">
            {tvSeries?.name}
          </Text>
          {tvSeries && (
            <Text className="text-center text-base font-semibold text-neutral-400">
              {tvSeries.status} * {tvSeries.first_air_date?.split('-')[0]} *{' '}
              {tvSeries.number_of_seasons} seasons
            </Text>
          )}
          <View className="mx-4 flex-row justify-center gap-2">
            {tvSeries?.genres?.map((genre, index) => (
              <Text
                className="text-center text-base font-semibold text-neutral-400"
                key={genre.id}>
                {genre.name}{' '}
                {index + 1 !== tvSeries.genres?.length ? '*' : null}
              </Text>
            ))}
          </View>
          <Text className="mx-4 tracking-wide text-neutral-400">
            {tvSeries?.overview}
          </Text>
        </View>
      </View>
      {tvSeries?.seasons && (
        <View className="mt-4 gap-4">
          <Text className="mx-4 text-xl text-white">Seasons</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={screenStyles.seasonsContent}>
            {tvSeries.seasons.map(season => (
              <TouchableWithoutFeedback
                key={season.id}
                onPress={() =>
                  navigation.navigate('SeasonDetails', {
                    season,
                    tvSeries,
                  })
                }>
                <View className="mr-4 gap-1">
                  <Image
                    source={{
                      uri: image185(season.poster_path) || fallbackMoviePoster,
                    }}
                    className="rounded-3xl"
                    style={{width: width * 0.33, height: height * 0.22}}
                  />
                  <Text className="ml-1 text-center text-neutral-300">
                    {season.name}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        </View>
      )}
      {videos.length > 0 && <VideoList videos={videos} />}
      {cast.length > 0 && <Cast navigation={navigation} cast={cast} />}
      {similarTvSeries.length > 0 && (
        <MovieList
          title="Similar TV Series"
          type="tv"
          hideSeeAll
          data={similarTvSeries}
        />
      )}
    </ScrollView>
  );
}
