import type { AmenityIcon as AmenityIconName } from '@/features/booking/roomData';

const paths: Record<AmenityIconName, React.ReactNode> = {
  bed: <><path d="M4 11h16v7" /><path d="M4 18V8a2 2 0 0 1 2-2h5v5" /><path d="M11 11V8h7a2 2 0 0 1 2 2v1" /></>,
  bath: <><path d="M5 12h14v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3Z" /><path d="M7 12V7a3 3 0 0 1 5-2" /></>,
  toilet: <><path d="M8 4h9v7a4 4 0 0 1-4 4h-1a4 4 0 0 1-4-4V4Z" /><path d="M10 15v5h6" /></>,
  sink: <><path d="M5 12h14v2a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5v-2Z" /><path d="M12 12V5h5" /></>,
  cooktop: <><rect x="5" y="5" width="14" height="14" rx="2" /><circle cx="10" cy="10" r="2" /><circle cx="15" cy="15" r="2" /></>,
  washer: <><rect x="6" y="4" width="12" height="16" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M9 7h1" /></>,
  air: <><path d="M4 8h16" /><path d="M7 12h10" /><path d="M10 16h4" /></>,
  heat: <><path d="M8 19c3-2 0-4 3-7 2-2 1-4 1-7 5 4 7 9 3 14" /></>,
  water: <><path d="M12 4s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10Z" /></>,
  wifi: <><path d="M5 9a11 11 0 0 1 14 0" /><path d="M8 12a6 6 0 0 1 8 0" /><path d="M11 16h2" /></>,
  fridge: <><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M7 10h10" /><path d="M10 7h1" /><path d="M10 14h1" /></>,
  cookware: <><path d="M5 14h11a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z" /><path d="M16 14h3" /><path d="M8 6v4" /><path d="M12 5v5" /></>,
  tableware: <><path d="M7 4v16" /><path d="M5 4v5a2 2 0 0 0 4 0V4" /><path d="M16 4v16" /><path d="M14 4h4v8h-4z" /></>,
  doorlock: <><rect x="7" y="4" width="10" height="16" rx="2" /><path d="M10 8h4" /><path d="M12 12h.01" /><path d="M10 16h4" /></>
};

export function AmenityIcon({ name }: { name: AmenityIconName }) {
  return (
    <svg className="amenityIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
