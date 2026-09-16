import { useCallback, useEffect, useState } from 'react';
import { convertGoogleDriveUrl } from '../utils/images';

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

const GOOGLE_SHEET_API_URL =
  import.meta.env.VITE_GOOGLE_SHEET_CMS_API_URL ||
  'https://script.google.com/macros/s/AKfycbzWVrVwcXPe7oOA0BIWac2VuzjO1RmGesqUDQ2oxiC3Wo1ucEn1QBfy-fwrCxDgNZzA/exec';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

type RawImageLibraryItem = Partial<Record<string, unknown>>;

function isConfiguredApiUrl() {
  return Boolean(GOOGLE_SHEET_API_URL);
}

function valueAsString(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
}

function normalizeCategory(category: string): string {
  return category.trim().toLowerCase().replace(/\s+/g, ' ');
}

function isActiveStatus(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return !normalized || normalized === 'active';
}

function normalizeItem(item: RawImageLibraryItem, index: number): ImageLibraryItem {
  const imageUrl =
    valueAsString(item.imageUrl) ||
    valueAsString(item.image_url) ||
    valueAsString(item.url) ||
    valueAsString(item.ImageURL) ||
    valueAsString(item['Image URL']);

  const directImageUrl =
    valueAsString(item.directImageUrl) ||
    valueAsString(item.direct_image_url) ||
    valueAsString(item.DirectImageUrl) ||
    valueAsString(item.DirectImageURL) ||
    valueAsString(item['Direct Image URL']) ||
    convertGoogleDriveUrl(imageUrl);

  const priority = Number(
    valueAsString(item.priority) ||
    valueAsString(item.Priority) ||
    valueAsString(item.PRIORITY) ||
    index + 1
  );

  return {
    id: Number(valueAsString(item.id) || valueAsString(item.ID) || index + 1),
    title: valueAsString(item.title) || valueAsString(item.Title),
    category: valueAsString(item.category) || valueAsString(item.Category),
    campus: valueAsString(item.campus) || valueAsString(item.Campus),
    imageUrl,
    directImageUrl: convertGoogleDriveUrl(directImageUrl),
    priority: Number.isFinite(priority) ? priority : index + 1,
    status: valueAsString(item.status) || valueAsString(item.Status),
    createdAt: valueAsString(item.createdAt) || valueAsString(item.CreatedAt) || valueAsString(item['Created At']),
  };
}

function unwrapItems(payload: unknown): RawImageLibraryItem[] {
  if (Array.isArray(payload)) return payload as RawImageLibraryItem[];
  if (!payload || typeof payload !== 'object') return [];

  const wrapped = payload as Partial<Record<'data' | 'items' | 'records' | 'images', unknown>>;
  const source = wrapped.data || wrapped.items || wrapped.records || wrapped.images;
  return Array.isArray(source) ? (source as RawImageLibraryItem[]) : [];
}

function sortByPriority(items: ImageLibraryItem[]): ImageLibraryItem[] {
  return [...items].sort((a, b) => {
    const priorityDiff = (a.priority || 9999) - (b.priority || 9999);
    if (priorityDiff !== 0) return priorityDiff;
    return a.id - b.id;
  });
}

