import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '@/types';
import { colors, typography, spacing, radius, shadow } from '@/theme/tokens';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface PlaceMarkerProps {
  place: Place;
  onPress: (place: Place) => void;
}

const getMarkerStyle = (place: Place): { bg: string; border: string; icon: IoniconsName } => {
  if (place.deleteRequest) {
    return { bg: colors.status.deleteBg, border: colors.status.deleteRequest, icon: 'trash-outline' };
  }
  switch (place.status) {
    case 'wishlist':
      return { bg: '#FFE8F0', border: colors.marker.wishlist, icon: 'heart' };
    case 'visited':
      return { bg: '#E8FFF0', border: colors.marker.visited, icon: 'checkmark-circle' };
    case 'orphan':
      return { bg: '#F0F0F5', border: colors.marker.orphan, icon: 'location' };
  }
};

export const PlaceMarker: React.FC<PlaceMarkerProps> = ({ place, onPress }) => {
  const style = getMarkerStyle(place);

  return (
    <Marker
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      onPress={() => onPress(place)}
      tracksViewChanges={false}
    >
      <View style={[markerStyles.container, { backgroundColor: style.bg, borderColor: style.border }]}>
        <Ionicons name={style.icon} size={18} color={style.border} />
      </View>
      <View style={markerStyles.arrow} />
      <Callout tooltip>
        <View style={markerStyles.callout}>
          <Text style={markerStyles.calloutText} numberOfLines={1}>{place.name}</Text>
        </View>
      </Callout>
    </Marker>
  );
};

const markerStyles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surface.primary,
    alignSelf: 'center',
    marginTop: -1,
  },
  callout: {
    backgroundColor: colors.surface.primary,
    borderRadius: radius.sm,
    padding: spacing[2],
    ...shadow.sm,
    minWidth: 80,
    maxWidth: 200,
  },
  calloutText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
