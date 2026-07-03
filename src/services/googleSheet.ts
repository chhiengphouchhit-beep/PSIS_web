import { useCallback, useEffect, useState } from 'react';
import { convertGoogleDriveUrl } from '../utils/images';
import { supabase, isSupabaseConfigured, CmsAsset, AssetType } from '../lib/supabase';

export { convertGoogleDriveUrl };

export interface ImageLibraryItem {
  id: number;
  title: string;
  category: string;
  campus: string;
  imageUrl: string;
  directImageUrl: string;
  priority: number;
  status: string;
  createdAt: string;
}

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

function mapCmsAssetToImageLibraryItem(asset: CmsAsset, index: number): ImageLibraryItem {
  const categoryMap: Record<string, string> = {
    hero: 'Hero Banner',
    campus: 'Campus Gallery',
    gallery: 'Campus Gallery',
    partner: 'Partner Logo',
    logo: 'AYLA Logo',
    news: 'News',
    'student-life': 'Student Life',
  };

  const category = categoryMap[(asset.type as string) || 'gallery'] || 'Campus Gallery';

  return {
    id: index + 1,
    title: asset.title || '',
    category,
    campus: asset.campus || '',
    imageUrl: asset.url || '',
    directImageUrl: asset.url || '',
    priority: asset.section ? Number(asset.section) || index + 1 : index + 1,
    status: 'Active',
    createdAt: asset.created_at || new Date().toISOString(),
  };
}

async function fetchImageLibraryFromSupabase(): Promise<ImageLibraryItem[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase.from('cms_assets').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  const assets = (data || []) as CmsAsset[];
  return assets.map(mapCmsAssetToImageLibraryItem);
}

function filterByCategories(items: ImageLibraryItem[], categories: string[]) {
  const accepted = new Set(categories.map((c) => c.trim().toLowerCase()));
  return items.filter((item) => accepted.has(item.category.trim().toLowerCase()));
}

export const getHeroBanners = async () => {
  const items = await fetchImageLibraryFromSupabase();
  return filterByCategories(items, ['Hero Banner']);
};
export const getCampusGallery = async () => {
  const items = await fetchImageLibraryFromSupabase();
  return filterByCategories(items, ['Campus Gallery']);
};
export const getPartnerLogos = async () => {
  const items = await fetchImageLibraryFromSupabase();
  return filterByCategories(items, ['Partner Logo', 'AYLA Logo']);
};
export const getNews = async () => {
  const items = await fetchImageLibraryFromSupabase();
  return filterByCategories(items, ['News']);
};
export const getStudentLife = async () => {
  const items = await fetchImageLibraryFromSupabase();
  return filterByCategories(items, ['Student Life']);
};
export const getAllImageLibraryItems = fetchImageLibraryFromSupabase;

export async function updateImageLibraryItemImage(params: {
  id?: number;
  title: string;
  category: string;
  campus?: string;
  imageUrl: string;
  directImageUrl: string;
  priority?: number;
  status?: string;
  createdAt?: string;
}) {
  if (!isSupabaseConfigured || !supabase) return;

  const typeMap: Record<string, AssetType> = {
    'Hero Banner': 'hero',
    'Campus Gallery': 'gallery',
    'Campus Image': 'campus',
    'Partner Logo': 'partner',
    'AYLA Logo': 'logo',
    News: 'news',
    'Student Life': 'student-life',
  };

  const type = typeMap[params.category] || 'gallery';

  // Try to find an existing asset by URL
  const { data: existing, error: findErr } = await supabase.from('cms_assets').select('*').eq('url', params.directImageUrl).limit(1).single();
  if (findErr && (findErr as any).code !== 'PGRST116') {
    // ignore not found
  }

  if (existing && (existing as any).id) {
    await supabase.from('cms_assets').update({
      title: params.title,
      type,
      url: params.directImageUrl,
      path: params.directImageUrl || '',
      campus: params.campus || null,
      section: params.priority ? String(params.priority) : null,
      created_at: params.createdAt || undefined,
    }).eq('id', (existing as any).id);
    return;
  }

  await supabase.from('cms_assets').insert({
    title: params.title,
    type,
    url: params.directImageUrl,
    path: params.directImageUrl || '',
    campus: params.campus || null,
    section: params.priority ? String(params.priority) : null,
    created_at: params.createdAt || undefined,
  });
}

