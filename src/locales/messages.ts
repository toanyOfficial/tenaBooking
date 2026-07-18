export const defaultLocale = 'ko' as const;

export const locales = ['ko', 'en', 'ja', 'zh-CN'] as const;

export type Locale = (typeof locales)[number];

type Messages = {
  header: {
    brandPrefix: string;
    brandAccent: string;
    languageCode: string;
    languageLabel: string;
  };
  room: {
    galleryLabel: string;
    galleryDescription: string;
    indicator: string;
    name: string;
    description: string;
    bedTypeLabel: string;
    bedType: string;
    checkInLabel: string;
    checkIn: string;
    checkOutLabel: string;
    checkOut: string;
  };
  booking: {
    title: string;
    checkInLabel: string;
    checkOutLabel: string;
    placeholder: string;
    nightsLabel: string;
    nightsValue: string;
    helper: string;
  };
  payment: {
    title: string;
    roomCharge: string;
    extraCharge: string;
    total: string;
    paypal: string;
    disabledNotice: string;
    stickyTotalLabel: string;
  };
  amenities: {
    title: string;
    items: string[];
  };
  pricing: {
    title: string;
    rateTitle: string;
    rates: Array<{ label: string; price: string; description: string }>;
    refundTitle: string;
    refunds: Array<{ period: string; penalty: string }>;
  };
  guide: {
    title: string;
    items: Array<{ title: string; description: string }>;
  };
  contact: {
    title: string;
    items: Array<{ label: string; value: string }>;
  };
  business: {
    title: string;
    rows: Array<{ label: string; value: string }>;
    terms: string;
    privacy: string;
  };
};

const ko: Messages = {
  header: {
    brandPrefix: 'TOANY',
    brandAccent: 'Medical Stay',
    languageCode: 'KO',
    languageLabel: '현재 언어 한국어, 언어 선택은 다음 단계에서 제공됩니다'
  },
  room: {
    galleryLabel: '객실 이미지 영역',
    galleryDescription: '차분한 프리미엄 숙소 이미지를 위한 플레이스홀더',
    indicator: '1 / 5',
    name: 'Standard Room',
    description: '병원 방문 고객을 위한 편안하고 독립적인 숙소',
    bedTypeLabel: '침대 타입',
    bedType: 'Double Bed',
    checkInLabel: '체크인',
    checkIn: '15:00',
    checkOutLabel: '체크아웃',
    checkOut: '11:00'
  },
  booking: {
    title: '숙박 일정',
    checkInLabel: '체크인',
    checkOutLabel: '체크아웃',
    placeholder: '날짜 선택',
    nightsLabel: '숙박일수',
    nightsValue: '미선택',
    helper: '일정을 선택하면 총금액이 계산됩니다.'
  },
  payment: {
    title: '결제 금액',
    roomCharge: '숙박 요금',
    extraCharge: '추가 요금',
    total: '총 결제금액',
    paypal: 'PayPal로 결제하기',
    disabledNotice: '결제 기능은 다음 단계에서 연결됩니다.',
    stickyTotalLabel: '총 결제금액'
  },
  amenities: {
    title: '객실 시설',
    items: ['Double 침대', '샤워부스', '비데 화장실', '싱크대', '하이라이트', '세탁기', '개별 에어컨', '개별 난방', '온수', '와이파이', '냉장·냉동고', '조리도구', '식기']
  },
  pricing: {
    title: '요금 및 환불 정책',
    rateTitle: '요금 정책',
    rates: [
      { label: 'Low', price: '70,000원', description: '오늘이 평일이고 내일도 평일' },
      { label: 'Mid', price: '90,000원', description: '오늘이 휴일이고 내일이 평일' },
      { label: 'High', price: '110,000원', description: '오늘과 상관없이 내일이 휴일' }
    ],
    refundTitle: '환불 정책',
    refunds: [
      { period: '체크인 6일 전까지', penalty: '위약금 없음' },
      { period: '체크인 5~4일 전', penalty: '위약금 10%' },
      { period: '체크인 3~2일 전', penalty: '위약금 30%' },
      { period: '체크인 1일 전', penalty: '위약금 50%' },
      { period: '체크인 당일', penalty: '위약금 100%' }
    ]
  },
  guide: {
    title: '이용 안내',
    items: [
      { title: '비대면 입실', description: '예약 확인 후 입실 방법을 별도로 안내드립니다.' },
      { title: '객실 이용 수칙', description: '다음 고객을 위해 실내 비품을 깨끗하게 이용해 주세요.' },
      { title: '금연', description: '모든 실내 공간은 금연이며 지정 구역 이용을 부탁드립니다.' },
      { title: '소음 주의', description: '회복과 휴식을 위해 밤 시간대에는 소음을 줄여 주세요.' },
      { title: '취사 가능', description: '간단한 취사가 가능하며 사용 후 정리를 부탁드립니다.' },
      { title: '쓰레기 배출', description: '분리배출 기준과 배출 위치는 입실 안내에서 확인하실 수 있습니다.' },
      { title: '주차 안내', description: '주차 가능 여부와 이용 방법은 예약 전 문의해 주세요.' },
      { title: '체크인 안내', description: '병원 일정에 따라 입실 시간이 필요하면 사전에 문의해 주세요.' }
    ]
  },
  contact: {
    title: '문의하기',
    items: [
      { label: '카카오톡 문의', value: '준비 중' },
      { label: '이메일 문의', value: '준비 중' },
      { label: '전화 문의', value: '준비 중' }
    ]
  },
  business: {
    title: '업체 정보',
    rows: [
      { label: '업체명', value: '준비 중' },
      { label: '대표자명', value: '준비 중' },
      { label: '사업자등록번호', value: '준비 중' },
      { label: '주소', value: '준비 중' },
      { label: '이메일', value: '준비 중' }
    ],
    terms: '이용약관',
    privacy: '개인정보처리방침'
  }
};

const fallback: Messages = ko;

export const messages: Record<Locale, Messages> = {
  ko,
  en: fallback,
  ja: fallback,
  'zh-CN': fallback
};
