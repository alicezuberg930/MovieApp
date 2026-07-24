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
  View,
} from 'react-native';
import {ChevronLeftIcon} from 'react-native-heroicons/outline';
import {HeartIcon} from 'react-native-heroicons/solid';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchMovieTrailerVideos,
  fetchSimilarMovies,
  image500,
} from '../api/moviedb';
import Cast from '../components/Cast';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import {VideoList} from '../components/VideoList';
import {styles, theme} from '../theme';
import type {CastMember, MediaItem, MovieDetails, Video} from '../types';
import type {AppNavigationProp, RootStackParamList} from '../types/navigation';

type MovieDetailsRoute = RouteProp<RootStackParamList, 'MovieDetails'>;

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
});

export default function MovieDetailsScreen() {
  const {params: item} = useRoute<MovieDetailsRoute>();
  const navigation = useNavigation<AppNavigationProp>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similarMovies, setSimilarMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  useEffect(() => {
    let active = true;

    const loadMovie = async () => {
      const [details, credits, similar, trailers] = await Promise.all([
        fetchMovieDetails(item.id),
        fetchMovieCredits(item.id),
        fetchSimilarMovies(item.id),
        fetchMovieTrailerVideos(item.id),
      ]);

      if (!active) {
        return;
      }

      setMovie(details);
      setCast(credits?.cast ?? []);
      setSimilarMovies(similar?.results ?? []);
      setVideos(trailers?.results ?? []);
      setLoading(false);
    };

    loadMovie();
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
                uri: image500(movie?.poster_path) || fallbackMoviePoster,
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
            {movie?.title}
          </Text>
          {movie && (
            <Text className="text-center text-base font-semibold text-neutral-400">
              {movie.status} * {movie.release_date?.split('-')[0]} *{' '}
              {movie.runtime} min
            </Text>
          )}
          <View className="mx-4 flex-row justify-center gap-2">
            {movie?.genres?.map((genre, index) => (
              <Text
                className="text-center text-base font-semibold text-neutral-400"
                key={genre.id}>
                {genre.name} {index + 1 !== movie.genres?.length ? '*' : null}
              </Text>
            ))}
          </View>
          <Text className="mx-4 tracking-wide text-neutral-400">
            {movie?.overview}
          </Text>
        </View>
      </View>
      {videos.length > 0 && <VideoList videos={videos} />}
      {cast.length > 0 && <Cast navigation={navigation} cast={cast} />}
      {similarMovies.length > 0 && (
        <MovieList
          title="Similar Movies"
          type="movie"
          hideSeeAll
          data={similarMovies}
        />
      )}
    </ScrollView>
  );
}
