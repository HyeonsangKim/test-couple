import { Visit, VisitImage } from '@/types';

export const MOCK_VISITS: Visit[] = [
  // place_1: 을지로 - 3 visits
  {
    visitId: 'visit_1',
    placeId: 'place_1',
    visitDate: '2024-02-10',
    createdByUserId: 'user_me',
    createdAt: '2024-02-10T18:00:00Z',
    updatedAt: '2024-02-10T18:00:00Z',
  },
  {
    visitId: 'visit_2',
    placeId: 'place_1',
    visitDate: '2024-06-22',
    createdByUserId: 'user_partner',
    createdAt: '2024-06-22T20:00:00Z',
    updatedAt: '2024-06-22T20:00:00Z',
  },
  {
    visitId: 'visit_3',
    placeId: 'place_1',
    visitDate: '2024-11-20',
    createdByUserId: 'user_me',
    createdAt: '2024-11-20T15:30:00Z',
    updatedAt: '2024-11-20T15:30:00Z',
  },
  // place_2: 남산타워 - 2 visits
  {
    visitId: 'visit_4',
    placeId: 'place_2',
    visitDate: '2024-03-14',
    createdByUserId: 'user_partner',
    createdAt: '2024-03-14T20:00:00Z',
    updatedAt: '2024-03-14T20:00:00Z',
  },
  {
    visitId: 'visit_5',
    placeId: 'place_2',
    visitDate: '2024-10-15',
    createdByUserId: 'user_me',
    createdAt: '2024-10-15T18:00:00Z',
    updatedAt: '2024-10-15T18:00:00Z',
  },
  // place_3: 방탈출 - 1 visit
  {
    visitId: 'visit_6',
    placeId: 'place_3',
    visitDate: '2024-04-01',
    createdByUserId: 'user_me',
    createdAt: '2024-04-01T22:00:00Z',
    updatedAt: '2024-04-01T22:00:00Z',
  },
  // place_4: 성수동 - 2 visits
  {
    visitId: 'visit_7',
    placeId: 'place_4',
    visitDate: '2024-05-20',
    createdByUserId: 'user_partner',
    createdAt: '2024-05-20T14:00:00Z',
    updatedAt: '2024-05-20T14:00:00Z',
  },
  {
    visitId: 'visit_8',
    placeId: 'place_4',
    visitDate: '2024-11-30',
    createdByUserId: 'user_me',
    createdAt: '2024-11-30T09:00:00Z',
    updatedAt: '2024-11-30T09:00:00Z',
  },
  // place_5: 제주 - 1 visit
  {
    visitId: 'visit_9',
    placeId: 'place_5',
    visitDate: '2024-06-15',
    createdByUserId: 'user_me',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  // place_8: 한강 벤치 - 4 visits
  {
    visitId: 'visit_10',
    placeId: 'place_8',
    visitDate: '2024-03-01',
    createdByUserId: 'user_me',
    createdAt: '2024-03-01T19:00:00Z',
    updatedAt: '2024-03-01T19:00:00Z',
  },
  {
    visitId: 'visit_11',
    placeId: 'place_8',
    visitDate: '2024-05-15',
    createdByUserId: 'user_partner',
    createdAt: '2024-05-15T20:00:00Z',
    updatedAt: '2024-05-15T20:00:00Z',
  },
  {
    visitId: 'visit_12',
    placeId: 'place_8',
    visitDate: '2024-08-20',
    createdByUserId: 'user_me',
    createdAt: '2024-08-20T21:00:00Z',
    updatedAt: '2024-08-20T21:00:00Z',
  },
  {
    visitId: 'visit_13',
    placeId: 'place_8',
    visitDate: '2024-11-25',
    createdByUserId: 'user_partner',
    createdAt: '2024-11-25T21:00:00Z',
    updatedAt: '2024-11-25T21:00:00Z',
  },
];

export const MOCK_VISIT_IMAGES: VisitImage[] = [
  // visit_1 images
  { imageId: 'img_1a', visitId: 'visit_1', uri: 'https://picsum.photos/seed/v1a/400/300', width: 400, height: 300, createdAt: '2024-02-10T18:00:00Z' },
  { imageId: 'img_1b', visitId: 'visit_1', uri: 'https://picsum.photos/seed/v1b/400/300', width: 400, height: 300, createdAt: '2024-02-10T18:01:00Z' },
  // visit_2 images
  { imageId: 'img_2a', visitId: 'visit_2', uri: 'https://picsum.photos/seed/v2a/400/300', width: 400, height: 300, createdAt: '2024-06-22T20:00:00Z' },
  // visit_3 images
  { imageId: 'img_3a', visitId: 'visit_3', uri: 'https://picsum.photos/seed/v3a/400/300', width: 400, height: 300, createdAt: '2024-11-20T15:30:00Z' },
  { imageId: 'img_3b', visitId: 'visit_3', uri: 'https://picsum.photos/seed/v3b/400/300', width: 400, height: 300, createdAt: '2024-11-20T15:31:00Z' },
  { imageId: 'img_3c', visitId: 'visit_3', uri: 'https://picsum.photos/seed/v3c/400/300', width: 400, height: 300, createdAt: '2024-11-20T15:32:00Z' },
  // visit_4 images
  { imageId: 'img_4a', visitId: 'visit_4', uri: 'https://picsum.photos/seed/v4a/400/300', width: 400, height: 300, createdAt: '2024-03-14T20:00:00Z' },
  { imageId: 'img_4b', visitId: 'visit_4', uri: 'https://picsum.photos/seed/v4b/400/300', width: 400, height: 300, createdAt: '2024-03-14T20:01:00Z' },
  // visit_5 images
  { imageId: 'img_5a', visitId: 'visit_5', uri: 'https://picsum.photos/seed/v5a/400/300', width: 400, height: 300, createdAt: '2024-10-15T18:00:00Z' },
  // visit_6 images
  { imageId: 'img_6a', visitId: 'visit_6', uri: 'https://picsum.photos/seed/v6a/400/300', width: 400, height: 300, createdAt: '2024-04-01T22:00:00Z' },
  // visit_7 images
  { imageId: 'img_7a', visitId: 'visit_7', uri: 'https://picsum.photos/seed/v7a/400/300', width: 400, height: 300, createdAt: '2024-05-20T14:00:00Z' },
  { imageId: 'img_7b', visitId: 'visit_7', uri: 'https://picsum.photos/seed/v7b/400/300', width: 400, height: 300, createdAt: '2024-05-20T14:01:00Z' },
  // visit_9 images
  { imageId: 'img_9a', visitId: 'visit_9', uri: 'https://picsum.photos/seed/v9a/400/300', width: 400, height: 300, createdAt: '2024-06-15T10:00:00Z' },
  { imageId: 'img_9b', visitId: 'visit_9', uri: 'https://picsum.photos/seed/v9b/400/300', width: 400, height: 300, createdAt: '2024-06-15T10:01:00Z' },
  { imageId: 'img_9c', visitId: 'visit_9', uri: 'https://picsum.photos/seed/v9c/400/300', width: 400, height: 300, createdAt: '2024-06-15T10:02:00Z' },
  { imageId: 'img_9d', visitId: 'visit_9', uri: 'https://picsum.photos/seed/v9d/400/300', width: 400, height: 300, createdAt: '2024-06-15T10:03:00Z' },
  // visit_10 images
  { imageId: 'img_10a', visitId: 'visit_10', uri: 'https://picsum.photos/seed/v10a/400/300', width: 400, height: 300, createdAt: '2024-03-01T19:00:00Z' },
  // visit_12 images
  { imageId: 'img_12a', visitId: 'visit_12', uri: 'https://picsum.photos/seed/v12a/400/300', width: 400, height: 300, createdAt: '2024-08-20T21:00:00Z' },
  { imageId: 'img_12b', visitId: 'visit_12', uri: 'https://picsum.photos/seed/v12b/400/300', width: 400, height: 300, createdAt: '2024-08-20T21:01:00Z' },
  // visit_13 images
  { imageId: 'img_13a', visitId: 'visit_13', uri: 'https://picsum.photos/seed/v13a/400/300', width: 400, height: 300, createdAt: '2024-11-25T21:00:00Z' },
];
