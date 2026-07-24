import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

import type {Video} from '../types';

interface VideoListProps {
  videos: Video[];
}

const {width} = Dimensions.get('window');
const componentStyles = StyleSheet.create({
  scrollContent: {paddingHorizontal: 15},
});

export function VideoList({videos}: VideoListProps) {
  return (
    <View className="my-2">
      <Text className="mx-4 mb-5 text-xl text-white">Trailer videos</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={componentStyles.scrollContent}>
        {videos.map(video => (
          <View key={video.id || video.key} className="mr-4">
            <YoutubePlayer
              videoId={video.key}
              height={200}
              width={width * 0.9}
              play
            />
            <Text className="ml-1 text-neutral-300">
              {video.name.length > 50
                ? `${video.name.slice(0, 50)}...`
                : video.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
