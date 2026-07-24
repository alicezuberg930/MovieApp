import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {
  CastMember,
  MediaItem,
  SeasonSummary,
  TvSeriesDetails,
} from './index';

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  MovieDetails: MediaItem;
  TvSeriesDetails: MediaItem;
  Person: CastMember;
  SeasonDetails: {
    season: SeasonSummary;
    tvSeries: TvSeriesDetails;
  };
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
