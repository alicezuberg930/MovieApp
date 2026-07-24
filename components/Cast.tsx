import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {fallbackPersonImage, image185} from '../api/moviedb';
import type {CastMember} from '../types';
import type {AppNavigationProp} from '../types/navigation';

interface CastProps {
  cast: CastMember[];
  navigation: AppNavigationProp;
  name?: string;
}

const truncate = (value = '', length = 10) =>
  value.length > length ? `${value.slice(0, length)}...` : value;

const componentStyles = StyleSheet.create({
  scrollContent: {paddingHorizontal: 15},
});

export default function Cast({cast, navigation, name}: CastProps) {
  return (
    <View className="my-6">
      <Text className="mx-4 mb-5 text-lg text-white">{name ?? 'Top cast'}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={componentStyles.scrollContent}>
        {cast.map(person => (
          <TouchableOpacity
            key={person.id}
            className="mr-4 items-center"
            onPress={() => navigation.navigate('Person', person)}>
            <View className="h-20 w-20 items-center overflow-hidden rounded-full border border-neutral-500">
              <Image
                source={{
                  uri: image185(person.profile_path) || fallbackPersonImage,
                }}
                className="h-24 w-20 rounded-2xl"
              />
            </View>
            <Text className="mt-1 text-xs text-white">
              {truncate(person.character)}
            </Text>
            <Text className="mt-1 text-xs text-neutral-400">
              {truncate(person.original_name ?? person.name)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
