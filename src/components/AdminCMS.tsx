/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { 
  getPersistedLeads, savePersistedLeads, 
  getPersistedNews, savePersistedNews, 
  getPersistedCampuses, savePersistedCampuses, 
  INITIAL_ADMINS, 
  convertGoogleDriveUrl,
  getActiveAdminUser,
  setActiveAdminUser,
} from '../mockData';
import { Lead, LeadStatus, NewsItem, NewsCategory, Campus, AdminUser } from '../types';
import ProductionImageManager from './ProductionImageManager';
import { supabase, getInquiries, updateInquiryStatus as updateSupabaseInquiryStatus, isSupabaseConfigured } from '../lib/supabase';
import { 
  Users, UserCheck, FileText, PlusCircle, Search,
  Edit3, Trash2, Layout, MapPin, CheckCircle, Save,
  X, ShieldAlert, Download, Award, RefreshCw, AlertCircle, UploadCloud, SearchCheck
} from 'lucide-react';

interface AdminCMSProps {
  lang: 'en' | 'kh';
  onDatabaseUpdate?: () => void;
}

export default function AdminCMS({ onDatabaseUpdate }: AdminCMSProps) {
  // Authentication Simulated Roler state
  const [currentUser, setCurrentUser] = useState<AdminUser>(getActiveAdminUser());
  const [leads, setLeads] = useState<Lead[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    avatar: currentUser.avatar,
    role: currentUser.role,
    assignedCampus: currentUser.assignedCampus || '',
  });

  // Selected view tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'campuses' | 'news' | 'assets' | 'launch' | 'roles'>('dashboard');

  // Search & Filter state for Leads
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All');
  const [leadCampusFilter, setLeadCampusFilter] = useState<string>('All');
  
  // Selected Lead for editing details modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadEditNotes, setLeadEditNotes] = useState('');
  const [leadEditStatus, setLeadEditStatus] = useState<LeadStatus>('New');

  // News Manager composer state
  const [showAddNews, setShowAddNews] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newKhmerTitle, setNewKhmerTitle] = useState('');
  const [newCategory, setNewCategory] = useState<NewsCategory>('Campus News');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80');

  // Campus editor state
  const [editingCampusId, setEditingCampusId] = useState<string | null>(null);
  const [campusPrincipal, setCampusPrincipal] = useState('');
  const [campusContact, setCampusContact] = useState('');
  const [campusMessage, setCampusMessage] = useState('');

  // Feed logs
  const [feedLogs, setFeedLogs] = useState<string[]>([
    '09:20 - Super Admin Oknha Dr. Chey Sam Ath logged in',
    '09:22 - Retrieved latest leads database from localStorage API',
    '09:24 - Synced 6 campus directories successfully'
  ]);

  // Load from local storage
  const loadDatabase = async () => {
    const loadedNews = getPersistedNews();
    const loadedCampuses = getPersistedCampuses();
    setNews(loadedNews);
    setCampuses(loadedCampuses);

    let loadedLeads: Lead[] = [];
    if (isSupabaseConfigured) {
      try {
        const supabaseInquiries = await getInquiries();
        // Map public.inquiries to Lead interface
        loadedLeads = supabaseInquiries.map((inq: any) => ({
          id: inq.id,
          parentName: inq.parent_name,
          studentName: inq.student_name,
          studentAge: String(inq.student_age),
          phone: inq.phone,
          email: inq.email || '',
          campus: inq.campus,
          program: inq.program,
          status: inq.status as LeadStatus,
          notes: inq.notes || '',
          createdAt: inq.created_at,
          source: 'Supabase DB',
          assignedAdmin: inq.assigned_admin || 'Unassigned'
        }));
      } catch (err) {
        console.error('Failed to load inquiries from Supabase:', err);
        loadedLeads = getPersistedLeads();
      }
    } else {
      loadedLeads = getPersistedLeads();
    }
    
    // Apply Campus Admin restriction if applicable
    if (currentUser.role === 'Campus Admin' && currentUser.assignedCampus) {
      const restrictedLeads = loadedLeads.filter(l => l.campus.includes(currentUser.assignedCampus || ''));
      setLeads(restrictedLeads);
    } else {
      setLeads(loadedLeads);
    }
  };

  // Sync real logged-in admin user from Supabase Auth
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          const userRole = user.user_metadata?.role || 'Super Admin';
          const userCampus = user.user_metadata?.assignedCampus || '';
          const realUser: AdminUser = {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Admin',
            email: user.email || '',
            avatar: user.user_metadata?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
            role: userRole as any,
            assignedCampus: userCampus || undefined,
          };
          setCurrentUser(realUser);
          setActiveAdminUser(realUser);
        }
      }).catch((err) => {
        console.error('Failed to sync auth user from Supabase:', err);
      });
    }
  }, []);

  useEffect(() => {
    loadDatabase();
  }, [currentUser]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setFeedLogs(prev => [`${timestamp} - ${msg}`, ...prev.slice(0, 8)]);
  };

  // Change active simulated user role
  const handleRoleChange = (admin: AdminUser) => {
    setCurrentUser(admin);
    setActiveAdminUser(admin);
    setProfileForm({
      name: admin.name,
      email: admin.email,
      avatar: admin.avatar,
      role: admin.role,
      assignedCampus: admin.assignedCampus || '',
    });
    addLog(`Changed role to ${admin.role} (${admin.name})`);
  };

  const handleStartProfileEdit = () => {
    setProfileForm({
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
      role: currentUser.role,
      assignedCampus: currentUser.assignedCampus || '',
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    const updatedUser: AdminUser = {
      ...currentUser,
      name: profileForm.name.trim() || currentUser.name,
      email: profileForm.email.trim() || currentUser.email,
      avatar: profileForm.avatar.trim() || currentUser.avatar,
      role: profileForm.role,
      assignedCampus: profileForm.role === 'Campus Admin' ? profileForm.assignedCampus.trim() || 'TK Campus' : undefined,
    };

    setCurrentUser(updatedUser);
    setActiveAdminUser(updatedUser);
    setIsEditingProfile(false);
    addLog(`Updated admin profile for ${updatedUser.name}`);
  };

  // Status transitions
  const handleUpdateLeadStatus = async (leadId: string, status: LeadStatus, notesText: string) => {
    const allLeads = getPersistedLeads();
    const updated = allLeads.map(l => {
      if (l.id === leadId) {
        return { ...l, status, notes: notesText };
      }
      return l;
    });
    savePersistedLeads(updated);

    if (isSupabaseConfigured) {
      try {
        await updateSupabaseInquiryStatus(leadId, status as any, currentUser.name, notesText);
      } catch (err) {
        console.error('Failed to update lead status in Supabase:', err);
      }
    }

    loadDatabase();
    setSelectedLead(null);
    addLog(`Updated Lead ${leadId} status to [${status}]`);
    if (onDatabaseUpdate) onDatabaseUpdate();
  };

  // Delete lead (restricted to Super Admin)
  const handleDeleteLead = async (leadId: string) => {
    if (currentUser.role !== 'Super Admin') {
      alert(`Access Denied: Only Super Admins can purge contact leads files.`);
      return;
    }
    const allLeads = getPersistedLeads().filter(l => l.id !== leadId);
    savePersistedLeads(allLeads);

    if (isSupabaseConfigured) {
      try {
        // Import supabase dynamically if not exposed, but it's exposed in the config
        const { supabase } = await import('../lib/supabase');
        if (supabase) {
          await supabase.from('inquiries').delete().eq('id', leadId);
        }
      } catch (err) {
        console.error('Failed to delete lead from Supabase:', err);
      }
    }

    loadDatabase();
    addLog(`Purged lead index ${leadId} permanently.`);
    if (onDatabaseUpdate) onDatabaseUpdate();
  };

  // Post dynamic school News
  const handlePostNews = (e: FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'Admission Admin' || currentUser.role === 'Campus Admin') {
      alert(`Permissions Error: Your role does not support composing news articles.`);
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill out Title and Content paragraphs.');
      return;
    }
    const allNews = getPersistedNews();
    const newItem: NewsItem = {
      id: `N-${allNews.length + 1}`,
      title: newTitle,
      khmerTitle: newKhmerTitle || undefined,
      category: newCategory,
      content: newContent,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      image: convertGoogleDriveUrl(newImage),
      views: 12
    };
    const updated = [newItem, ...allNews];
    savePersistedNews(updated);
    setNews(updated);
    setShowAddNews(false);
    setNewTitle('');
    setNewKhmerTitle('');
    setNewContent('');
    addLog(`Published news article [${newTitle}] under ${newCategory}`);
    if (onDatabaseUpdate) onDatabaseUpdate();
  };

  // Delete news item
  const handleDeleteNews = (id: string) => {
    if (currentUser.role === 'Admission Admin' || currentUser.role === 'Campus Admin') {
      alert(`Access Denied: Admissions or Campus admins cannot delete marketing news.`);
      return;
    }
    const allNews = getPersistedNews().filter(item => item.id !== id);
    savePersistedNews(allNews);
    setNews(allNews);
    addLog(`Removed news article ID ${id}`);
    if (onDatabaseUpdate) onDatabaseUpdate();
  };

  // Edit details of a campus
  const handleSaveCampus = (id: string) => {
    if (currentUser.role !== 'Super Admin') {
      alert(`Access Denied: Only Super Admin can modify educational structures.`);
      return;
    }
    const allCampuses = getPersistedCampuses();
    const updated = allCampuses.map(c => {
      if (c.id === id) {
        return {
          ...c,
          principal: campusPrincipal,
          contact: campusContact,
          message: campusMessage
        };
      }
      return c;
    });
    savePersistedCampuses(updated);
    setCampuses(updated);
    setEditingCampusId(null);
    addLog(`Modified directory variables for campus [${id.toUpperCase()}]`);
    if (onDatabaseUpdate) onDatabaseUpdate();
  };

  const handleStartEditCampus = (c: Campus) => {
    setEditingCampusId(c.id);
    setCampusPrincipal(c.principal);
    setCampusContact(c.contact);
    setCampusMessage(c.message);
  };

  // Excel exporter simulator
  const handleExportSimulated = () => {
    addLog(`Compiled excel database export for ${leads.length} selected records`);
    alert(`Excel Simulation: Exported ${leads.length} records successfully to 'psis_leads_database_${new Date().toISOString().slice(0, 10)}.xlsx'.`);
  };

  // Filter Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.parentName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.studentName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      l.id.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.program.toLowerCase().includes(leadSearch.toLowerCase());
    
    const matchesStatus = leadStatusFilter === 'All' ? true : l.status === leadStatusFilter;
    const matchesCampus = leadCampusFilter === 'All' ? true : l.campus.includes(leadCampusFilter);

    return matchesSearch && matchesStatus && matchesCampus;
  });

  // Calculate statistics for metrics cards
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const enrolledLeadsCount = leads.filter(l => l.status === 'Enrolled').length;
  const rate = totalLeadsCount > 0 ? Math.round((enrolledLeadsCount / totalLeadsCount) * 100) : 0;

  // Campus enrollment analysis for SVG graph
  const campusStats = campuses.map(c => {
    const count = getPersistedLeads().filter(l => l.campus.includes(c.name) || l.campus.includes(c.code)).length;
    return { name: c.code, count };
  });

  return (
    <div id="admin-panel" className="bg-slate-900 text-slate-100 min-h-screen">
      
      {/* Top Admin HUD banner to switch roles */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded bg-brand-gold flex items-center justify-center text-slate-950 font-bold font-display">
            CMS
          </div>
          <div>
            <h2 className="font-display font-black text-sm uppercase tracking-wider text-white">
              PSIS Academic Command Center
            </h2>
            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-sans mt-0.5">
              <span>Security Clearance:</span>
              <span className="bg-slate-800 text-brand-gold font-bold px-1.5 py-0.5 rounded uppercase">
                {currentUser.role}
              </span>
              {currentUser.role === 'Campus Admin' && (
                <span className="text-emerald-400">({currentUser.assignedCampus})</span>
              )}
            </div>
          </div>
        </div>

        {/* Impersonation Selector for Presentation Review */}
        {currentUser.role === 'Super Admin' && (
          <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex items-center space-x-3 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 hidden lg:inline tracking-wider pl-2">
              Impersonate Security Role:
            </span>
            <div className="flex flex-wrap gap-1 w-full justify-between">
              {INITIAL_ADMINS.map(adm => (
                <button
                  key={adm.id}
                  onClick={() => handleRoleChange(adm)}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded transition cursor-pointer ${
                    currentUser.role === adm.role
                      ? 'bg-brand-gold text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title={`Switch to (${adm.name})`}
                >
                  {adm.role.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">
        
        {/* Left Control Column */}
        <div className="lg:col-span-2 bg-slate-950 border-r border-slate-800 p-4 space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
              Navigation Modules
            </h3>
            
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition cursor-pointer ${
                  activeTab === 'dashboard' ? 'bg-[#112B8C] text-white shadow' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Layout size={14} />
                <span>Dashboard Home</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('leads');
                  loadDatabase();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition cursor-pointer relative ${
                  activeTab === 'leads' ? 'bg-[#112B8C] text-white shadow' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>Admissions Leads</span>
                {newLeadsCount > 0 && (
                  <span className="absolute right-3 bg-brand-red text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                    {newLeadsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('campuses')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition cursor-pointer ${
                  activeTab === 'campuses' ? 'bg-[#112B8C] text-white shadow' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <MapPin size={14} />
                <span>Campuses Config</span>
              </button>

              <button
                onClick={() => setActiveTab('news')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition cursor-pointer ${
                  activeTab === 'news' ? 'bg-[#112B8C] text-white shadow' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <FileText size={14} />
                <span>News & Events</span>
              </button>

              <button
                onClick={() => setActiveTab('assets')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition cursor-pointer ${
                  activeTab === 'assets' ? 'bg-[#112B8C] text-white shadow' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <UploadCloud size={14} />
                <span>Image Library</span>
              </button>

              <button
                onClick={() => setActiveTab('launch')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 transition cursor-pointer ${
                  activeTab === 'launch' ? 'bg-[#112B8C] text-white shadow' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <SearchCheck size={14} />
                <span>Launch Checklist</span>
              </button>
            </div>
          </div>

          {/* Quick Active Operator Widget */}
          <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-2 font-sans text-xs">
            <div className="flex items-center space-x-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-gold/30"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <h4 className="text-[11px] font-bold text-white truncate">{currentUser.name}</h4>
                <p className="text-[9px] text-gray-400 truncate">{currentUser.email}</p>
              </div>
            </div>
            {currentUser.role === 'Campus Admin' && (
              <div className="bg-emerald-500/10 text-emerald-400 font-bold text-[9px] uppercase px-1.5 py-0.5 rounded-full text-center tracking-wider">
                Managed: {currentUser.assignedCampus}
              </div>
            )}
            <button
              type="button"
              onClick={handleStartProfileEdit}
              className="w-full rounded bg-slate-800 px-3 py-2 text-[9px] font-extrabold uppercase tracking-wider text-slate-200 transition hover:bg-slate-700"
            >
              Edit Profile
            </button>
          </div>

          {isEditingProfile && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 font-sans text-xs">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">Edit Profile</h4>
                <button type="button" onClick={() => setIsEditingProfile(false)} className="text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2.5">
                <label className="block">
                  <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Name</span>
                  <input
                    value={profileForm.name}
                    onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-2 text-[11px] text-white outline-none focus:border-brand-gold"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Email</span>
                  <input
                    value={profileForm.email}
                    onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-2 text-[11px] text-white outline-none focus:border-brand-gold"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Avatar URL</span>
                  <input
                    value={profileForm.avatar}
                    onChange={(event) => setProfileForm((current) => ({ ...current, avatar: event.target.value }))}
                    className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-2 text-[11px] text-white outline-none focus:border-brand-gold"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Role</span>
                  <select
                    value={profileForm.role}
                    onChange={(event) => setProfileForm((current) => ({ ...current, role: event.target.value as AdminUser['role'] }))}
                    className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-2 text-[11px] text-white outline-none focus:border-brand-gold"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Marketing Admin">Marketing Admin</option>
                    <option value="Admission Admin">Admission Admin</option>
                    <option value="Campus Admin">Campus Admin</option>
                  </select>
                </label>
                {profileForm.role === 'Campus Admin' && (
                  <label className="block">
                    <span className="mb-1 block text-[9px] font-bold uppercase text-slate-500">Managed Campus</span>
                    <input
                      value={profileForm.assignedCampus}
                      onChange={(event) => setProfileForm((current) => ({ ...current, assignedCampus: event.target.value }))}
                      className="w-full rounded border border-slate-800 bg-slate-900 px-2.5 py-2 text-[11px] text-white outline-none focus:border-brand-gold"
                      placeholder="TK Campus"
                    />
                  </label>
                )}

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="flex w-full items-center justify-center gap-2 rounded bg-brand-gold px-3 py-2 text-[10px] font-extrabold uppercase text-slate-950"
                >
                  <Save size={12} />
                  Save Profile
                </button>
              </div>
            </div>
          )}

          {/* Mini Live system logs feed inside side-panel */}
          <div className="space-y-2 mt-4 font-mono text-[9px]">
            <h4 className="text-[10px] font-bold font-sans text-slate-500 uppercase tracking-widest pl-2">
              Live System Feeds
            </h4>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-900 space-y-1.5 max-h-44 overflow-y-auto text-slate-500">
              {feedLogs.map((log, i) => (
                <div key={i} className="leading-tight truncate">
                  {log}
                </div>
              ))}
            </div>
            <button 
              onClick={() => {
                loadDatabase();
                addLog('Manual database hot-reload executed.');
              }}
              className="w-full text-[9px] py-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded flex items-center justify-center gap-1 cursor-pointer font-sans uppercase font-bold"
            >
              <RefreshCw size={10} />
              Reload DB
            </button>
          </div>
        </div>

        {/* Right Content Column */}
        <div className="lg:col-span-10 p-6 md:p-8 overflow-y-auto">
          
          {/* TAB 1: DASHBOARD HOME */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Dashboard Headline */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display font-black text-xl text-white tracking-wide uppercase">
                    Consolidated Admissions Dashboard
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Statistical report aggregates real-time metrics across physical school campaigns.
                  </p>
                </div>
                
                <span className="text-[10px] bg-[#112B8C] text-white px-2 py-1 rounded font-mono font-bold uppercase tracking-wider">
                  DB Version 3.4 • Local
                </span>
              </div>

              {/* Grid of KPI Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metric 1 */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total Leads Handled</span>
                    <h4 className="text-2xl font-black font-sans text-white mt-1">{totalLeadsCount}</h4>
                    <p className="text-[9px] text-emerald-400 mt-1 flex items-center font-sans">
                      <span className="mr-1">▲ 14%</span> vs Previous Month
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded bg-[#112B8C]/20 flex items-center justify-center text-brand-blue">
                    <Users size={18} />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-300">New Inquiries Open</span>
                    <h4 className="text-2xl font-black font-sans text-brand-gold mt-1">{newLeadsCount}</h4>
                    <p className="text-[9px] text-brand-gold/60 mt-1 font-sans">Action required immediately</p>
                  </div>
                  <div className="w-10 h-10 rounded bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                    <AlertCircle size={18} />
                  </div>
                </div>

                {/* Metric 2.5 */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-300">Enrolled Student Leads</span>
                    <h4 className="text-2xl font-black font-sans text-emerald-400 mt-1">{enrolledLeadsCount}</h4>
                    <p className="text-[9px] text-gray-400 mt-1 font-sans">Successfully closed registrations</p>
                  </div>
                  <div className="w-10 h-10 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle size={18} />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Conversion Rate</span>
                    <h4 className="text-2xl font-black font-sans text-brand-red mt-1">{rate}%</h4>
                    <p className="text-[9px] text-gray-500 mt-1 font-sans">Goal target benchmark: 20%</p>
                  </div>
                  <div className="w-10 h-10 rounded bg-brand-red/10 flex items-center justify-center text-brand-red">
                    <UserCheck size={18} />
                  </div>
                </div>

              </div>

              {/* Launch Readiness + Lead Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">Lead Pipeline Status</h4>
                    <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-2 py-1 rounded font-bold uppercase">CRM Preview</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(['New','Contacted','Tour Booked','Assessment','Enrolled'] as LeadStatus[]).map(status => {
                      const count = leads.filter(l => l.status === status).length;
                      return (
                        <div key={status} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                          <div className="text-2xl font-black text-white">{count}</div>
                          <div className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mt-1">{status}</div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    This pipeline helps Admissions track every inquiry from first contact to enrollment. In production, this can connect to Supabase, Google Sheet, email alerts, or CRM.
                  </p>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-br from-[#071B5C] to-slate-950 border border-slate-800 p-6 rounded-xl space-y-4">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">Launch Readiness Checklist</h4>
                  {[
                    ['Public Website UI', 'Completed'],
                    ['Admin CMS Demo', 'Completed'],
                    ['Real Database', 'Next Phase'],
                    ['Image Upload Storage', 'Next Phase'],
                    ['SEO Metadata', 'Needs Review']
                  ].map(([label, status]) => (
                    <div key={label} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                      <span className="text-[11px] text-[#E8EEFF] font-bold">{label}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${status === 'Completed' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-brand-gold/10 text-brand-gold'}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data visualizations and logs layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* SVG Leads distribution chart */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                    Active Leads count by Physical Campus
                  </h4>
                  
                  {/* Styled inline SVG chart bars for 6 campuses */}
                  <div className="space-y-4 pt-2 font-sans">
                    {campusStats.map((stat, idx) => {
                      const maxLeads = Math.max(...campusStats.map(s => s.count), 1);
                      const widthPercentage = Math.max((stat.count / maxLeads) * 100, 5);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-300 font-bold">{stat.name} Campus Network</span>
                            <span className="text-brand-gold font-mono">{stat.count} Leads</span>
                          </div>
                          
                          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                            <div 
                              className="bg-gradient-to-r from-[#112B8C] to-brand-gold h-full rounded-full transition-all duration-500"
                              style={{ width: `${widthPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated AI Smart Summary and follow-up suggestion based on leads data */}
                <div className="lg:col-span-5 bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-brand-gold font-sans font-bold text-xs uppercase tracking-widest">
                      <Award size={14} />
                      <span>AI Smart Follow-up Summary</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      "Recent entries show substantial parent interest for Preschool packages at Toul Kork (TK) and Russey Keo (RSK) networks. Follow-ups suggest scheduling tours next Tuesday between 9:00 AM and 11:30 AM to maximize enrollment conversions. Additionally, 3 high school math applicants are queued for robotics tests."
                    </p>
                  </div>

                  <div className="bg-slate-900 p-4 rounded border border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">System recommendation status:</div>
                    <div className="text-[11px] italic font-sans text-yellow-100">
                      "Send tuition discount packages (ELIF, Koobits included) to Sok Mean."
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      addLog('Simulated AI model analysis updated.');
                      alert('Simulated AI model query triggered: Model analyzed 6 active campaigns and found no registration blockages.');
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-brand-gold border border-brand-gold/30 hover:border-brand-gold rounded text-xs font-bold uppercase cursor-pointer"
                  >
                    Recalculate AI Predictions
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ADMISSIONS LEADS MANAGEMENT */}
          {activeTab === 'leads' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
                <div>
                  <h3 className="font-display font-black text-xl text-white tracking-wide uppercase">
                    Parents and Admissions Leads Registry
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    View, search, filter, and modify profiles submitted by prospects.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportSimulated}
                    className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1 cursor-pointer font-sans uppercase"
                    title="Simulate excel Export spreadsheet"
                  >
                    <Download size={13} />
                    <span>Export Excel</span>
                  </button>
                </div>
              </div>

              {/* INTERACTIVE LEAD DIVISION PIPELINE FLOW */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { key: 'New', label: 'New Inquiry', color: 'border-l-yellow-500 hover:bg-yellow-500/5', bgActive: 'bg-yellow-500/10 border-yellow-500/40 text-yellow-500', icon: '●' },
                  { key: 'Contacted', label: 'Contacted', color: 'border-l-sky-500 hover:bg-sky-500/5', bgActive: 'bg-sky-500/10 border-sky-500/40 text-sky-400', icon: '✦' },
                  { key: 'Tour Booked', label: 'Tour Booked', color: 'border-l-purple-500 hover:bg-purple-500/5', bgActive: 'bg-purple-500/10 border-purple-500/40 text-purple-400', icon: '⌘ font-sans' },
                  { key: 'Assessment', label: 'Assessment', color: 'border-l-orange-500 hover:bg-orange-500/5', bgActive: 'bg-orange-500/10 border-orange-500/40 text-orange-400', icon: '⚡' },
                  { key: 'Enrolled', label: 'Enrolled', color: 'border-l-emerald-500 hover:bg-emerald-500/5', bgActive: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400', icon: '✓' }
                ].map((lane) => {
                  const laneCount = leads.filter(l => l.status === lane.key).length;
                  const isActive = leadStatusFilter === lane.key;
                  return (
                    <button
                      key={lane.key}
                      onClick={() => {
                        setLeadStatusFilter(isActive ? 'All' : lane.key);
                        addLog(`Interactive flow filter toggled for stage: [${lane.key}]`);
                      }}
                      className={`text-left p-4.5 rounded-xl border border-slate-800/80 bg-slate-950 transition-all duration-200 cursor-pointer border-l-4 ${lane.color} ${
                        isActive ? lane.bgActive + ' ring-1 ring-white/5 shadow-lg' : 'text-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] uppercase font-extrabold tracking-widest">
                        <span>{lane.label}</span>
                        <span className="font-mono text-xs">{lane.icon}</span>
                      </div>
                      <div className="flex items-baseline space-x-2 mt-2">
                        <span className="text-2xl font-black font-sans text-white">{laneCount}</span>
                        <span className="text-[9px] text-slate-500 font-sans">students</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                          className="bg-current h-full" 
                          style={{ width: `${leads.length > 0 ? (laneCount / leads.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Filtering HUD controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                
                {/* Search Term Input */}
                <div className="relative">
                  <Search size={13} className="absolute top-3.5 left-3 text-slate-500" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search name, phone, program..."
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2.5 pl-8 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                  />
                </div>

                {/* Status Selection list */}
                <div>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="All">All Status Stages</option>
                    <option value="New">New Inquiries</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Tour Booked">Tour Booked</option>
                    <option value="Assessment">Assessment Required</option>
                    <option value="Enrolled">Officially Enrolled</option>
                    <option value="Closed">Closed / Ignored</option>
                  </select>
                </div>

                {/* Campus restrict search */}
                <div>
                  <select
                    value={leadCampusFilter}
                    onChange={(e) => setLeadCampusFilter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="All">All Campus Locations</option>
                    <option value="Toul Kork">TK Campus</option>
                    <option value="Toul Tom Poung">TTP Campus</option>
                    <option value="Chbar Ampov">CAP Campus</option>
                    <option value="Russey Keo">RSK Campus</option>
                    <option value="National Road 3">NR3 Campus</option>
                    <option value="Battambang">Battambang Campus</option>
                  </select>
                </div>

              </div>

              {/* Datagrid Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-300 uppercase tracking-wider text-[10px] font-bold">
                      <th className="p-4">Lead ID</th>
                      <th className="p-4">Prospect Parent</th>
                      <th className="p-4">Student (Age)</th>
                      <th className="p-4">Campus & program</th>
                      <th className="p-4">Submitted Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300 font-sans">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                          No matching lead records found.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((l) => (
                        <tr key={l.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-4 font-mono text-brand-gold font-bold">
                            {l.id}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{l.parentName}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{l.phone}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{l.studentName}</div>
                            <span className="text-[10px] text-brand-gold font-bold">{l.studentAge} y/o</span>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-200">{l.campus.split(' ')[0]} Campus</div>
                            <div className="text-[10px] text-gray-400">{l.program}</div>
                          </td>
                          <td className="p-4 font-mono text-slate-400">
                            {new Date(l.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`inline-block font-extrabold text-[9px] uppercase px-2.5 py-1 rounded-full ${
                              l.status === 'New' ? 'bg-yellow-500/10 text-yellow-500' :
                              l.status === 'Contacted' ? 'bg-sky-500/10 text-sky-400' :
                              l.status === 'Tour Booked' ? 'bg-purple-500/10 text-purple-400' :
                              l.status === 'Assessment' ? 'bg-orange-500/10 text-orange-400' :
                              l.status === 'Enrolled' ? 'bg-emerald-500/10 text-emerald-400' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedLead(l);
                                  setLeadEditNotes(l.notes);
                                  setLeadEditStatus(l.status);
                                }}
                                className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-brand-gold rounded font-bold uppercase text-[9px] tracking-wider transition cursor-pointer"
                              >
                                Manage
                              </button>
                              
                              {currentUser.role === 'Super Admin' && (
                                <button
                                  onClick={() => handleDeleteLead(l.id)}
                                  className="p-1.5 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded transition cursor-pointer"
                                  title="Delete Lead index"
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: CAMPUSES CONFIGURATOR */}
          {activeTab === 'campuses' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-display font-black text-xl text-white tracking-wide uppercase">
                  Educational Campus Directories Manager
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Configure active campus personnel, messages, and contact channels mapped on the public network database.
                </p>
              </div>

              {currentUser.role !== 'Super Admin' && (
                <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 rounded-lg flex items-start space-x-3 text-xs mb-4">
                  <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">Privilege Restriction Warning:</span> Your security clearance level ({currentUser.role}) does not grant write access to base campus data variables. Map edits are locked.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campuses.map((c) => (
                  <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-display font-bold text-xs text-white uppercase">{c.name}</h4>
                        <p className="text-[10px] text-brand-gold font-sans font-medium mt-0.5">Code Identifier: {c.code}</p>
                      </div>
                      
                      {editingCampusId !== c.id && currentUser.role === 'Super Admin' && (
                        <button
                          onClick={() => handleStartEditCampus(c)}
                          className="text-slate-400 hover:text-brand-gold p-1 cursor-pointer bg-slate-900 rounded"
                        >
                          <Edit3 size={12} />
                        </button>
                      )}
                    </div>

                    {editingCampusId === c.id ? (
                      <div className="space-y-4 font-sans text-xs">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Principal name:</label>
                          <input
                            type="text"
                            value={campusPrincipal}
                            onChange={(e) => setCampusPrincipal(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Office Contact Line:</label>
                          <input
                            type="text"
                            value={campusContact}
                            onChange={(e) => setCampusContact(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Welcome Message:</label>
                          <textarea
                            value={campusMessage}
                            onChange={(e) => setCampusMessage(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                          />
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => handleSaveCampus(c.id)}
                            className="bg-brand-gold text-slate-950 font-bold px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                          >
                            <Save size={12} />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCampusId(null)}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center text-slate-300">
                          <span className="font-bold text-slate-400 mr-2 uppercase text-[10px]">Head:</span>
                          <span>{c.principal}</span>
                        </div>
                        <div className="flex items-center text-slate-300">
                          <span className="font-bold text-slate-400 mr-2 uppercase text-[10px]">Line:</span>
                          <span className="font-mono text-brand-gold">{c.contact}</span>
                        </div>
                        <div className="text-slate-400 italic text-[11px] leading-relaxed pt-2 border-t border-slate-900">
                          "{c.message}"
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: NEWS & EVENTS */}
          {activeTab === 'news' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
                <div>
                  <h3 className="font-display font-black text-xl text-white tracking-wide uppercase">
                    Institutional News & Community Events
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Author press releases, academic milestones, and weekend timetables posted directly to the homepage newsfeed.
                  </p>
                </div>

                {currentUser.role !== 'Admission Admin' && currentUser.role !== 'Campus Admin' && (
                  <button
                    onClick={() => setShowAddNews(!showAddNews)}
                    className="bg-brand-gold hover:bg-yellow-500 text-slate-950 text-xs font-extrabold px-4 py-2 rounded shadow transition flex items-center gap-1 cursor-pointer font-sans uppercase"
                  >
                    <PlusCircle size={14} />
                    <span>Compose News Item</span>
                  </button>
                )}
              </div>

              {/* Compose news modal/drawer */}
              {showAddNews && (
                <form onSubmit={handlePostNews} className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 animate-scaleUp font-sans text-xs max-w-xl">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <h4 className="font-sans font-bold text-sm text-brand-gold uppercase">New Article Formulation</h4>
                    <button type="button" onClick={() => setShowAddNews(false)} className="text-slate-400 hover:text-white">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Headline (English) *</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. English Speech Contest"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Headline (Khmer Translator)</label>
                      <input
                        type="text"
                        value={newKhmerTitle}
                        onChange={(e) => setNewKhmerTitle(e.target.value)}
                        placeholder="ឧ. ការប្រកួតប្រជែងនិយាយភាសាអង់គ្លេស"
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as NewsCategory)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
                      >
                        <option value="Campus News">Campus News</option>
                        <option value="Academic">Academic</option>
                        <option value="STEM">STEM</option>
                        <option value="PUC-IFL">PUC-IFL</option>
                        <option value="Activity">Activity</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Interactive Photo URL</label>
                      <input
                        type="text"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono"
                      />
                      {newImage.trim() && (
                        <div className="mt-2 overflow-hidden rounded border border-slate-800">
                          <img
                            src={convertGoogleDriveUrl(newImage)}
                            alt="News image preview"
                            className="h-28 w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Article Content *</label>
                    <textarea
                      required
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      rows={4}
                      placeholder="Write brief description coordinates..."
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-2 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-gold text-slate-950 font-sans font-extrabold px-6 py-2 rounded shadow cursor-pointer uppercase"
                  >
                    Publish Post Article
                  </button>
                </form>
              )}

              {/* Board output list of published entries */}
              <div className="space-y-3.5">
                {news.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans text-xs">
                    
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-[#112B8C] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-slate-400 text-[10px] font-mono">{item.date}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm mt-1">{item.title}</h4>
                        {item.khmerTitle && (
                          <p className="text-slate-400 text-[10px] mt-0.5 font-sans font-medium">{item.khmerTitle}</p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{item.content}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 pt-2 sm:pt-0 border-slate-900">
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] font-mono block">Views Recorded:</span>
                        <span className="font-bold text-white text-xs">{item.views} clicks</span>
                      </div>

                      {currentUser.role !== 'Admission Admin' && currentUser.role !== 'Campus Admin' && (
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="p-1 px-2.5 bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-brand-red rounded transition text-[10px] font-bold uppercase cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: IMAGE ASSET MANAGER */}
          {activeTab === 'assets' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4">
                  <h3 className="font-display font-black text-xl text-white tracking-wide uppercase">Image Library</h3>
                <p className="text-xs text-slate-400 font-sans">
                  Manage Google Drive image URLs for homepage hero banners, campus galleries, news images and partner logos.
                </p>
              </div>

              <ProductionImageManager campuses={campuses.map((campus) => ({ name: campus.name }))} onAssetsUpdate={onDatabaseUpdate} />

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                <h4 className="font-bold text-white uppercase tracking-wide text-sm mb-4">Production behavior</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-300">
                  {[
                    'Admin adds Google Drive image URL',
                    'URL is converted to direct image format',
                    'Image metadata is saved in localStorage',
                    'Public website can display image for all users',
                    'Record shape stays Supabase Storage compatible',
                    'Production can later save URLs to cms_assets table'
                  ].map((item) => (
                    <div key={item} className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-bold">{item}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: LAUNCH READINESS CHECKLIST */}
          {activeTab === 'launch' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-display font-black text-xl text-white tracking-wide uppercase">Launch Readiness Checklist</h3>
                <p className="text-xs text-slate-400 font-sans">Use this to prepare the site for official launch. Current version is demo-ready, not yet fully production-ready.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  ['Frontend Demo', '88%', 'bg-emerald-500'],
                  ['Admin CMS Demo', '78%', 'bg-blue-500'],
                  ['SEO Setup', '45%', 'bg-yellow-500'],
                  ['Production Backend', '25%', 'bg-red-500'],
                ].map(([label, percent, color]) => (
                  <div key={label} className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</div>
                    <div className="mt-2 text-3xl font-black text-white">{percent}</div>
                    <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${color}`} style={{ width: percent }} /></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {([
                  ['Critical before launch', ['Connect Supabase database', 'Real authentication by user role', 'Form email/Telegram notification', 'Real domain + SSL + backup']],
                  ['Important improvements', ['Real PSIS/AYLA logos', 'Real campus and student photos', 'Campus detail copy approved by management', 'SEO metadata and sitemap.xml']],
                  ['Marketing tracking', ['Google Analytics 4', 'Meta Pixel', 'Thank-you page tracking', 'Lead source and campaign tracking']],
                  ['Admin operations', ['Image upload to cloud storage', 'Lead export to Excel/CSV', 'News approval workflow', 'Campus admin permission testing']],
                ] satisfies Array<[string, string[]]>).map(([title, tasks]) => (
                  <div key={title} className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                    <h4 className="font-bold text-brand-gold uppercase tracking-wide text-sm mb-4">{title}</h4>
                    <div className="space-y-3">
                      {tasks.map((task: string) => (
                        <label key={task} className="flex items-center gap-3 text-xs text-slate-300">
                          <input type="checkbox" className="accent-brand-gold" />
                          <span>{task}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* LEAD DETAILED EDITING DIALOG MODAL BOX */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl shadow-2xl border border-slate-800 max-w-lg w-full overflow-hidden animate-scaleUp">
            
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-brand-gold" />
                <h4 className="font-display font-bold text-xs uppercase text-white">
                  Resolve Lead File Case: {selectedLead.id}
                </h4>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 font-sans text-xs">
              
              {/* Profile Card Summary */}
              <div className="bg-slate-900 p-4 rounded border border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 text-[9px] uppercase font-bold block">Prospect Family Name</span>
                  <span className="font-bold text-white text-sm">{selectedLead.parentName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] uppercase font-bold block">Assigned Pupil</span>
                  <span className="font-bold text-white text-sm">{selectedLead.studentName} ({selectedLead.studentAge}y)</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] uppercase font-bold block">Contact Line Phone</span>
                  <span className="font-mono text-brand-gold">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[9px] uppercase font-bold block">Digital Email Pathway</span>
                  <span className="text-slate-300">{selectedLead.email}</span>
                </div>
                <div className="col-span-2 border-t border-slate-800 pt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase font-bold block">Target Campus Office</span>
                    <span className="text-slate-300 font-bold">{selectedLead.campus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[9px] uppercase font-bold block">Academic Interest</span>
                    <span className="text-slate-300 font-bold">{selectedLead.program}</span>
                  </div>
                </div>
              </div>

              {/* Status Select stage */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                  Update Enrollment Stage Status *
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['New', 'Contacted', 'Tour Booked', 'Assessment', 'Enrolled', 'Closed'] as LeadStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setLeadEditStatus(st)}
                      className={`py-2 px-1 rounded text-[10px] font-bold uppercase border transition cursor-pointer text-center ${
                        leadEditStatus === st
                          ? 'bg-[#112B8C] border-brand-blue text-white ring-1 ring-brand-blue/55'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Interaction Notes */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                  Consultancy Follow-up Logs & Requirements
                </label>
                <textarea
                  value={leadEditNotes}
                  onChange={(e) => setLeadEditNotes(e.target.value)}
                  rows={4}
                  placeholder="Record assessment scores, discount notes, or scheduled physical campus tours..."
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleUpdateLeadStatus(selectedLead.id, leadEditStatus, leadEditNotes)}
                  className="w-full bg-brand-gold text-slate-950 hover:bg-yellow-500 font-sans font-extrabold text-xs uppercase py-3 rounded shadow transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Save size={14} />
                  <span>Commit Status & Logs</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
