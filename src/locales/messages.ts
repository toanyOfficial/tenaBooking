export const defaultLocale = 'ko' as const;

export const locales = ['ko', 'en', 'ja', 'zh-CN'] as const;

export type Locale = (typeof locales)[number];

export const messages: Record<Locale, {
  brand: string;
  sections: {
    language: string;
    dates: string;
    roomImage: string;
    roomInfo: string;
    payment: string;
    policy: string;
    notice: string;
    contact: string;
  };
}> = {
  ko: {
    brand: 'Premium Medical Stay',
    sections: {
      language: '언어 선택',
      dates: '날짜 선택',
      roomImage: '객실 이미지',
      roomInfo: '객실 정보',
      payment: '결제 금액',
      policy: '요금 및 환불 정책',
      notice: '안내문구',
      contact: '문의 및 업체정보'
    }
  },
  en: {
    brand: 'Premium Medical Stay',
    sections: {
      language: 'Language',
      dates: 'Dates',
      roomImage: 'Room images',
      roomInfo: 'Room information',
      payment: 'Payment amount',
      policy: 'Rates and refund policy',
      notice: 'Notice',
      contact: 'Contact and business information'
    }
  },
  ja: {
    brand: 'Premium Medical Stay',
    sections: {
      language: '言語選択',
      dates: '日付選択',
      roomImage: '客室画像',
      roomInfo: '客室情報',
      payment: '決済金額',
      policy: '料金・返金ポリシー',
      notice: 'ご案内',
      contact: 'お問い合わせ・事業者情報'
    }
  },
  'zh-CN': {
    brand: 'Premium Medical Stay',
    sections: {
      language: '语言选择',
      dates: '日期选择',
      roomImage: '客房图片',
      roomInfo: '客房信息',
      payment: '支付金额',
      policy: '费用及退款政策',
      notice: '提示信息',
      contact: '咨询及商家信息'
    }
  }
};
