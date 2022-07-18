export const statusList: string[] = [
  'ordersPlaced',
  'detailsCollected',
  'orderConfirmed',
  'inProgress',
  'loadCompleted',
  'inTransit',
  'unloadComplete',
  'consignmentDone',
];

export const statusDictionary = {
  ordersPlaced: 'Orders Place',
  detailsCollected: 'Details Collected',
  orderConfirmed: 'Order Confirmed',
  inProgress:'In progress',
  loadCompleted: 'Load Complete',
  inTransit: 'In Transit',
  unloadComplete: 'Unload Complete',
  consignmentDone: 'Trip Completed',
};

export const ordersBoardColors = {
  ordersPlaced: { bgColor: '#1bbdbb', color: '#FFFFFF' },
  detailsCollected: { bgColor: '#1bbdbb', color: '#FFFFFF' },
  orderConfirmed: { bgColor: '#1bbdbb', color: '#FFFFFF' },
  loadCompleted: { bgColor: '#1bbdbb', color: '#FFFFFF' },
  inTransit: { bgColor: '#1bbdbb', color: '#FFFFFF' },
  unloadComplete: { bgColor: '#1bbdbb', color: '#FFFFFF' },
  consignmentDone: { bgColor: '#1bbdbb', color: '#FFFFFF' },
  inProgress: { bgColor: '#1bbdbb', color: '#FFFFFF' },
};
