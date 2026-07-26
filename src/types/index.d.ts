import type { Locale } from "@/i18n/index";

export type { Locale };

// Category Types
export interface Category {
  id: string;
  title: string;
}

export interface CategoryData {
  work: Category[];
}

// Menu Types
export interface MenuItem {
  title: string;
  path: string;
  children?: MenuItem[];
}

export interface MenuData {
  main: MenuItem[];
  contact: {
    title: string;
    path: string;
  };
  footer: FooterMenuSection[];
}

export interface FooterMenuSection {
  name: string;
  menus: Array<{
    title: string;
    path: string;
  }>;
}

// Social Media Types
export interface SocialMedia {
  icon: string;
  label: string;
  url: string;
}

// Work Experience Types
export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  icon: {
    source: string;
    alt: string;
    width: number;
    height: number;
  };
}
