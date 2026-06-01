import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Copy, Edit3, ImagePlus, Link2, Save, Trash2, X } from 'lucide-react';
import {
  ACADEMIC_PROGRAMS,
  STEM_RESOURCES,
  getPersistedImageAssets,
  savePersistedImageAssets,
} from '../mockData';
import { convertGoogleDriveUrl } from '../utils/images';
import { ImageLibraryItem, saveImageLibraryItem, uploadImageToGoogleDrive, useGoogleSheetCMS } from '../services/googleSheet';
import { ImageAsset, ImageAssetCategory } from '../types';

const imageCategories: ImageAssetCategory[] = [
  'Hero Banner',
  'Campus Gallery',
  'Partner Logo',
  'AYLA Logo',
  'News',
  'Student Life',
  'Header Logo',
  'Campus Image',
  'Academic Program',
  'STEM Resource',
  'Admissions Image',
];

const categoryOrder = new Map(imageCategories.map((category, index) => [category, index]));

type WebsiteImageLocation = {
  key: string;
  label: string;
  title: string;
  category: ImageAssetCategory;
  campus: string;
  priority: number;
};

type ProductionImageManagerProps = {
  campuses?: { name: string }[];
  onAssetsUpdate?: () => void;
};

const emptyForm = {
  id: '',
  title: 'Homepage Hero Banner',
  category: 'Hero Banner' as ImageAssetCategory,
  campus: '',
  imageUrl: '',
  priority: '1',
  status: 'Active',
};

function sheetItemToAsset(item: ImageLibraryItem): ImageAsset {
  return {
    id: String(item.id),
    title: item.title,
    originalUrl: item.imageUrl || item.directImageUrl,
    url: convertGoogleDriveUrl(item.directImageUrl || item.imageUrl),
    category: item.category as ImageAssetCategory,
    campus: item.campus,
    priority: item.priority,
    status: item.status || 'Active',
    createdAt: item.createdAt || new Date().toISOString(),
    storageProvider: /drive\.google\.com/i.test(item.imageUrl || item.directImageUrl) ? 'google-drive' : 'external-url',
  };
}

function mergeAssets(localAssets: ImageAsset[], sheetAssets: ImageAsset[]): ImageAsset[] {
  const merged = new Map<string, ImageAsset>();
  sheetAssets.forEach((asset) => merged.set(asset.id, asset));
  localAssets.forEach((asset) => merged.set(asset.id, asset));
  return Array.from(merged.values());
}

