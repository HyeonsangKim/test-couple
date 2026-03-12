import { component } from './tokens';

const tabFabBottom = component.floating.edgeOffset;

export const tabFloatingMetrics = {
  horizontal: component.floating.edgeOffset,
  fabBottom: tabFabBottom,
  locationBottom: tabFabBottom + component.button.fab + component.floating.stackGap,
  listBottomPadding: tabFabBottom + component.button.fab + component.floating.listTrailingPadding,
} as const;
