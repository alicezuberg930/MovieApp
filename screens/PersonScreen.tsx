import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ChevronLeftIcon, HeartIcon} from 'react-native-heroicons/outline';

import {
  fallbackPersonImage,
  fetchPersonDetails,
  fetchPersonMovies,
  image342,
} from '../api/moviedb';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import {styles} from '../theme';
import type {MediaItem, PersonDetails} from '../types';
import type {AppNavigationProp, RootStackParamList} from '../types/navigation';

type PersonRoute = RouteProp<RootStackParamList, 'Person'>;

const {width, height} = Dimensions.get('window');
const verticalMargin = Platform.OS === 'ios' ? '' : 'my-3';
const screenStyles = StyleSheet.create({
  scrollContent: {paddingBottom: 20},
  portraitShadow: {
    shadowColor: 'gray',
    shadowRadius: 40,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 1,
  },
});

export default function PersonScreen() {
  const {params: item} = useRoute<PersonRoute>();
  const navigation = useNavigation<AppNavigationProp>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [personMovies, setPersonMovies] = useState<MediaItem[]>([]);
  const [personDetails, setPersonDetails] = useState<PersonDetails | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPerson = async () => {
      const [details, movies] = await Promise.all([
        fetchPersonDetails(item.id),
        fetchPersonMovies(item.id),
      ]);

      if (!active) {
        return;
      }

      setPersonDetails(details);
      setPersonMovies(movies?.cast ?? []);
      setLoading(false);
    };

    loadPerson();
    return () => {
      active = false;
    };
  }, [item.id]);

  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={screenStyles.scrollContent}>
      <SafeAreaView
        className={`absolute z-20 w-full flex-row items-center justify-between px-4 ${verticalMargin}`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.background}
          className="rounded-xl p-1">
          <ChevronLeftIcon size={28} strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFavorite(value => !value)}>
          <HeartIcon size={35} color={isFavorite ? 'red' : 'white'} />
        </TouchableOpacity>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <View>
          <View
            className="flex-row justify-center"
            style={screenStyles.portraitShadow}>
            <View className="h-72 w-72 items-center overflow-hidden rounded-full border border-neutral-500">
              <Image
                source={{
                  uri:
                    image342(personDetails?.profile_path) ||
                    fallbackPersonImage,
                }}
                style={{height: height * 0.43, width: width * 0.74}}
              />
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-center text-3xl font-bold text-white">
              {personDetails?.name}
            </Text>
            <Text className="text-center text-base text-neutral-500">
              {personDetails?.place_of_birth}
            </Text>
          </View>
          <View className="mx-3 mt-6 flex-row items-center justify-between rounded-full bg-neutral-700 p-4">
            <View className="items-center border-r-2 border-r-neutral-400 px-2">
              <Text className="font-semibold text-white">Gender</Text>
              <Text className="text-sm text-neutral-300">
                {personDetails?.gender === 1 ? 'Female' : 'Male'}
              </Text>
            </View>
            <View className="items-center border-r-2 border-r-neutral-400 px-2">
              <Text className="font-semibold text-white">Birthday</Text>
              <Text className="text-sm text-neutral-300">
                {personDetails?.birthday}
              </Text>
            </View>
            <View className="items-center border-r-2 border-r-neutral-400 px-2">
              <Text className="font-semibold text-white">Known for</Text>
              <Text className="text-sm text-neutral-300">
                {personDetails?.known_for_department}
              </Text>
            </View>
            <View className="items-center px-2">
              <Text className="font-semibold text-white">Popular</Text>
              <Text className="text-sm text-neutral-300">
                {personDetails?.popularity?.toFixed(2)}%
              </Text>
            </View>
          </View>
          <View className="mx-4 my-6 gap-2">
            <Text className="text-lg text-white">Biography</Text>
            <Text className="tracking-wide text-neutral-400">
              {personDetails?.biography || 'N/A'}
            </Text>
          </View>
          <MovieList
            title="Movies"
            type="movie"
            hideSeeAll
            data={personMovies}
          />
        </View>
      )}
    </ScrollView>
  );
}
