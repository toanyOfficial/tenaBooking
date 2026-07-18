export type BusinessInfoConfig = {
  companyName: string;
  representative: string;
  businessRegistrationNumber: string;
  ecommerceRegistrationNumber: string;
  address: string;
  email: string;
  phone: string;
  privacyOfficer: string;
  hostingProvider: string;
};

export const businessInfo: BusinessInfoConfig = {
  companyName: 'TOANY',
  representative: '',
  businessRegistrationNumber: '',
  ecommerceRegistrationNumber: '',
  address: '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'toany.official@toany.app',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  privacyOfficer: '',
  hostingProvider: ''
};

export const contactConfig = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'toany.official@toany.app',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  kakaoUrl: process.env.NEXT_PUBLIC_KAKAO_CONTACT_URL || '',
  businessHours: process.env.NEXT_PUBLIC_BUSINESS_HOURS || ''
};
