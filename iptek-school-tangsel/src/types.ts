export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: "SMP" | "SMK" | "Umum" | "PPDB";
  views?: number;
}

export interface Achievement {
  id: string;
  title: string;
  event: string;
  level: "Kota" | "Provinsi" | "Nasional" | "Internasional";
  year: string;
  category: "Akademik" | "Non AKademik" | "Sains & Teknologi";
  image: string;
  description: string;
  winnerName?: string;
}

export interface PPDBApplicant {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  gender: "Laki-laki" | "Perempuan";
  unit: "SMP" | "SMK";
  major?: "DKV" | "Perhotelan" | "TSM" | "Akuntansi" | "None";
  highSchool: string;
  address: string;
  status: "Diterima" | "Pending" | "Ditolak";
  date: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: "Siswa Aktif" | "Alumni" | "Orang Tua Wali" | "Mitra Industri";
  companyOrClass: string;
  avatar: string;
  text: string;
  rating: number;
}

export interface Facility {
  id: string;
  name: string;
  category: "Lab" | "DKV" | "TSM" | "Perhotelan" | "Umum";
  image: string;
  description: string;
}
