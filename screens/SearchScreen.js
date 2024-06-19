import { useNavigation } from "@react-navigation/native"
import { useCallback, useState } from "react"
import { Dimensions, Image, ImageBackground, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { XMarkIcon } from "react-native-heroicons/outline"
import { SafeAreaView } from "react-native-safe-area-context"
import Loading from "../components/Loading"
import { debounce } from 'lodash'
import { image185, searchMovies } from "../api/moviedb"

const { width, height } = Dimensions.get('window')
export default function SearchScreen() {
    const navigation = useNavigation()
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (value) => {
        if (value && value.length > 3) {
            setLoading(true)
            const data = await searchMovies({
                query: value,
                include_adult: 'false',
                page: '1',
                language: 'en-US'
            })
            if (data && data.results) {
                setLoading(false)
                setResults(data.results)
            } else {
                setLoading(false)
                setResults([])
            }
        } else {
            setLoading(false)
            setResults([])
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), [])
    return (
        <SafeAreaView className="bg-neutral-800 flex-1">
            <View className="mx-4 mb-3 flex-row justify-between items-center border border-neutral-500 rounded-full">
                <TextInput placeholder="Search movie" placeholderTextColor={'lightgray'}
                    onChangeText={handleTextDebounce}
                    className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
                />
                <TouchableOpacity onPress={() => navigation.navigate('Home')}
                    className="rounded-full p-3 m-1 bg-neutral-500"
                />
                <XMarkIcon size={25} color="white" />
            </View>
            {
                loading ? (<Loading />) :
                    results.length > 0 ? (
                        <ScrollView className="space-y-3">
                            <Text className="text-white font-semibold ml-1">Results ({results.length})</Text>
                            <View className="flex-row justify-between flex-wrap">
                                {
                                    results.map((item, index) => {
                                        return (
                                            <TouchableWithoutFeedback key={index} onPress={() => navigation.push('MovieDetails', item)}>
                                                <View className="space-y-2 mb-4">
                                                    <Image className="rounded-3xl"
                                                        source={{ uri: image185(item?.poster_path) }}
                                                        style={{ width: width * 0.44, height: height * 0.3 }}
                                                    />
                                                    <Text className="text-neutral-300 ml-1">
                                                        {item?.title.length > 22 ? item?.title.slice(0, 22) + '...' : item?.title}
                                                    </Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    ) : (
                        <View className="flex-row justify-center">
                            <Image source={require('../assets/images/doctor_strange.jpg')}
                                className="h-96 w-96"
                            />
                        </View>
                    )
            }

        </SafeAreaView>
    )
}