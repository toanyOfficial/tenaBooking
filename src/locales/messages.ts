import type { AmenityKey, RoomImageKey } from '@/features/booking/roomData';

export const defaultLocale = 'ko' as const;

export const locales = ['ko', 'en', 'ja', 'zh-CN'] as const;

export type Locale = (typeof locales)[number];

type Messages = {
  header: { brandPrefix: string; brandAccent: string; languageCode: string; languageLabel: string };
  room: {
    galleryLabel: string;
    imageCounter: string;
    previousImage: string;
    nextImage: string;
    goToImage: string;
    type: string;
    description: string;
    bedTypeLabel: string;
    bedType: string;
    stayTimeTitle: string;
    checkInLabel: string;
    checkIn: string;
    checkOutLabel: string;
    checkOut: string;
    featuredAmenitiesTitle: string;
    images: Record<RoomImageKey, string>;
    independence: { title: string; description: string };
  };
  booking: { title: string; checkInLabel: string; checkOutLabel: string; selectDate: string; placeholder: string; nightsLabel: string; nightsValue: string; selectSchedule: string; selectCheckOut: string; totalNights: string; oneNight: string; nights: string; minStayError: string; maxStayError: string; invalidDateError: string; checkOutAfterCheckInError: string; checkInPastError: string };
  payment: { title: string; roomCharge: string; extraCharge: string; total: string; paypal: string; disabledNotice: string; stickyTotalLabel: string };
  amenities: { title: string; items: Record<AmenityKey, string> };
  pricing: { title: string; rateTitle: string; rates: Array<{ label: string; price: string; description: string }>; refundTitle: string; refunds: Array<{ period: string; penalty: string }> };
  guide: { title: string; items: Array<{ title: string; description: string }> };
  contact: { title: string; items: Array<{ label: string; value: string }> };
  business: { title: string; rows: Array<{ label: string; value: string }>; terms: string; privacy: string };
};

export const messages: Record<Locale, Messages> = {
  ko: {
    header: { brandPrefix: 'TOANY', brandAccent: 'Medical Stay', languageCode: 'KO', languageLabel: '현재 언어 한국어, 언어 선택은 다음 단계에서 제공됩니다' },
    room: {
      galleryLabel: 'Standard Room 이미지 캐러셀', imageCounter: '{current} / {total}', previousImage: '이전 객실 이미지 보기', nextImage: '다음 객실 이미지 보기', goToImage: '{index}번째 객실 이미지 보기',
      type: 'Standard Room', description: '병원 방문 및 회복 기간 동안 편안하게 머무를 수 있는 독립형 객실입니다.', bedTypeLabel: '침대', bedType: 'Double Bed', stayTimeTitle: '이용 시간', checkInLabel: '체크인', checkIn: '15:00', checkOutLabel: '체크아웃', checkOut: '11:00', featuredAmenitiesTitle: '핵심 시설',
      images: { bedroom: 'Standard Room 침실 전경', kitchen: 'Standard Room 주방 및 싱크대', bathroom: 'Standard Room 샤워부스', laundry: 'Standard Room 세탁기 및 수납공간', overview: 'Standard Room 객실 전체 전경' },
      independence: { title: '독립적인 객실 환경', description: '객실별 냉난방, 세탁기, 주방 설비를 갖추고 있어 다른 이용객과 생활공간을 공유하지 않고 머무를 수 있습니다.' }
    },
    booking: { title: '숙박 일정', checkInLabel: '체크인', checkOutLabel: '체크아웃', selectDate: '날짜 선택', placeholder: '날짜 선택', nightsLabel: '숙박일수', nightsValue: '미선택', selectSchedule: '일정을 선택하면 숙박일수와 총금액이 계산됩니다.', selectCheckOut: '체크아웃 날짜를 선택해 주세요.', totalNights: '총 {nights} 일정입니다.', oneNight: '1박', nights: '{count}박', minStayError: '최소 1박 이상 선택해 주세요.', maxStayError: '최대 30박까지 예약할 수 있습니다.', invalidDateError: '올바른 날짜를 선택해 주세요.', checkOutAfterCheckInError: '체크아웃은 체크인 다음 날부터 선택할 수 있습니다.', checkInPastError: '오늘 이후 날짜만 선택할 수 있습니다.' },
    payment: { title: '결제 금액', roomCharge: '숙박 요금', extraCharge: '추가 요금', total: '총 결제금액', paypal: 'PayPal로 결제하기', disabledNotice: '결제 기능은 다음 단계에서 연결됩니다.', stickyTotalLabel: '총 결제금액' },
    amenities: { title: '객실 시설', items: { doubleBed: 'Double 침대', showerBooth: '샤워부스', bidetToilet: '비데 화장실', sink: '싱크대', cooktop: '하이라이트', washingMachine: '세탁기', airConditioner: '개별 에어컨', heating: '개별 난방', hotWater: '온수', wifi: '와이파이', refrigerator: '냉장·냉동고', cookware: '조리도구', tableware: '식기' } },
    pricing: { title: '요금 및 환불 정책', rateTitle: '요금 정책', rates: [{ label: 'Low', price: '70,000원', description: '오늘이 평일이고 내일도 평일' }, { label: 'Mid', price: '90,000원', description: '오늘이 휴일이고 내일이 평일' }, { label: 'High', price: '110,000원', description: '오늘과 상관없이 내일이 휴일' }], refundTitle: '환불 정책', refunds: [{ period: '체크인 6일 전까지', penalty: '위약금 없음' }, { period: '체크인 5~4일 전', penalty: '위약금 10%' }, { period: '체크인 3~2일 전', penalty: '위약금 30%' }, { period: '체크인 1일 전', penalty: '위약금 50%' }, { period: '체크인 당일', penalty: '위약금 100%' }] },
    guide: { title: '이용 안내', items: [{ title: '비대면 입실', description: '예약 확인 후 입실 방법을 별도로 안내드립니다.' }, { title: '객실 이용 수칙', description: '다음 고객을 위해 실내 비품을 깨끗하게 이용해 주세요.' }, { title: '금연', description: '모든 실내 공간은 금연이며 지정 구역 이용을 부탁드립니다.' }, { title: '소음 주의', description: '회복과 휴식을 위해 밤 시간대에는 소음을 줄여 주세요.' }, { title: '취사 가능', description: '간단한 취사가 가능하며 사용 후 정리를 부탁드립니다.' }, { title: '쓰레기 배출', description: '분리배출 기준과 배출 위치는 입실 안내에서 확인하실 수 있습니다.' }, { title: '주차 안내', description: '주차 가능 여부와 이용 방법은 예약 전 문의해 주세요.' }, { title: '체크인 안내', description: '병원 일정에 따라 입실 시간이 필요하면 사전에 문의해 주세요.' }] },
    contact: { title: '문의하기', items: [{ label: '카카오톡 문의', value: '준비 중' }, { label: '이메일 문의', value: '준비 중' }, { label: '전화 문의', value: '준비 중' }] },
    business: { title: '업체 정보', rows: [{ label: '업체명', value: '준비 중' }, { label: '대표자명', value: '준비 중' }, { label: '사업자등록번호', value: '준비 중' }, { label: '주소', value: '준비 중' }, { label: '이메일', value: '준비 중' }], terms: '이용약관', privacy: '개인정보처리방침' }
  },
  en: null as never,
  ja: null as never,
  'zh-CN': null as never
};