function AssetImage({
  imageUrl,
  title,
  className,
}: {
  imageUrl: string;
  title: string;
  className: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center border border-dashed border-slate-700 bg-slate-900 text-center text-xs font-bold uppercase tracking-wider text-slate-500`}>
        Image not available
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

export default function ProductionImageManager({ campuses = [], onAssetsUpdate }: ProductionImageManagerProps) {
  const googleSheetCMS = useGoogleSheetCMS();
  const [assets, setAssets] = useState<ImageAsset[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedLocationKey, setSelectedLocationKey] = useState('hero-banner');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [changeImageAsset, setChangeImageAsset] = useState<ImageAsset | null>(null);
  const [changeImageUrl, setChangeImageUrl] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [infoAsset, setInfoAsset] = useState<ImageAsset | null>(null);
  const [infoForm, setInfoForm] = useState({ title: '', category: 'Hero Banner' as ImageAssetCategory, campus: '', priority: '1', status: 'Active' });
  const [message, setMessage] = useState('');

  const previewUrl = useMemo(() => convertGoogleDriveUrl(form.imageUrl), [form.imageUrl]);
  const changePreviewUrl = useMemo(() => convertGoogleDriveUrl(changeImageUrl), [changeImageUrl]);
  const websiteLocations = useMemo<WebsiteImageLocation[]>(() => {
    const campusList = campuses.length > 0
      ? campuses.map((campus, index) => ({ name: campus.name, priority: index + 1 }))
      : [
          { name: 'TK Campus', priority: 1 },
          { name: 'TTP Campus', priority: 2 },
          { name: 'Chbar Ampov Campus', priority: 3 },
          { name: 'Russey Keo Campus', priority: 4 },
          { name: 'National Road 3 Campus', priority: 5 },
          { name: 'Battambang Campus', priority: 6 },
        ];

    return [
      {
        key: 'header-logo',
        label: 'Global Header - School Logo',
        title: 'PSIS Header Logo',
        category: 'Header Logo',
        campus: '',
        priority: 1,
      },
      {
        key: 'hero-banner',
        label: 'Homepage - Hero Banner',
        title: 'Homepage Hero Banner',
        category: 'Hero Banner',
        campus: '',
        priority: 1,
      },
      ...campusList.map((campus) => ({
        key: `campus-image-${campus.priority}`,
        label: `Campuses Page - Main Campus Photo - ${campus.name}`,
        title: `${campus.name} Main Photo`,
        category: 'Campus Image' as ImageAssetCategory,
        campus: campus.name,
        priority: campus.priority,
      })),
      ...campusList.map((campus) => ({
        key: `campus-gallery-${campus.priority}`,
        label: `Homepage - Campus Gallery - ${campus.name}`,
        title: `${campus.name} Gallery Image`,
        category: 'Campus Gallery' as ImageAssetCategory,
        campus: campus.name,
        priority: campus.priority,
      })),
      {
        key: 'partner-logo',
        label: 'Homepage - Partner Logos',
        title: 'Partner Logo',
        category: 'Partner Logo',
        campus: '',
        priority: 1,
      },
      {
        key: 'ayla-logo',
        label: 'Homepage - AYLA Logo',
        title: 'AYLA Logo',
        category: 'AYLA Logo',
        campus: '',
        priority: 1,
      },
      ...ACADEMIC_PROGRAMS.map((program, index) => ({
        key: `academic-${program.id}`,
        label: `Academics Page - ${program.name}`,
        title: `${program.name} Image`,
        category: 'Academic Program' as ImageAssetCategory,
        campus: program.id,
        priority: index + 1,
      })),
      ...STEM_RESOURCES.map((kit, index) => ({
        key: `stem-${kit.id}`,
        label: `STEM Page - ${kit.name}`,
        title: `${kit.name} Image`,
        category: 'STEM Resource' as ImageAssetCategory,
        campus: kit.id,
        priority: index + 1,
      })),
      ...['Robotics Lab', 'Student Leadership', 'Arts & Music', 'Sports & Teamwork', 'Field Trips'].map((title, index) => ({
        key: `student-life-${index + 1}`,
        label: `Homepage - Student Life - ${title}`,
        title,
        category: 'Student Life' as ImageAssetCategory,
        campus: '',
        priority: index + 1,
      })),
      ...['News Cover 1', 'News Cover 2', 'News Cover 3'].map((title, index) => ({
        key: `news-cover-${index + 1}`,
        label: `Homepage - News Section - ${title}`,
        title,
        category: 'News' as ImageAssetCategory,
        campus: '',
        priority: index + 1,
      })),
      {
        key: 'admissions-image',
        label: 'Apply Page - Admissions Image',
        title: 'Admissions Image',
        category: 'Admissions Image',
        campus: '',
        priority: 1,
      },
    ];
  }, [campuses]);
  const orderedAssets = useMemo(
    () =>
      [...assets].sort((a, b) => {
        const categoryDiff = (categoryOrder.get(a.category) ?? 999) - (categoryOrder.get(b.category) ?? 999);
        if (categoryDiff !== 0) return categoryDiff;

        const priorityDiff = (a.priority || 9999) - (b.priority || 9999);
        if (priorityDiff !== 0) return priorityDiff;

        return a.title.localeCompare(b.title);
      }),
    [assets]
  );

  function loadAssets() {
    const normalizedAssets = getPersistedImageAssets().map((asset) => ({
      ...asset,
      url: convertGoogleDriveUrl(asset.originalUrl || asset.url),
    }));
    const sheetAssets = googleSheetCMS.allImages.map(sheetItemToAsset);
    savePersistedImageAssets(normalizedAssets);
    setAssets(mergeAssets(normalizedAssets, sheetAssets));
  }

  useEffect(() => {
    loadAssets();
  }, [googleSheetCMS.allImages]);

  function resetForm() {
    const location = websiteLocations.find((item) => item.key === selectedLocationKey);
    const existing = location ? findLocationAsset(location) : undefined;
    setForm({
      ...emptyForm,
      id: existing?.id || '',
      title: existing?.title || location?.title || emptyForm.title,
      category: location?.category || emptyForm.category,
      campus: location?.campus || '',
      imageUrl: existing?.originalUrl || existing?.url || '',
      priority: String(location?.priority || 1),
      status: existing?.status || 'Active',
    });
    setEditingId(null);
  }

  function findLocationAsset(location: WebsiteImageLocation, sourceAssets = assets) {
    return sourceAssets.find((asset) =>
      asset.category === location.category &&
      (asset.campus || '') === location.campus &&
      (asset.priority || 1) === location.priority
    );
  }

  function handleSelectLocation(locationKey: string) {
    setSelectedLocationKey(locationKey);
    const location = websiteLocations.find((item) => item.key === locationKey);
    if (!location) return;

    const existing = findLocationAsset(location);
    setEditingId(existing?.id || null);
    setForm((current) => ({
      ...current,
      id: existing?.id || '',
      title: existing?.title || location.title,
      category: location.category,
      campus: location.campus,
      imageUrl: existing?.originalUrl || existing?.url || current.imageUrl,
      priority: String(location.priority),
      status: existing?.status || 'Active',
    }));
  }

  function persist(nextAssets: ImageAsset[], logMessage: string) {
    savePersistedImageAssets(nextAssets);
    setAssets(nextAssets);
    setMessage(logMessage);
    onAssetsUpdate?.();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const title = form.title.trim();
    const originalUrl = form.imageUrl.trim();
    const convertedUrl = convertGoogleDriveUrl(originalUrl);
    const selectedLocation = websiteLocations.find((location) => location.key === selectedLocationKey);
    const locationAsset = selectedLocation ? findLocationAsset(selectedLocation) : undefined;
    const recordId = form.id.trim() || editingId || locationAsset?.id || String(Date.now());
    const priority = Number(form.priority) || 1;
    const createdAt = editingId
      ? assets.find((item) => item.id === editingId)?.createdAt || new Date().toISOString()
      : new Date().toISOString();

    if (!title || !convertedUrl) {
      setMessage('Please add a title and image URL.');
      return;
    }

    const asset: ImageAsset = {
      id: recordId,
      title,
      originalUrl,
      url: convertedUrl,
      category: form.category,
      campus: form.campus,
      priority,
      status: form.status,
      createdAt,
      storageProvider: /drive\.google\.com/i.test(originalUrl) ? 'google-drive' : 'external-url',
    };

    const nextAssets = editingId
      ? assets.map((item) => (item.id === editingId ? asset : item))
      : [asset, ...assets];

    persist(nextAssets, editingId ? 'Image record updated.' : 'Image record saved.');
    try {
      await saveImageLibraryItem({
        id: Number(recordId) || Date.now(),
        title,
        category: form.category,
        campus: form.campus,
        imageUrl: originalUrl,
        directImageUrl: convertedUrl,
        priority,
        status: form.status,
        createdAt,
      });
    } catch (error) {
      setMessage('Saved locally. Google Sheet save failed; redeploy Apps Script and try Refresh.');
    }
    resetForm();
  }

  function handleEdit(asset: ImageAsset) {
    setInfoAsset(asset);
    setInfoForm({
      title: asset.title,
      category: asset.category,
      campus: asset.campus,
      priority: String(asset.priority || 1),
      status: asset.status || 'Active',
    });
    setMessage('');
  }

  function handleOpenChangeImage(asset: ImageAsset) {
    setChangeImageAsset(asset);
    setChangeImageUrl(asset.originalUrl || asset.url);
    setMessage('');
  }

  async function handleSaveCardImage() {
    if (!changeImageAsset) return;

    const originalUrl = changeImageUrl.trim();
    const convertedUrl = convertGoogleDriveUrl(originalUrl);
    if (!convertedUrl) {
      setMessage('Please paste a Google Drive image URL.');
      return;
    }

    const updated = assets.map((asset) =>
      asset.id === changeImageAsset.id
        ? {
            ...asset,
            originalUrl,
            url: convertedUrl,
            storageProvider: /drive\.google\.com/i.test(originalUrl) ? 'google-drive' as const : 'external-url' as const,
          }
        : asset
    );

    persist(updated, 'Image changed successfully.');
    try {
      await saveImageLibraryItem({
        id: Number(changeImageAsset.id) || Date.now(),
        title: changeImageAsset.title,
        category: changeImageAsset.category,
        campus: changeImageAsset.campus,
        imageUrl: originalUrl,
        directImageUrl: convertedUrl,
        priority: changeImageAsset.priority || 1,
        status: changeImageAsset.status || 'Active',
        createdAt: changeImageAsset.createdAt,
      });
    } catch (error) {
      setMessage('Image changed locally. Google Sheet save failed; redeploy Apps Script and try Refresh.');
    }
    setChangeImageAsset(null);
    setChangeImageUrl('');
  }

  async function handleSaveInfo() {
    if (!infoAsset) return;

    const title = infoForm.title.trim();
    if (!title) {
      setMessage('Title is required.');
      return;
    }

    const updated = assets.map((asset) =>
      asset.id === infoAsset.id
        ? {
            ...asset,
            title,
            category: infoForm.category,
            campus: infoForm.campus,
            priority: Number(infoForm.priority) || 1,
            status: infoForm.status,
          }
        : asset
    );

    persist(updated, 'Image info updated.');
    try {
      await saveImageLibraryItem({
        id: Number(infoAsset.id) || Date.now(),
        title,
        category: infoForm.category,
        campus: infoForm.campus,
        imageUrl: infoAsset.originalUrl || infoAsset.url,
        directImageUrl: infoAsset.url,
        priority: Number(infoForm.priority) || 1,
        status: infoForm.status,
        createdAt: infoAsset.createdAt,
      });
    } catch (error) {
      setMessage('Info updated locally. Google Sheet save failed; redeploy Apps Script and try Refresh.');
    }
    setInfoAsset(null);
  }

  async function handleCopyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage('Image URL copied.');
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function upsertUploadedAsset(existing: ImageAsset | null, uploaded: NonNullable<Awaited<ReturnType<typeof uploadImageToGoogleDrive>>>) {
    const nextAsset: ImageAsset = {
      id: String(uploaded.id),
      title: uploaded.title,
      category: uploaded.category as ImageAssetCategory,
      campus: uploaded.campus,
      originalUrl: uploaded.imageUrl,
      url: uploaded.directImageUrl,
      priority: uploaded.priority,
      status: uploaded.status,
      createdAt: uploaded.createdAt || existing?.createdAt || new Date().toISOString(),
      storageProvider: 'google-drive',
    };
    const updated = existing
      ? assets.map((asset) => (asset.id === existing.id ? nextAsset : asset))
      : [nextAsset, ...assets];
    persist(updated, 'Image uploaded to Google Drive and saved to Google Sheet.');
  }

  async function handleUploadFile(file: File, target: ImageAsset | null) {
    setUploadingId(target?.id || 'new');
    try {
      const base64 = await fileToBase64(file);
      const uploaded = await uploadImageToGoogleDrive({
        fileName: file.name,
        mimeType: file.type,
        base64,
        title: target?.title || form.title || file.name,
        category: target?.category || form.category,
        campus: target?.campus || form.campus,
        priority: target?.priority || Number(form.priority) || 1,
        status: target?.status || form.status,
        createdAt: target?.createdAt || new Date().toISOString(),
      });

      if (!uploaded) {
        setMessage('Upload API is not ready. Update and redeploy the Google Apps Script first.');
        return;
      }

      upsertUploadedAsset(target, uploaded);
      setChangeImageAsset(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setUploadingId(null);
    }
  }

  function handleDelete(assetId: string) {
    if (!confirm('Delete this image record?')) return;
    persist(assets.filter((asset) => asset.id !== assetId), 'Image record deleted.');
    if (editingId === assetId) resetForm();
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950 p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Image Library</p>
          <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-wide text-white">Google Drive Image Assets</h2>
          <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-400">
            Choose the website location, paste the image link, and save. The CMS fills category, campus, and priority automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            loadAssets();
            googleSheetCMS.refresh();
          }}
          className="rounded bg-slate-900 px-4 py-2 text-xs font-extrabold uppercase text-slate-200 transition hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>
      {googleSheetCMS.error && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-bold text-amber-200">
          Google Sheet CMS: {googleSheetCMS.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-5 lg:grid-cols-4">
        <label className="block lg:col-span-4">
          <span className="mb-1 block text-[10px] font-bold uppercase text-brand-gold">Website Location</span>
          <select
            value={selectedLocationKey}
            onChange={(event) => handleSelectLocation(event.target.value)}
            className="w-full rounded border border-brand-gold/40 bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none focus:border-brand-gold"
          >
            {websiteLocations.map((location) => (
              <option key={location.key} value={location.key}>{location.label}</option>
            ))}
          </select>
          <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-500">
            Auto saves to the selected website area. Advanced fields below are still editable.
          </p>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">ID</span>
          <input
            value={form.id}
            onChange={(event) => setForm((current) => ({ ...current, id: event.target.value }))}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            placeholder="Auto if empty"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Title</span>
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
            placeholder="Main hero banner"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Category</span>
          <select
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as ImageAssetCategory }))}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
          >
            {imageCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Campus</span>
          <select
            value={form.campus}
            onChange={(event) => setForm((current) => ({ ...current, campus: event.target.value }))}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
          >
            <option value="">Global</option>
            {campuses.map((campus) => (
              <option key={campus.name} value={campus.name}>{campus.name}</option>
            ))}
          </select>
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">ImageURL</span>
          <div className="flex items-center gap-2 rounded border border-slate-800 bg-slate-950 px-3 py-2">
            <Link2 size={14} className="text-brand-gold" />
            <input
              value={form.imageUrl}
              onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
              className="w-full bg-transparent text-xs text-white outline-none"
              placeholder="https://drive.google.com/file/d/FILE_ID/view"
            />
          </div>
          {previewUrl && previewUrl !== form.imageUrl.trim() && (
            <p className="mt-1 break-all text-[10px] text-emerald-400">DirectImageURL: {previewUrl}</p>
          )}
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Upload Image to Google Drive</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleUploadFile(file, null);
              event.currentTarget.value = '';
            }}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white file:mr-3 file:rounded file:border-0 file:bg-brand-gold file:px-3 file:py-1 file:text-xs file:font-bold file:text-slate-950"
          />
          {uploadingId === 'new' && (
            <p className="mt-1 text-[10px] font-bold uppercase text-brand-gold">Uploading to Google Drive...</p>
          )}
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Priority</span>
          <input
            type="number"
            min="1"
            value={form.priority}
            onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-bold uppercase text-slate-400">Status</span>
          <select
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            className="w-full rounded border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <span className="mb-2 block text-[10px] font-bold uppercase text-slate-400">DirectImageURL Preview</span>
          {previewUrl ? (
            <AssetImage imageUrl={previewUrl} title={form.title || 'Preview'} className="h-[220px] w-full rounded-lg object-cover" />
          ) : (
            <div className="flex h-[220px] w-full items-center justify-center rounded-lg border border-dashed border-slate-800 text-[10px] uppercase text-slate-500">
              Paste image URL
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:col-span-4">
          <button type="submit" className="flex items-center gap-2 rounded bg-brand-gold px-5 py-2 text-xs font-extrabold uppercase text-slate-950">
            {editingId ? <Save size={14} /> : <ImagePlus size={14} />}
            {editingId ? 'Save Edit' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="flex items-center gap-2 rounded bg-slate-800 px-5 py-2 text-xs font-extrabold uppercase text-white">
              <X size={14} />
              Cancel
            </button>
          )}
          {message && (
            <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300">
              <CheckCircle2 size={14} />
              {message}
            </span>
          )}
        </div>
      </form>

      <div className="mt-8">
        {assets.length === 0 ? (
          <div className="rounded-xl border border-slate-800 p-8 text-center text-xs text-slate-500">No image records yet.</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {orderedAssets.map((asset) => (
              <article key={asset.id} className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="relative">
                  <AssetImage
                    imageUrl={asset.url}
                    title={asset.title}
                    className="h-[220px] w-full object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded bg-[#112B8C] px-2 py-1 text-[10px] font-bold uppercase text-white">
                    {asset.category}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenChangeImage(asset)}
                    className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brand-gold px-3 py-1.5 text-[9px] font-extrabold uppercase text-slate-950 shadow"
                  >
                    <ImagePlus size={12} />
                    Change Image
                  </button>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="font-display text-base font-black uppercase tracking-wide text-white">{asset.title}</h3>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">ID: {asset.id} | Campus: {asset.campus || 'Global'}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded bg-slate-950 px-2 py-1 text-[9px] font-bold uppercase text-slate-400">Priority {asset.priority || 1}</span>
                      <span className={`rounded px-2 py-1 text-[9px] font-bold uppercase ${
                        (asset.status || 'Active') === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-red-500/10 text-red-300'
                      }`}>
                        {asset.status || 'Active'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                    <div className="mb-1 text-[9px] font-bold uppercase text-slate-500">ImageURL</div>
                    <div className="break-all font-mono text-[10px] leading-5 text-slate-500">{asset.originalUrl || asset.url}</div>
                    <div className="mb-1 mt-3 text-[9px] font-bold uppercase text-slate-500">DirectImageURL</div>
                    <div className="break-all font-mono text-[10px] leading-5 text-slate-400">{asset.url}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenChangeImage(asset)}
                      className="flex items-center justify-center gap-2 rounded bg-brand-gold px-3 py-2 text-[10px] font-extrabold uppercase text-slate-950"
                    >
                      <ImagePlus size={13} />
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(asset)}
                      className="flex items-center justify-center gap-2 rounded bg-slate-800 px-3 py-2 text-[10px] font-extrabold uppercase text-white hover:bg-slate-700"
                    >
                      <Edit3 size={13} />
                      Edit Info
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(asset.url)}
                      className="flex items-center justify-center gap-2 rounded bg-slate-950 px-3 py-2 text-[10px] font-extrabold uppercase text-slate-300 hover:text-brand-gold"
                    >
                      <Copy size={13} />
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(asset.id)}
                      className="flex items-center justify-center gap-2 rounded bg-red-950/40 px-3 py-2 text-[10px] font-extrabold uppercase text-red-300 hover:bg-red-950"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                </div>

                {changeImageAsset?.id === asset.id && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm">
                    <div className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-2xl">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-display text-sm font-black uppercase text-white">Change Image</h4>
                        <button type="button" onClick={() => setChangeImageAsset(null)} className="rounded bg-slate-800 p-1 text-slate-300">
                          <X size={14} />
                        </button>
                      </div>

                      <div className="grid gap-3">
                        <div>
                          <div className="mb-1 text-[9px] font-bold uppercase text-slate-500">Current image preview</div>
                          <AssetImage imageUrl={asset.url} title={asset.title} className="h-32 w-full rounded-lg object-cover" />
                        </div>

                        <label>
                          <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">New Google Drive URL</span>
                          <textarea
                            value={changeImageUrl}
                            onChange={(event) => setChangeImageUrl(event.target.value)}
                            className="h-20 w-full rounded border border-slate-700 bg-slate-950 p-2 text-[10px] font-mono text-white outline-none focus:border-brand-gold"
                            placeholder="https://drive.google.com/file/d/FILE_ID/view"
                          />
                        </label>

                        <label>
                          <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Or upload image directly</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) handleUploadFile(file, asset);
                              event.currentTarget.value = '';
                            }}
                            className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-[10px] text-white file:mr-2 file:rounded file:border-0 file:bg-brand-gold file:px-2 file:py-1 file:text-[10px] file:font-bold file:text-slate-950"
                          />
                          {uploadingId === asset.id && (
                            <p className="mt-1 text-[9px] font-bold uppercase text-brand-gold">Uploading to Google Drive...</p>
                          )}
                        </label>

                        {changePreviewUrl && (
                          <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-2">
                            <div className="mb-1 text-[9px] font-bold uppercase text-emerald-300">Auto converted direct URL preview</div>
                            <div className="break-all font-mono text-[10px] leading-5 text-emerald-200">{changePreviewUrl}</div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button type="button" onClick={handleSaveCardImage} className="flex-1 rounded bg-brand-gold px-3 py-2 text-[10px] font-extrabold uppercase text-slate-950">
                            Save
                          </button>
                          <button type="button" onClick={() => setChangeImageAsset(null)} className="flex-1 rounded bg-slate-800 px-3 py-2 text-[10px] font-extrabold uppercase text-white">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {infoAsset?.id === asset.id && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm">
                    <div className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-2xl">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-display text-sm font-black uppercase text-white">Edit Info</h4>
                        <button type="button" onClick={() => setInfoAsset(null)} className="rounded bg-slate-800 p-1 text-slate-300">
                          <X size={14} />
                        </button>
                      </div>

                      <div className="grid gap-3">
                        <label>
                          <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Title</span>
                          <input
                            value={infoForm.title}
                            onChange={(event) => setInfoForm((current) => ({ ...current, title: event.target.value }))}
                            className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none focus:border-brand-gold"
                          />
                        </label>

                        <label>
                          <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Category</span>
                          <select
                            value={infoForm.category}
                            onChange={(event) => setInfoForm((current) => ({ ...current, category: event.target.value as ImageAssetCategory }))}
                            className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none focus:border-brand-gold"
                          >
                            {imageCategories.map((category) => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </label>

                        <label>
                          <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Campus</span>
                          <select
                            value={infoForm.campus}
                            onChange={(event) => setInfoForm((current) => ({ ...current, campus: event.target.value }))}
                            className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none focus:border-brand-gold"
                          >
                            <option value="">Global</option>
                            {campuses.map((campus) => (
                              <option key={campus.name} value={campus.name}>{campus.name}</option>
                            ))}
                          </select>
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          <label>
                            <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Priority</span>
                            <input
                              type="number"
                              min="1"
                              value={infoForm.priority}
                              onChange={(event) => setInfoForm((current) => ({ ...current, priority: event.target.value }))}
                              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none focus:border-brand-gold"
                            />
                          </label>

                          <label>
                            <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Status</span>
                            <select
                              value={infoForm.status}
                              onChange={(event) => setInfoForm((current) => ({ ...current, status: event.target.value }))}
                              className="w-full rounded border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none focus:border-brand-gold"
                            >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <button type="button" onClick={handleSaveInfo} className="flex-1 rounded bg-brand-gold px-3 py-2 text-[10px] font-extrabold uppercase text-slate-950">
                            Save
                          </button>
                          <button type="button" onClick={() => setInfoAsset(null)} className="flex-1 rounded bg-slate-800 px-3 py-2 text-[10px] font-extrabold uppercase text-white">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