async function readJsonResponse(response: Response) {
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Google Sheet CMS request failed: ${response.status}`);
  }

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    throw new Error('Google Sheet CMS returned a non-JSON response. Redeploy the Apps Script web app and check access permissions.');
  }
}

async function postToGoogleSheet(body: Record<string, unknown>) {
  const response = await fetch(GOOGLE_SHEET_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  return readJsonResponse(response);
}

function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.trim().toLowerCase();
  if (lower.includes('supabase.co')) return false;
  if (lower.includes('drive.google.com')) return false;
  if (lower.includes('unsplash.com')) return false;
  return true;
}

async function fetchImageLibrary(): Promise<ImageLibraryItem[]> {
  if (!isConfiguredApiUrl()) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(GOOGLE_SHEET_API_URL, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const payload = await readJsonResponse(response);
    return unwrapItems(payload)
      .map(normalizeItem)
      .filter((item) => isActiveStatus(item.status) && isValidImageUrl(item.directImageUrl));
  } catch {
    return [];
  }
}

function filterByCategories(items: ImageLibraryItem[], categories: string[]) {
  const accepted = new Set(categories.map(normalizeCategory));
  return sortByPriority(items.filter((item) => accepted.has(normalizeCategory(item.category))));
}

function byCategories(categories: string[]) {
  return async () => {
    const items = await fetchImageLibrary();
    return filterByCategories(items, categories);
  };
}

export const getHeroBanners = async () => {
  const items = await fetchImageLibrary();
  return filterByCategories(items, ['Hero Banner']);
};
export const getCampusGallery = byCategories(['Campus Gallery']);
export const getPartnerLogos = byCategories(['Partner Logo', 'Partner Logos', 'AYLA Logo', 'AYLA Logos']);
export const getNews = byCategories(['News']);
export const getStudentLife = byCategories(['Student Life']);
export const getAllImageLibraryItems = fetchImageLibrary;

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
  if (!isConfiguredApiUrl()) return;

  await postToGoogleSheet({
    action: 'updateImage',
    ...params,
    CreatedAt: params.createdAt,
  });
}

export async function saveImageLibraryItem(params: ImageLibraryItem) {
  if (!isConfiguredApiUrl()) return;

  await postToGoogleSheet({
    action: 'saveImage',
    ID: params.id,
    Title: params.title,
    Category: params.category,
    Campus: params.campus,
    ImageURL: params.imageUrl,
    DirectImageURL: params.directImageUrl,
    Priority: params.priority,
    Status: params.status,
    CreatedAt: params.createdAt,
  });
}

export async function uploadImageToGoogleDrive(params: {
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
  if (!isConfiguredApiUrl()) return null;

  const payload = await postToGoogleSheet({
    action: 'uploadImage',
    ...params,
  });

  const saved = Array.isArray(payload) ? payload[0] : payload.data || payload.item || payload;
  return saved ? normalizeItem(saved, 0) : null;
}

export async function saveAdmissionAssistantLead(params: {
  name: string;
  phone: string;
  question: string;
  language: 'en' | 'kh';
  createdAt: string;
}) {
  if (!isConfiguredApiUrl()) return;

  await postToGoogleSheet({
    action: 'saveLead',
    Name: params.name,
    Phone: params.phone,
    Question: params.question,
    Language: params.language,
    Source: 'AI Admission Assistant',
    Status: 'New',
    CreatedAt: params.createdAt,
  });
}

export function useGoogleSheetCMS() {
  const [heroBanners, setHeroBanners] = useState<ImageLibraryItem[]>([]);
  const [campusGallery, setCampusGallery] = useState<ImageLibraryItem[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<ImageLibraryItem[]>([]);
  const [news, setNews] = useState<ImageLibraryItem[]>([]);
  const [studentLife, setStudentLife] = useState<ImageLibraryItem[]>([]);
  const [allImages, setAllImages] = useState<ImageLibraryItem[]>([]);
  const [loading, setLoading] = useState(isConfiguredApiUrl());
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isConfiguredApiUrl()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const allItems = await getAllImageLibraryItems();
      const hero = filterByCategories(allItems, ['Hero Banner']);
      const gallery = filterByCategories(allItems, ['Campus Gallery']);
      const partners = filterByCategories(allItems, ['Partner Logo', 'Partner Logos', 'AYLA Logo', 'AYLA Logos']);
      const newsItems = filterByCategories(allItems, ['News']);
      const life = filterByCategories(allItems, ['Student Life']);
      setHeroBanners(hero);
      setCampusGallery(gallery);
      setPartnerLogos(partners);
      setNews(newsItems);
      setStudentLife(life);
      setAllImages(allItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Sheet CMS request failed');
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
