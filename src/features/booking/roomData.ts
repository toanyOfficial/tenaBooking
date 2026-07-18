export type RoomImageKey = 'bedroom' | 'kitchen' | 'bathroom' | 'laundry' | 'overview';

export type RoomImage = {
  id: RoomImageKey;
  src: string;
};

export type AmenityKey =
  | 'doubleBed'
  | 'showerBooth'
  | 'bidetToilet'
  | 'sink'
  | 'cooktop'
  | 'washingMachine'
  | 'airConditioner'
  | 'heating'
  | 'hotWater'
  | 'wifi'
  | 'refrigerator'
  | 'cookware'
  | 'tableware'
  | 'digitalDoorLock';

export type AmenityIcon = 'bed' | 'bath' | 'toilet' | 'sink' | 'cooktop' | 'washer' | 'air' | 'heat' | 'water' | 'wifi' | 'fridge' | 'cookware' | 'tableware' | 'doorlock';

export type Amenity = {
  id: AmenityKey;
  icon: AmenityIcon;
  featured?: boolean;
};

export const standardRoomImages: RoomImage[] = [
  { id: 'bedroom', src: '/images/room/standard-01.png' },
  { id: 'kitchen', src: '/images/room/standard-02.png' },
  { id: 'bathroom', src: '/images/room/standard-03.png' },
  { id: 'overview', src: '/images/room/standard-05.png' }
];

export const roomAmenities: Amenity[] = [
  { id: 'doubleBed', icon: 'bed', featured: true },
  { id: 'showerBooth', icon: 'bath' },
  { id: 'bidetToilet', icon: 'toilet' },
  { id: 'sink', icon: 'sink' },
  { id: 'cooktop', icon: 'cooktop' },
  { id: 'washingMachine', icon: 'washer' },
  { id: 'airConditioner', icon: 'air', featured: true },
  { id: 'heating', icon: 'heat', featured: true },
  { id: 'hotWater', icon: 'water' },
  { id: 'wifi', icon: 'wifi', featured: true },
  { id: 'refrigerator', icon: 'fridge' },
  { id: 'cookware', icon: 'cookware' },
  { id: 'tableware', icon: 'tableware' },
  { id: 'digitalDoorLock', icon: 'doorlock' }
];