messages.en = { ...messages.ko, header: { ...messages.ko.header, languageCode: 'EN', languageLabel: 'Current language English. Language selector will be available later.' }, booking: { ...messages.ko.booking, checkInLabel: 'Check-in', checkOutLabel: 'Check-out', selectDate: 'Select date', placeholder: 'Select date', nightsLabel: 'Nights', nightsValue: 'Not selected', selectSchedule: 'Select dates to calculate nights and the total amount.', selectCheckOut: 'Please select a check-out date.', totalNights: 'This is a {nights} stay.', oneNight: '1 night', nights: '{count} nights', minStayError: 'Please select at least 1 night.', maxStayError: 'You can book up to 30 nights.', invalidDateError: 'Please select a valid date.', checkOutAfterCheckInError: 'Check-out must be at least one day after check-in.', checkInPastError: 'Please select today or a future date.' }, room: { ...messages.ko.room, galleryLabel: 'Standard Room image carousel', previousImage: 'Show previous room image', nextImage: 'Show next room image', goToImage: 'Show room image {index}', type: 'Standard Room', description: 'A private room designed for a comfortable stay during hospital visits and recovery periods.', bedTypeLabel: 'Bed', stayTimeTitle: 'Stay time', checkInLabel: 'Check-in', checkOutLabel: 'Check-out', featuredAmenitiesTitle: 'Featured amenities', images: { bedroom: 'Standard Room bedroom view', kitchen: 'Standard Room kitchen and sink', bathroom: 'Standard Room shower booth', laundry: 'Standard Room washer and storage area', overview: 'Standard Room overall view' }, independence: { title: 'Private room environment', description: 'The room includes individual cooling and heating, a washer, and kitchen facilities so you can stay without sharing living space with other guests.' } }, amenities: { title: 'Room amenities', items: { doubleBed: 'Double bed', showerBooth: 'Shower booth', bidetToilet: 'Bidet toilet', sink: 'Sink', cooktop: 'Cooktop', washingMachine: 'Washing machine', airConditioner: 'Individual air conditioner', heating: 'Individual heating', hotWater: 'Hot water', wifi: 'Wi-Fi', refrigerator: 'Refrigerator/freezer', cookware: 'Cookware', tableware: 'Tableware' } } };
messages.ja = { ...messages.ko, header: { ...messages.ko.header, languageCode: 'JA', languageLabel: '現在の言語は日本語です。言語選択は次の段階で提供されます。' }, booking: { ...messages.ko.booking, checkInLabel: 'チェックイン', checkOutLabel: 'チェックアウト', selectDate: '日付選択', placeholder: '日付選択', nightsLabel: '宿泊日数', nightsValue: '未選択', selectSchedule: '日程を選択すると宿泊日数と合計金額が計算されます。', selectCheckOut: 'チェックアウト日を選択してください。', totalNights: '合計{nights}の日程です。', oneNight: '1泊', nights: '{count}泊', minStayError: '最低1泊以上を選択してください。', maxStayError: '最大30泊まで予約できます。', invalidDateError: '正しい日付を選択してください。', checkOutAfterCheckInError: 'チェックアウトはチェックイン翌日以降を選択できます。', checkInPastError: '今日以降の日付を選択してください。' }, room: { ...messages.ko.room, galleryLabel: 'Standard Room 画像カルーセル', previousImage: '前の客室画像を見る', nextImage: '次の客室画像を見る', goToImage: '{index}枚目の客室画像を見る', description: '病院訪問や滞在期間中に落ち着いて過ごせる独立型の客室です。', bedTypeLabel: 'ベッド', stayTimeTitle: '利用時間', checkInLabel: 'チェックイン', checkOutLabel: 'チェックアウト', featuredAmenitiesTitle: '主な設備', images: { bedroom: 'Standard Room 寝室の様子', kitchen: 'Standard Room キッチンとシンク', bathroom: 'Standard Room シャワーブース', laundry: 'Standard Room 洗濯機と収納スペース', overview: 'Standard Room 客室全体の様子' }, independence: { title: '独立した客室環境', description: '客室ごとの冷暖房、洗濯機、キッチン設備を備えており、他の利用者と生活空間を共有せずに滞在できます。' } }, amenities: { title: '客室設備', items: { doubleBed: 'Double ベッド', showerBooth: 'シャワーブース', bidetToilet: 'ビデ付きトイレ', sink: 'シンク', cooktop: 'IHコンロ', washingMachine: '洗濯機', airConditioner: '個別エアコン', heating: '個別暖房', hotWater: '温水', wifi: 'Wi-Fi', refrigerator: '冷蔵・冷凍庫', cookware: '調理器具', tableware: '食器' } } };
messages['zh-CN'] = { ...messages.ko, header: { ...messages.ko.header, languageCode: 'ZH', languageLabel: '当前语言为简体中文，语言选择将在后续阶段提供。' }, booking: { ...messages.ko.booking, checkInLabel: '入住', checkOutLabel: '退房', selectDate: '选择日期', placeholder: '选择日期', nightsLabel: '入住晚数', nightsValue: '未选择', selectSchedule: '选择日期后将计算入住晚数和总金额。', selectCheckOut: '请选择退房日期。', totalNights: '共 {nights} 行程。', oneNight: '1晚', nights: '{count}晚', minStayError: '请至少选择1晚。', maxStayError: '最多可预订30晚。', invalidDateError: '请选择有效日期。', checkOutAfterCheckInError: '退房日期必须晚于入住日期至少一天。', checkInPastError: '请选择今天或之后的日期。' }, room: { ...messages.ko.room, galleryLabel: 'Standard Room 图片轮播', previousImage: '查看上一张客房图片', nextImage: '查看下一张客房图片', goToImage: '查看第 {index} 张客房图片', description: '适合医院访问及停留期间安心入住的独立客房。', bedTypeLabel: '床型', stayTimeTitle: '入住时间', checkInLabel: '入住', checkOutLabel: '退房', featuredAmenitiesTitle: '核心设施', images: { bedroom: 'Standard Room 卧室视图', kitchen: 'Standard Room 厨房和水槽', bathroom: 'Standard Room 淋浴间', laundry: 'Standard Room 洗衣机和收纳空间', overview: 'Standard Room 客房整体视图' }, independence: { title: '独立客房环境', description: '客房配备独立冷暖空调、洗衣机和厨房设施，无需与其他住客共享生活空间。' } }, amenities: { title: '客房设施', items: { doubleBed: 'Double 床', showerBooth: '淋浴间', bidetToilet: '智能马桶', sink: '水槽', cooktop: '电陶炉', washingMachine: '洗衣机', airConditioner: '独立空调', heating: '独立供暖', hotWater: '热水', wifi: 'Wi-Fi', refrigerator: '冷藏·冷冻冰箱', cookware: '厨具', tableware: '餐具' } } };
