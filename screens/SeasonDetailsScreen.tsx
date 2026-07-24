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
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  fallbackMoviePoster,
  fetchTvSeriesEpisodeCredits,
  fetchTvSeriesEpisodeTrailerVideos,
  fetchTvSeriesSeasonDetails,
  image500,
} from '../api/moviedb';
import Cast from '../components/Cast';
import Loading from '../components/Loading';
import {VideoList} from '../components/VideoList';
import {styles, theme} from '../theme';
import type {CastMember, Episode, SeasonDetails, Video} from '../types';
import type {AppNavigationProp, RootStackParamList} from '../types/navigation';

type SeasonDetailsRoute = RouteProp<RootStackParamList, 'SeasonDetails'>;

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

export default function SeasonDetailsScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const {params} = useRoute<SeasonDetailsRoute>();
  const [season, setSeason] = useState<SeasonDetails | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSeason = async () => {
      const data = await fetchTvSeriesSeasonDetails(
        params.tvSeries.id,
        params.season.season_number,
      );

      if (active) {
        setSeason(data);
        setLoading(false);
      }
    };

    loadSeason();
    return () => {
      active = false;
    };
  }, [params.season.season_number, params.tvSeries.id]);

  const selectEpisode = async (selectedEpisode: Episode) => {
    setEpisode(selectedEpisode);
    const [credits, trailers] = await Promise.all([
      fetchTvSeriesEpisodeCredits(
        params.tvSeries.id,
        params.season.season_number,
        selectedEpisode.episode_number,
      ),
      fetchTvSeriesEpisodeTrailerVideos(
        params.tvSeries.id,
        params.season.season_number,
        selectedEpisode.episode_number,
      ),
    ]);

    setCast(credits?.cast ?? []);
    setVideos(trailers?.results ?? []);
  };

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
                uri: image500(season?.poster_path) || fallbackMoviePoster,
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
            {season?.name}
          </Text>
          {season && (
            <Text className="text-center text-base font-semibold text-neutral-400">
              {season.air_date} * {params.season.episode_count} episodes
            </Text>
          )}
          <Text className="mx-4 tracking-wide text-neutral-400">
            {season?.overview}
          </Text>
        </View>
        <View className="mx-4 my-4 gap-4">
          <Text className="text-xl text-white">Episodes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {season?.episodes?.map(seasonEpisode => (
              <TouchableWithoutFeedback
                key={seasonEpisode.id}
                onPress={() => selectEpisode(seasonEpisode)}>
                <View className="mx-2 h-10 w-10 items-center justify-center rounded-xl bg-white">
                  <Text className="text-base font-bold">
                    {seasonEpisode.episode_number}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        </View>
        {episode && (
          <View className="mx-4 my-4 gap-4">
            <Text className="text-xl text-white">Episode details</Text>
            <View className="gap-1">
              <Text className="font-bold text-neutral-400">
                <Text className="text-white">Name:</Text> {episode.name}
              </Text>
              <Text className="font-bold text-neutral-400">
                <Text className="text-white">Overview:</Text> {episode.overview}
              </Text>
              <Text className="font-bold text-neutral-400">
                <Text className="text-white">Runtime:</Text> {episode.runtime}{' '}
                minutes
              </Text>
            </View>
          </View>
        )}
        {videos.length > 0 && <VideoList videos={videos} />}
        {episode?.guest_stars && episode.guest_stars.length > 0 && (
          <Cast
            navigation={navigation}
            name="Guest Stars"
            cast={episode.guest_stars}
          />
        )}
        {cast.length > 0 && <Cast navigation={navigation} cast={cast} />}
      </View>
    </ScrollView>
  );
}