export async function saveImageLibraryItem(params: ImageLibraryItem) {
  if (!isSupabaseConfigured || !supabase) return;

  const typeMap: Record<string, AssetType> = {
    'Hero Banner': 'hero',
    'Campus Gallery': 'gallery',
    'Campus Image': 'campus',
    'Partner Logo': 'partner',
    'AYLA Logo': 'logo',
    News: 'news',
    'Student Life': 'student-life',
  };

  const type = typeMap[params.category] || 'gallery';

  // If an asset with the same direct URL exists, update it, otherwise insert
  const { data: existing } = await supabase.from('cms_assets').select('*').eq('url', params.directImageUrl).limit(1).single();

  if (existing && (existing as any).id) {
    await supabase.from('cms_assets').update({
      title: params.title,
      type,
      url: params.directImageUrl,
      path: params.directImageUrl || '',
      campus: params.campus || null,
      section: params.priority ? String(params.priority) : null,
      created_at: params.createdAt || undefined,
    }).eq('id', (existing as any).id);
    return;
  }

  await supabase.from('cms_assets').insert({
    title: params.title,
    type,
    url: params.directImageUrl,
    path: params.directImageUrl || '',
    campus: params.campus || null,
    section: params.priority ? String(params.priority) : null,
    created_at: params.createdAt || undefined,
  });
}

export async function uploadImageToGoogleDrive(_params: {
  fileName: string;
  mimeType: string;
  base64: string;
  title: string;
  category: string;
  campus: string;
  priority: number;
  status: string;
  createdAt?: string;
}): Promise<ImageLibraryItem | null> {
  // Google Drive upload is removed. Use Supabase storage via `uploadCmsImage` in `src/lib/supabase.ts` instead.
  return null;
}

export async function saveAdmissionAssistantLead(params: {
  name: string;
  phone: string;
  question: string;
  language: 'en' | 'kh';
  createdAt: string;
}) {
  if (!isSupabaseConfigured || !supabase) return;

  // Store assistant leads into the `inquiries` table as a lightweight fallback
  await supabase.from('inquiries').insert({
    parent_name: params.name,
    student_name: params.name,
    student_age: 0,
    phone: params.phone,
    email: null,
    campus: 'AI Assistant',
    program: params.language === 'en' ? 'AI Assistant' : 'AI Assistant (KH)',
    notes: params.question,
    status: 'New',
    assigned_admin: null,
    created_at: params.createdAt,
  });
}

export function useGoogleSheetCMS() {
  const [heroBanners, setHeroBanners] = useState<ImageLibraryItem[]>([]);
  const [campusGallery, setCampusGallery] = useState<ImageLibraryItem[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<ImageLibraryItem[]>([]);
  const [news, setNews] = useState<ImageLibraryItem[]>([]);
  const [studentLife, setStudentLife] = useState<ImageLibraryItem[]>([]);
  const [allImages, setAllImages] = useState<ImageLibraryItem[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const allItems = await getAllImageLibraryItems();
      setHeroBanners(filterByCategories(allItems, ['Hero Banner']));
      setCampusGallery(filterByCategories(allItems, ['Campus Gallery']));
      setPartnerLogos(filterByCategories(allItems, ['Partner Logo', 'AYLA Logo']));
      setNews(filterByCategories(allItems, ['News']));
      setStudentLife(filterByCategories(allItems, ['Student Life']));
      setAllImages(allItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return {
    heroBanners,
    campusGallery,
    partnerLogos,
    news,
    studentLife,
    allImages,
    loading,
    error,
    refresh,
  };
}
