import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  fetchAiringTodayTvSeries,
  fetchOnTheAirTvSeries,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchTrendingTvSeries,
  fetchUpcomingMovies,
} from '../api/moviedb';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import TrendingMovies from '../components/TrendingMovie';
import {styles} from '../theme';
import type {MediaItem} from '../types';
import type {AppNavigationProp} from '../types/navigation';

const ios = Platform.OS === 'ios';
const screenStyles = StyleSheet.create({
  scrollContent: {paddingBottom: 10},
});

export default function HomeScreen() {
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<MediaItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>([]);
  const [trendingTvSeries, setTrendingTvSeries] = useState<MediaItem[]>([]);
  const [onTheAirTvSeries, setOnTheAirTvSeries] = useState<MediaItem[]>([]);
  const [airingTodayTvSeries, setAiringTodayTvSeries] = useState<MediaItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<AppNavigationProp>();

  useEffect(() => {
    let active = true;

    const loadHome = async () => {
      const [
        trendingMoviesData,
        upcomingMoviesData,
        topRatedMoviesData,
        trendingTvSeriesData,
        onTheAirTvSeriesData,
        airingTodayTvSeriesData,
      ] = await Promise.all([
        fetchTrendingMovies(),
        fetchUpcomingMovies(),
        fetchTopRatedMovies(),
        fetchTrendingTvSeries(),
        fetchOnTheAirTvSeries(),
        fetchAiringTodayTvSeries(),
      ]);

      if (!active) {
        return;
      }

      setTrendingMovies(trendingMoviesData?.results ?? []);
      setUpcomingMovies(upcomingMoviesData?.results ?? []);
      setTopRatedMovies(topRatedMoviesData?.results ?? []);
      setTrendingTvSeries(trendingTvSeriesData?.results ?? []);
      setOnTheAirTvSeries(onTheAirTvSeriesData?.results ?? []);
      setAiringTodayTvSeries(airingTodayTvSeriesData?.results ?? []);
      setLoading(false);
    };

    loadHome();
    return () => {
      active = false;
    };
  }, []);

  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView className={ios ? '-mb-2' : 'mb-3'}>
        <StatusBar barStyle="light-content" />
        <View className="mx-4 flex-row items-center justify-between">
          <Bars3CenterLeftIcon size={30} strokeWidth={2} color="white" />
          <Text className="text-3xl font-bold text-white">
            <Text style={styles.text}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MagnifyingGlassIcon size={30} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={screenStyles.scrollContent}>
          <TrendingMovies title="Trending movies" data={trendingMovies} />
          <MovieList
            title="Upcoming movies"
            type="movie"
            data={upcomingMovies}
          />
          <MovieList
            title="Top rated movies"
            type="movie"
            data={topRatedMovies}
          />
          <TrendingMovies title="Trending TV shows" data={trendingTvSeries} />
          <MovieList title="On the air" type="tv" data={onTheAirTvSeries} />
          <MovieList
            title="Airing today"
            type="tv"
            data={airingTodayTvSeries}
          />
        </ScrollView>
      )}
    </View>
  );
}
