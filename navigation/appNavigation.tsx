import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import PersonScreen from '../screens/PersonScreen';
import SearchScreen from '../screens/SearchScreen';
import SeasonDetailsScreen from '../screens/SeasonDetailsScreen';
import TvSeriesDetailsScreen from '../screens/TvSeriesDetailsScreen';
import type {RootStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
        <Stack.Screen name="Person" component={PersonScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen
          name="TvSeriesDetails"
          component={TvSeriesDetailsScreen}
        />
        <Stack.Screen name="SeasonDetails" component={SeasonDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
