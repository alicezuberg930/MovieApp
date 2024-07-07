import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import YoutubePlayer from 'react-native-youtube-iframe';

const { width, height } = Dimensions.get('window')
export function VideoList({ videos }) {
    return (
        <View className="my-2">
            <Text className="text-white text-xl mb-5 mx-4">Trailer videos</Text>
            <ScrollView horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}>
                {
                    videos.map((video, index) => {
                        return (
                            <View key={index} className="mr-4">
                                <YoutubePlayer videoId={video.key} height={200} width={width * 0.9} play={true} />
                                <Text className="text-neutral-300 ml-1">
                                    {video.name.length > 50 ? video.name.slice(0, 50) + '...' : video.name}
                                </Text>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}