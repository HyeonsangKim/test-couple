import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Place } from '@/types';
import { colors, typography, spacing, radius, shadow } from '@/theme/tokens';

interface PlaceMarkerProps {
  place: Place;
  onPress: (place: Place) => void;
}

const getMarkerStyle = (place: Place) => {
  if (place.deleteRequest) {
    return { bg: colors.deleteBg, border: colors.deleteRed, icon: '🗑️' };
  }
  switch (place.status) {
    case 'wishlist':
      return { bg: '#FFE8F0', border: colors.markerWishlist, icon: '💗' };
    case 'visited':
      return { bg: '#E8FFF0', border: colors.markerVisited, icon: '✅' };
    case 'orphan':
      return { bg: '#F0F0F5', border: colors.markerOrphan, icon: '📍' };
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
        <Text style={markerStyles.icon}>{style.icon}</Text>
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
  icon: {
    fontSize: 18,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surface,
    alignSelf: 'center',
    marginTop: -1,
  },
  callout: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm,
    ...shadow.sm,
    minWidth: 80,
    maxWidth: 200,
  },
  calloutText: {
    ...typography.captionBold,
    color: colors.text,
    textAlign: 'center',
  },
});
