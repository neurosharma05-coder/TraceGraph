export interface EvidenceSource {
  id: string;
  name: string;
  category: 'mobile' | 'social' | 'cctv' | 'cloud' | 'financial' | 'email' | 'network';
  iconSvg: string;
}

export const EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    id: 'mobile',
    name: 'Mobile',
    category: 'mobile',
    iconSvg: '<rect x="8" y="3" width="8" height="18" rx="2"/><circle cx="12" cy="18" r="1"/>',
  },
  {
    id: 'social',
    name: 'Social media',
    category: 'social',
    iconSvg: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 15-5 16 0"/>',
  },
  {
    id: 'cctv',
    name: 'CCTV',
    category: 'cctv',
    iconSvg: '<rect x="3" y="8" width="14" height="8" rx="2"/><path d="M17 11l4-2v6l-4-2"/>',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'cloud',
    iconSvg: '<path d="M7 18a4 4 0 010-8 5 5 0 019-1 4.5 4.5 0 01-1 9Z"/>',
  },
  {
    id: 'financial',
    name: 'Financial records',
    category: 'financial',
    iconSvg: '<path d="M6 4h12M6 9h12M10 9c6 0 6 7-4 7l8 5"/>',
  },
  {
    id: 'email',
    name: 'Emails',
    category: 'email',
    iconSvg: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  },
  {
    id: 'network',
    name: 'Network logs',
    category: 'network',
    iconSvg: '<rect x="9" y="3" width="6" height="5"/><rect x="3" y="16" width="6" height="5"/><rect x="15" y="16" width="6" height="5"/><path d="M12 8v4M6 16v-4h12v4"/>',
  },
];

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

