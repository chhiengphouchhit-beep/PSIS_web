/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Campus {
  id: string;
  name: string;
  code: string;
  principal: string;
  message: string;
  facilities: string[];
  contact: string;
  image: string;
  location: string;
  studentsCount: number;
  isComingSoon?: boolean;
}

export type LeadStatus = 'New' | 'Contacted' | 'Tour Booked' | 'Assessment' | 'Enrolled' | 'Closed';

export interface Lead {
  id: string;
  parentName: string;
  studentName: string;
  studentAge: string;
  phone: string;
  email: string;
  campus: string; // e.g. "TK Campus"
  program: string; // e.g. "Primary School"
  status: LeadStatus;
  notes: string;
  createdAt: string;
  source: string; // e.g. "Website Form", "Ad Campaign"
  assignedAdmin?: string;
}

export type NewsCategory = 'Academic' | 'STEM' | 'Campus News' | 'PUC-IFL' | 'Activity' | 'Admission';

export interface NewsItem {
  id: string;
  title: string;
  khmerTitle?: string;
  category: NewsCategory | string;
  content: string;
  date: string;
  image: string;
  views: number;
  featured?: boolean;
  facebookUrl?: string;
  videoUrl?: string;
}

export type ImageAssetCategory =
  | 'Hero Banner'
  | 'Campus Gallery'
  | 'News'
  | 'Student Life'
  | 'Partner Logo'
  | 'Partner Logos'
  | 'AYLA Logo'
  | 'AYLA Logos'
  | 'Header Logo'
  | 'Campus Image'
  | 'Academic Program'
  | 'STEM Resource'
  | 'Admissions Image';

export interface ImageAsset {
  id: string;
  title: string;
  url: string;
  originalUrl: string;
  category: ImageAssetCategory;
  campus: string;
  priority?: number;
  status?: 'Active' | 'Inactive' | string;
  createdAt: string;
  storageProvider?: 'google-drive' | 'supabase' | 'external-url';
  storagePath?: string;
}

export type UserRole = 'Super Admin' | 'Marketing Admin' | 'Admission Admin' | 'Campus Admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  assignedCampus?: string;
}

export interface AcademicProgram {
  id: string;
  name: string;
  khmerName: string;
  description: string;
  curriculum: string[];
  features: string[];
  ageGroup: string;
  image: string;
}

export interface DigitLearningApp {
  id: string;
  name: string;
  description: string;
  gradeLevels: string;
  logoUrl?: string;
  purpose: string;
  iconName: string;
}

export interface StemKit {
  id: string;
  name: string;
  type: string;
  description: string;
  skillsAcquired: string[];
  image: string;
}
