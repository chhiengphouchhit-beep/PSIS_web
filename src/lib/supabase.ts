import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !String(supabaseUrl).includes('YOUR_PROJECT_ID') &&
  !String(supabaseAnonKey).includes('YOUR_SUPABASE_ANON_KEY');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type AssetType =
  | 'hero'
  | 'campus'
  | 'news'
  | 'partner'
  | 'student-life'
  | 'gallery'
  | 'logo';

export type CmsAsset = {
  id: string;
  title: string;
  type: AssetType;
  url: string;
  path: string;
  campus?: string | null;
  section?: string | null;
  created_at?: string;
};

export async function uploadCmsImage(params: {
  file: File;
  title: string;
  type: AssetType;
  campus?: string;
  section?: string;
}) {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
  }

  const safeName = params.file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-');

  const filePath = `${params.type}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('psis-assets')
    .upload(filePath, params.file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage
    .from('psis-assets')
    .getPublicUrl(filePath);

  const assetPayload = {
    title: params.title,
    type: params.type,
    url: publicData.publicUrl,
    path: filePath,
    campus: params.campus || null,
    section: params.section || null,
  };

  const { data, error } = await supabase
    .from('cms_assets')
    .insert(assetPayload)
    .select()
    .single();

  if (error) throw error;

  return data as CmsAsset;
}

export async function getCmsAssets(type?: AssetType) {
  if (!supabase) return [];

  let query = supabase
    .from('cms_assets')
    .select('*')
    .order('created_at', { ascending: false });

  if (type) query = query.eq('type', type);

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as CmsAsset[];
}

export async function deleteCmsAsset(asset: CmsAsset) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  if (asset.path) {
    await supabase.storage.from('psis-assets').remove([asset.path]);
  }

  const { error } = await supabase
    .from('cms_assets')
    .delete()
    .eq('id', asset.id);

  if (error) throw error;
}

export type Inquiry = {
  id?: string;
  parent_name: string;
  student_name: string;
  student_age: number;
  phone: string;
  email?: string;
  campus: string;
  program: string;
  notes?: string;
  status: 'New' | 'Contacted' | 'Tour Booked' | 'Enrolled' | 'Junk';
  assigned_admin?: string | null;
  created_at?: string;
};

export async function insertInquiry(inquiry: Inquiry) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('inquiries')
    .insert(inquiry)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getInquiries() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateInquiryStatus(id: string, status: Inquiry['status'], assignedAdmin?: string, notes?: string) {
  if (!supabase) return null;
  const updatePayload: Partial<Inquiry> = { status };
  if (assignedAdmin !== undefined) {
    updatePayload.assigned_admin = assignedAdmin;
  }
  if (notes !== undefined) {
    updatePayload.notes = notes;
  }
  const { data, error } = await supabase
    .from('inquiries')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

