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
  | 'tableware';

export type AmenityIcon = 'bed' | 'bath' | 'toilet' | 'sink' | 'cooktop' | 'washer' | 'air' | 'heat' | 'water' | 'wifi' | 'fridge' | 'cookware' | 'tableware';

export type Amenity = {
  id: AmenityKey;
  icon: AmenityIcon;
  featured?: boolean;
};

export const standardRoomImages: RoomImage[] = [
  { id: 'bedroom', src: '/images/room/standard-01.svg' },
  { id: 'kitchen', src: '/images/room/standard-02.svg' },
  { id: 'bathroom', src: '/images/room/standard-03.svg' },
  { id: 'laundry', src: '/images/room/standard-04.svg' },
  { id: 'overview', src: '/images/room/standard-05.svg' }
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
  { id: 'tableware', icon: 'tableware' }
];
