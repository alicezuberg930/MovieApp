import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {XMarkIcon} from 'react-native-heroicons/outline';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  fallbackMoviePoster,
  image185,
  searchMovies,
  searchTVSeries,
} from '../api/moviedb';
import Loading from '../components/Loading';
import type {MediaItem} from '../types';
import type {AppNavigationProp} from '../types/navigation';

type SearchType = 'movie' | 'tv_series';

const {width, height} = Dimensions.get('window');

export default function SearchScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const [results, setResults] = useState<MediaItem[]>([]);
  const [type, setType] = useState<SearchType>('movie');
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    async (value: string) => {
      if (value.trim().length <= 3) {
        setLoading(false);
        setResults([]);
        return;
      }

      setLoading(true);
      const params = {
        query: value.trim(),
        include_adult: false,
        page: 1,
        language: 'en-US',
      };
      const data =
        type === 'movie'
          ? await searchMovies(params)
          : await searchTVSeries(params);

      setResults(data?.results ?? []);
      setLoading(false);
    },
    [type],
  );

  const handleTextDebounce = useMemo(
    () => debounce(handleSearch, 300),
    [handleSearch],
  );

  useEffect(
    () => () => {
      handleTextDebounce.cancel();
    },
    [handleTextDebounce],
  );

  const bgColorMovie = type === 'movie' ? 'bg-indigo-500' : 'bg-white';
  const bgColorTV = type === 'tv_series' ? 'bg-indigo-500' : 'bg-white';

  return (
    <SafeAreaView className="flex-1 bg-neutral-800">
      <View className="mx-4 my-3 flex-row items-center justify-between rounded-full border border-neutral-500">
        <TextInput
          placeholder={type === 'movie' ? 'Search movies' : 'Search TV series'}
          placeholderTextColor="lightgray"
          onChangeText={handleTextDebounce}
          onSubmitEditing={event => handleSearch(event.nativeEvent.text)}
          className="flex-1 p-3 text-base font-semibold tracking-wider text-white"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="m-1 mr-2 rounded-full bg-neutral-500">
          <XMarkIcon size={25} color="white" />
        </TouchableOpacity>
      </View>
      <View className="mx-4 my-3 flex-row items-center justify-start">
        <TouchableOpacity
          className={`rounded-lg p-2 ${bgColorMovie}`}
          onPress={() => {
            setType('movie');
            setResults([]);
          }}>
          <Text className="font-bold">Movies</Text>
        </TouchableOpacity>
        <View className="w-4" />
        <TouchableOpacity
          className={`rounded-lg p-2 ${bgColorTV}`}
          onPress={() => {
            setType('tv_series');
            setResults([]);
          }}>
          <Text className="font-bold">TV Series</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Loading />
      ) : results.length > 0 ? (
        <ScrollView className="mx-3 gap-3">
          <Text className="font-semibold text-white">
            Results ({results.length})
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {results.map(item => {
              const resultTitle =
                type === 'movie' ? item.title ?? '' : item.name ?? '';
              const displayTitle =
                resultTitle.length > 22
                  ? `${resultTitle.slice(0, 22)}...`
                  : resultTitle;

              return (
                <TouchableWithoutFeedback
                  key={item.id}
                  onPress={() =>
                    type === 'movie'
                      ? navigation.push('MovieDetails', item)
                      : navigation.push('TvSeriesDetails', item)
                  }>
                  <View className="mb-4 gap-2">
                    <Image
                      className="rounded-3xl"
                      source={{
                        uri: image185(item.poster_path) || fallbackMoviePoster,
                      }}
                      style={{width: width * 0.44, height: height * 0.3}}
                    />
                    <Text className="ml-1 text-neutral-300">
                      {displayTitle}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-row justify-center">
          <Image
            source={require('../assets/images/no_results.jpg')}
            className="h-96 w-96"
          />
        </View>
      )}
    </SafeAreaView>
  );
}
