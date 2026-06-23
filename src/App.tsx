import React, { useState, useEffect } from "react";
import { 
  School, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  Wrench, 
  Palette, 
  Hotel, 
  TrendingUp, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Volume2, 
  Briefcase, 
  ArrowUp, 
  Check, 
  Info, 
  User, 
  FileText, 
  Layers, 
  MessageSquare, 
  Send, 
  BellRing,
  HelpCircle,
  ThumbsUp,
  Image as ImageIcon
} from "lucide-react";

import { NewsArticle, Achievement, PPDBApplicant, Facility } from "./types";
import { SCHOOL_PROFILE, UNIT_DETAILS, PROGRAMS, INITIAL_FACILITIES, INITIAL_PRESTASI, INITIAL_NEWS, INITIAL_TESTIMONIALS, GENERAL_FAQ } from "./data";

import ProgramsModal from "./components/ProgramsModal";
import PPDBForm from "./components/PPDBForm";
import AdminCMS from "./components/AdminCMS";
import AdmissionsChatbot from "./components/AdmissionsChatbot";
import AdminLoginModal from "./components/AdminLoginModal";

export default function App() {
  // Mobile Nav Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Active Unit Education Tab
  const [activeUnit, setActiveUnit] = useState<"SMP" | "SMK">("SMK");

  // Facility category filter
  const [facilityFilter, setFacilityFilter] = useState<"All" | "Lab" | "DKV" | "TSM" | "Perhotelan" | "Umum">("All");

  // Gallery interactive filters
  const [galleryFilter, setGalleryFilter] = useState("Semua");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // SMK Program detail Modal trigger
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);

  // Admin CMS Portal visibility
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [cmsInitialTab, setCmsInitialTab] = useState<"ppdb" | "news" | "achievements">("ppdb");

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem("iptek_admin_logged_in") === "true";
    } catch {
      return false;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  const handleAdminAction = (tab: "ppdb" | "news" | "achievements" = "ppdb") => {
    if (isAdminLoggedIn) {
      setCmsInitialTab(tab);
      setIsCmsOpen(true);
    } else {
      setCmsInitialTab(tab);
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsCmsOpen(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("iptek_admin_logged_in");
    setIsAdminLoggedIn(false);
    setIsCmsOpen(false);
  };

  // Dynamic Content States loaded from LocalStorage (merged with standard INITIAL arrays)
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_NEWS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_PRESTASI);
  const [ppdbSuccessToast, setPpdbSuccessToast] = useState(false);

  // Real-time Push notifications states
  const [pushNotifications, setPushNotifications] = useState<{ id: string; text: string }[]>([]);

  // FAQ Expand state index
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Back to Top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Slideshow States
  const [currentSlide, setCurrentSlide] = useState(0);
  const SCHOOL_BANNER_SLIDES = [
    {
      title: "Mencetak Generasi Unggul & Berkarakter",
      subtitle: "SMP IPTEK Tangsel",
      desc: "Menyelenggarakan kurikulum merdeka dengan penekanan budi pekerti islami berbasis sains teknologi.",
      image: "/src/assets/images/hero_student_lab_1782123460809.jpg",
      badge: "SMP IPTEK TANGSEL"
    },
    {
      title: "Siap Kerja, Kuliah, & Berwirausaha",
      subtitle: "SMK IPTEK Tangsel",
      desc: "Lulusan bersertifikasi keandalan industri nasional didukung 4 program studi dan Teaching Factory kelas dunia.",
      image: "/src/assets/images/voxel_dkv_practice_1782123478677.jpg",
      badge: "SMK IPTEK TANGSEL"
    },
    {
      title: "Kemitraan Luas dengan Dunia Industri",
      subtitle: "Keunggulan Kemitraan DUDI",
      desc: "Menggandeng puluhan korporat papan atas Banten & Jakarta untuk menjalin penyaluran magang & lowongan karir aktif alumni.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&auto=format&fit=crop&q=80",
      badge: "BURSA KERJA KHUSUS (BKK)"
    }
  ];

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactErrors, setContactErrors] = useState<{ [key: string]: string }>({});
  const [contactSuccess, setContactSuccess] = useState(false);

  // Gallery static items
  const GALLERY_ITEMS = [
    { category: "Kegiatan Belajar", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=60", title: "Diskusi Kelompok Chromebook" },
    { category: "Praktik Jurusan", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60", title: "Praktik Desain Grafis DKV" },
    { category: "Ekstrakurikuler", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60", title: "Klub Robotik SMP Pemrograman" },
    { category: "Kunjungan Industri", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=60", title: "Kunjungan ke Kantor Teknologi" },
    { category: "Wisuda", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60", title: "Pelepasan & Wisuda Angkatan" },
    { category: "Lomba dan Prestasi", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60", title: "Penerimaan Medali Juara LKS" },
    { category: "Praktik Jurusan", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=60", title: "Simulasi Pelayanan Front Office" },
    { category: "Kegiatan Belajar", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=60", title: "Pembelajaran Interaktif Kelas" }
  ];

  // PPDB Countdown Clock (July 30, 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-07-30T23:59:59").getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync CMS Database dynamic loads
  const refreshCMSData = () => {
    try {
      const customN = localStorage.getItem("iptek_custom_news");
      if (customN) {
        const list = JSON.parse(customN) as NewsArticle[];
        setNews([...list, ...INITIAL_NEWS]);
      } else {
        setNews(INITIAL_NEWS);
      }

      const customA = localStorage.getItem("iptek_custom_achievements");
      if (customA) {
        const list = JSON.parse(customA) as Achievement[];
        setAchievements([...list, ...INITIAL_PRESTASI]);
      } else {
        setAchievements(INITIAL_PRESTASI);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Initial loads & Auto Carousel interval
  useEffect(() => {
    refreshCMSData();

    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    // Auto slideshow interval for Hero banner
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SCHOOL_BANNER_SLIDES.length);
    }, 6000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(slideTimer);
    };
  }, []);

  // Simulated Real-Time Push Announcement Generator
  useEffect(() => {
    const PUSH_MESSAGES = [
      "📢 INFO PPDB: Potongan Uang SPP Bulanan 20% khusus Gelombang 1 tinggal 8 hari lagi!",
      "🏆 PRESTASI: Siswa SMK IPTEK Tangsel Lolos Sertifikasi BNSP dengan kelayakan Komparatif Sempurna!",
      "🕌 KEAGAMAAN: Tadarus pagi rutin dan Tahfidz Juz Amma khusus jenjang SMP IPTEK.",
      "💼 ALUMNI SUKSES: 12 Alumni SMK dilantik berkarir tetap di instansi Astra Honda Motor Banten!",
      "📐 MERDEKA BELAJAR: SMP IPTEK menerapkan Chromebook digital untuk peningkatan nalar sains.",
      "📑 PPDB: Formulir Gelombang Pendaftaran Terbuka Online dapat dicetak bukti registrasinya langsung!"
    ];

    const triggerPushNotification = () => {
      const randomText = PUSH_MESSAGES[Math.floor(Math.random() * PUSH_MESSAGES.length)];
      const id = "push-" + Date.now();
      
      setPushNotifications((prev) => [...prev, { id, text: randomText }]);

      // Remove after 7 seconds
      setTimeout(() => {
        setPushNotifications((prev) => prev.filter((p) => p.id !== id));
      }, 7000);
    };

    // First push after 5s, then every 20s
    const firstTimeout = setTimeout(triggerPushNotification, 5000);
    const interval = setInterval(triggerPushNotification, 20000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  // Contact form validation
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: { [key: string]: string } = {};
    if (!contactName.trim()) tempErrors.name = "Nama lengkap wajib diisi.";
    if (!contactEmail.trim()) tempErrors.email = "Email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(contactEmail)) tempErrors.email = "Format email tidak valid.";
    if (!contactSubject.trim()) tempErrors.subject = "Subjek pesan wajib diisi.";
    if (!contactMessage.trim()) tempErrors.message = "Isi pesan tidak boleh kosong.";

    setContactErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      setContactSuccess(true);
      // Reset form
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
      setTimeout(() => setContactSuccess(false), 4000);
    }
  };

  // Filters logic
  const filteredFacilities = facilityFilter === "All" 
    ? INITIAL_FACILITIES 
    : INITIAL_FACILITIES.filter(f => f.category === facilityFilter);

  const filteredGallery = galleryFilter === "Semua"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === galleryFilter);

  // Scroll to section helper
  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div id="home-root" className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      
      {/* 1. STICKY HEADER */}
      <header 
        id="sticky-header" 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 py-3 text-slate-800" 
            : "bg-transparent py-4 text-white"
        }`}
      >
        <div id="header-wrapper" className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center select-none">
          {/* Brand Logo & Name */}
          <div 
            id="brand-logo" 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className={`p-2 rounded-xl flex items-center justify-center text-white shadow-md transition-all ${
              isScrolled ? "bg-[#0F4C81]" : "bg-gradient-to-br from-blue-400 to-amber-400"
            }`}>
              <School className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className={`font-heading font-extrabold text-sm md:text-lg leading-tight tracking-tight uppercase transition-colors ${
                isScrolled ? "text-[#0F4C81]" : "text-white"
              }`}>
                IPTEK SCHOOL
              </h1>
              <p className={`font-bold text-[10px] md:text-xs tracking-wider uppercase leading-none transition-colors ${
                isScrolled ? "text-[#2F80ED]" : "text-amber-400"
              }`}>Tangerang Selatan</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className={`hidden md:flex items-center gap-2 lg:gap-4 xl:gap-5 transition-colors ${
            isScrolled ? "text-slate-700 font-semibold" : "text-white/90 font-semibold"
          }`}>
            <button id="nav-home" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Beranda</button>
            <button id="nav-about" onClick={() => scrollTo("tentang")} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Tentang Kami</button>
            <button id="nav-units" onClick={() => scrollTo("unit")} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Unit</button>
            <button id="nav-majors" onClick={() => scrollTo("jurusan")} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Kejuruan</button>
            <button id="nav-facilities" onClick={() => scrollTo("fasilitas")} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Fasilitas</button>
            <button id="nav-prestasi" onClick={() => scrollTo("prestasi")} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Prestasi</button>
            <button id="nav-news" onClick={() => scrollTo("berita")} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Berita</button>
            <button id="nav-gallery" onClick={() => scrollTo("galeri")} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Galeri</button>
            <button id="nav-faq" onClick={() => scrollTo("ppdb")} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>PPDB</button>
            <button id="nav-contact" onClick={() => scrollTo("kontak")} className={`text-[10px] xl:text-xs transition-colors cursor-pointer uppercase ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Kontak</button>
          </nav>

          {/* Call to Actions on Header */}
          <div id="header-ctas" className="hidden md:flex items-center gap-1.5 lg:gap-3">
            {isAdminLoggedIn ? (
              <>
                <button 
                  id="header-cta-cms" 
                  onClick={() => handleAdminAction("ppdb")}
                  className={`px-2 lg:px-3 py-1.5 lg:py-2 font-semibold text-[10px] lg:text-xs rounded-xl flex items-center gap-1 border transition-all cursor-pointer ${
                    isScrolled 
                      ? "bg-[#0F4C81]/10 hover:bg-[#0F4C81]/20 text-[#0F4C81] border-[#0F4C81]/20" 
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  ⚙️ CMS Portal
                </button>
                <button 
                  id="header-cta-logout" 
                  onClick={handleAdminLogout}
                  className={`px-2 lg:px-3 py-1.5 lg:py-2 font-semibold text-[9px] lg:text-[11px] rounded-xl flex items-center gap-1 border transition-all cursor-pointer ${
                    isScrolled 
                      ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200" 
                      : "bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30"
                  }`}
                  title="Logout Administrator"
                >
                  Keluar Admin
                </button>
              </>
            ) : (
              <button 
                id="header-cta-admin-login" 
                onClick={() => setIsAdminLoginModalOpen(true)}
                className={`px-2 lg:px-3 py-1.5 lg:py-2 font-semibold text-[10px] lg:text-xs rounded-xl flex items-center gap-1 border transition-all cursor-pointer uppercase tracking-wider ${
                  isScrolled 
                    ? "bg-[#0F4C81]/5 hover:bg-[#0F4C81]/10 text-slate-600 border-slate-300" 
                    : "bg-white/5 hover:bg-white/10 text-white/85 border border-white/10"
                }`}
              >
                🔐 Admin
              </button>
            )}
            <button 
              id="header-cta-daftar" 
              onClick={() => scrollTo("ppdb")}
              className={`px-2.5 lg:px-4 py-1.5 lg:py-2 font-bold text-[10px] lg:text-xs rounded-xl shadow-md transition-all cursor-pointer ${
                isScrolled
                  ? "bg-[#0F4C81] hover:bg-[#1C609D] text-white"
                  : "bg-amber-400 hover:bg-amber-300 text-slate-950"
              }`}
            >
              Daftar Sekarang
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div id="mobile-hamburger" className="flex md:hidden items-center gap-2">
            {isAdminLoggedIn && (
              <button
                id="hamburger-cms-btn"
                onClick={() => handleAdminAction("ppdb")}
                className={`p-1 px-2.5 rounded-lg text-xs font-semibold border ${
                  isScrolled 
                    ? "bg-[#0F4C81]/10 text-[#0F4C81] border-[#0F4C81]/20" 
                    : "bg-white/10 text-white border border-white/20"
                }`}
              >
                ⚙️ CMS
              </button>
            )}
            <button
              id="hamburger-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isScrolled ? "text-gray-800 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
              title="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div id="mobile-nav-panel" className={`md:hidden absolute top-full left-0 right-0 border-t shadow-xl overflow-hidden py-4 px-6 select-none animate-fadeIn ${
            isScrolled ? "bg-white border-gray-205 text-slate-800" : "bg-[#0F4C81] border-white/10 text-white"
          }`}>
            <div className="flex flex-col gap-3 font-medium">
              <button onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Beranda</button>
              <button onClick={() => scrollTo("tentang")} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Tentang Kami</button>
              <button onClick={() => scrollTo("unit")} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Unit SMP/SMK</button>
              <button onClick={() => scrollTo("jurusan")} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Program Keahlian</button>
              <button onClick={() => scrollTo("fasilitas")} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Fasilitas</button>
              <button onClick={() => scrollTo("prestasi")} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Prestasi</button>
              <button onClick={() => scrollTo("berita")} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Berita Blog</button>
              <button onClick={() => scrollTo("galeri")} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Galeri Foto</button>
              <button onClick={() => scrollTo("ppdb")} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>PPDB 2026</button>
              <button onClick={() => scrollTo("kontak")} className={`text-left py-2 font-bold transition-colors uppercase text-xs ${isScrolled ? "hover:text-[#0F4C81]" : "hover:text-amber-400"}`}>Hubungi Kami</button>
              
              <div className={`border-t pt-4 mt-2 flex flex-col gap-2.5 ${isScrolled ? "border-gray-200" : "border-white/10"}`}>
                {isAdminLoggedIn ? (
                  <>
                    <button
                      onClick={() => { setMobileMenuOpen(false); handleAdminAction("ppdb"); }}
                      className={`w-full py-3 font-bold text-xs rounded-xl border uppercase text-center ${
                        isScrolled 
                          ? "bg-[#0F4C81]/5 text-[#0F4C81] border-[#0F4C81]/20 hover:bg-[#0F4C81]/10" 
                          : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                      }`}
                    >
                      ⚙️ CMS Portal
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); handleAdminLogout(); }}
                      className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 uppercase text-center"
                    >
                      🚪 Keluar Admin
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); setIsAdminLoginModalOpen(true); }}
                    className={`w-full py-3 font-bold text-xs rounded-xl border uppercase text-center ${
                      isScrolled 
                        ? "bg-gray-100 border-gray-300 text-slate-700 hover:bg-gray-200" 
                        : "bg-white/5 border-white/10 text-white/90 hover:bg-white/10"
                    }`}
                  >
                    🔐 Log In Admin
                  </button>
                )}
                <button
                  onClick={() => scrollTo("ppdb")}
                  className={`w-full py-3.5 font-extrabold text-xs rounded-xl shadow-md uppercase text-center ${
                    isScrolled 
                      ? "bg-[#0F4C81] hover:bg-[#155998] text-white" 
                      : "bg-amber-400 hover:bg-amber-300 text-slate-950"
                  }`}
                >
                  🚀 Daftar PPDB Online
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* DYNAMIC REAL-TIME ANNOUNCEMENT / PUSH NOTIFICATION NOTIFIER */}
      <div id="push-announcement-area" className="fixed top-24 right-4 z-50 pointer-events-none space-y-2 select-none w-full max-w-[90%] sm:max-w-md">
        {pushNotifications.map((notif) => (
          <div
            key={notif.id}
            id={notif.id}
            className="pointer-events-auto bg-slate-950/90 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-blue-500/30 flex items-start gap-2.5 animate-slideLeft text-white justify-between"
          >
            <div className="flex gap-2 text-white">
              <BellRing className="w-5 h-5 text-accent-gold shrink-0 mt-0.5 animate-bounce" />
              <div className="text-xs">
                <p className="font-bold text-[10px] uppercase text-blue-400 tracking-wider">Pengumuman Terkini</p>
                <p className="font-sans text-gray-200 mt-0.5 font-medium leading-relaxed">{notif.text}</p>
              </div>
            </div>
            <button
              onClick={() => setPushNotifications((prev) => prev.filter((p) => p.id !== notif.id))}
              className="text-gray-400 hover:text-white shrink-0 p-0.5 hover:bg-white/10 rounded cursor-pointer"
              title="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>


      {/* 2. HERO SECTION COMPONENT (Slideshow fullscreen) */}
      <section id="hero-carousel" className="relative h-[100vh] lg:h-[90vh] bg-neutral-900 overflow-hidden text-white select-none">
        
        {/* Slides looping background */}
        {SCHOOL_BANNER_SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Dark overlay to increase text contrast readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-slate-950/90 z-10" />
            
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover select-none scale-105 transition-transform duration-[6000ms]"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-16">
            
            {/* Left Col text headlines */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="inline-flex px-3.5 py-1.5 bg-blue-600/35 border border-blue-400/40 text-blue-300 text-xs font-bold rounded-lg uppercase tracking-widest leading-none">
                {SCHOOL_BANNER_SLIDES[currentSlide].badge}
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight uppercase">
                {SCHOOL_BANNER_SLIDES[currentSlide].subtitle}
                <span className="block text-amber-400 mt-1">{SCHOOL_BANNER_SLIDES[currentSlide].title}</span>
              </h2>

              <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed max-w-xl">
                {SCHOOL_BANNER_SLIDES[currentSlide].desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="hero-ppdb-cta"
                  onClick={() => scrollTo("ppdb")}
                  className="px-7 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 uppercase tracking-wider text-center transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Pendaftaran PPDB Online
                </button>
                <button
                  id="hero-scout-cta"
                  onClick={() => scrollTo("tentang")}
                  className="px-7 py-3.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl uppercase tracking-wider text-center transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  Jelajahi IPTEK SCHOOL
                </button>
              </div>

              {/* Slider Dots */}
              <div className="flex gap-2.5 pt-4">
                {SCHOOL_BANNER_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      i === currentSlide ? "w-8 bg-blue-500" : "w-2.5 bg-white/40"
                    }`}
                    title={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Col Stats list */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {SCHOOL_PROFILE.stats.map((stat, idx) => (
                <div key={idx} className="bg-white/10 border border-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col justify-between hover:border-blue-400/50 hover:bg-white/15 transition-all">
                  <div className="p-1.5 bg-blue-500/20 text-blue-300 w-max rounded-lg">
                    {idx === 0 && <School className="w-5 h-5 text-blue-400" />}
                    {idx === 1 && <GraduationCap className="w-5 h-5 text-amber-400" />}
                    {idx === 2 && <User className="w-5 h-5 text-emerald-400" />}
                    {idx === 3 && <Award className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl md:text-3xl font-extrabold text-white font-heading">{stat.value}</p>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    <p className="text-[10px] text-gray-400 leading-normal mt-0.5">{stat.detail}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </section>


      {/* 3. TENTANG IPTEK SCHOOL TANGSEL */}
      <section id="tentang" className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Col Left: Description and Mission */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Profil Kami</span>
              <h2 className="text-3xl font-heading font-extrabold text-gray-950 uppercase">SMP & SMK IPTEK Tangsel</h2>
              <p className="text-sm font-semibold text-gray-400 italic">"Melahirkan Ilmuwan, Kreator Digital, Keuangan Handal & Mekanik Terakreditasi"</p>
            </div>

            <p className="text-gray-600 leading-relaxed font-sans text-sm md:text-base">
              {SCHOOL_PROFILE.history}
            </p>

            <div className="border-t border-gray-100 pt-5 space-y-4">
              <h3 className="font-heading font-extrabold text-[#0F4C81] flex items-center gap-1.5 text-md md:text-lg">
                🎯 Visi Sekolah
              </h3>
              <p className="text-gray-600 text-sm font-sans bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                "{SCHOOL_PROFILE.vision}"
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-heading font-extrabold text-[#0F4C81] flex items-center gap-1.5 text-md md:text-lg">
                🧭 Misi Akademik
              </h3>
              <ul className="space-y-2 text-gray-600 text-xs md:text-sm">
                {SCHOOL_PROFILE.misi.map((mis, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-50 text-[#2F80ED] rounded-full flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span>{mis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Col Right: Visi, Misi and Core Values Graphic cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video border border-gray-100">
              <div className="absolute inset-0 bg-blue-900/10 z-10 hover:bg-transparent transition-all" />
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60"
                alt="Student teamwork"
                className="w-full h-full object-cover scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <h4 className="font-heading font-bold text-gray-950 text-xs md:text-sm mb-4 uppercase tracking-wider text-center">Nilai-Nilai Utama Mandiri (CORE VALUES)</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-2 xl:grid-cols-5 gap-2 font-heading">
                
                <div className="bg-white p-3 rounded-xl border text-center hover:border-blue-400 select-none transition-all">
                  <span className="text-xl">🛡️</span>
                  <p className="font-extrabold text-[10px] text-gray-800 uppercase mt-1.5">Integritas</p>
                </div>

                <div className="bg-white p-3 rounded-xl border text-center hover:border-blue-400 select-none transition-all">
                  <span className="text-xl">💼</span>
                  <p className="font-extrabold text-[10px] text-gray-800 uppercase mt-1.5">Profesi</p>
                </div>

                <div className="bg-white p-3 rounded-xl border text-center hover:border-blue-400 select-none transition-all">
                  <span className="text-xl">💻</span>
                  <p className="font-extrabold text-[10px] text-gray-800 uppercase mt-1.5">Teknologi</p>
                </div>

                <div className="bg-white p-3 rounded-xl border text-center hover:border-blue-400 select-none transition-all">
                  <span className="text-xl">🌸</span>
                  <p className="font-extrabold text-[10px] text-gray-800 uppercase mt-1.5">Karakter</p>
                </div>

                <div className="bg-white p-3 rounded-xl border text-center hover:border-blue-400 col-span-2 sm:col-span-1 select-none transition-all">
                  <span className="text-xl">🤝</span>
                  <p className="font-extrabold text-[10px] text-gray-800 uppercase mt-1.5">Kolaborasi</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 4. UNIT PENDIDIKAN COMPONENT */}
      <section id="unit" className="py-20 bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Unit Lembaga</span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950 uppercase">SMP vs SMK IPTEK Tangsel</h2>
            <p className="text-gray-500 text-xs md:text-sm">Silakan jelajahi informasi detail mengenai kedua unit pendidikan unggulan kami di Tangerang Selatan.</p>
          </div>

          <div className="flex justify-center max-w-sm mx-auto p-1 bg-gray-200/60 rounded-xl font-heading font-extrabold">
            <button
              id="unit-smp-selector"
              onClick={() => setActiveUnit("SMP")}
              className={`flex-1 py-2.5 rounded-lg text-xs tracking-wider uppercase cursor-pointer transition-all ${
                activeUnit === "SMP" ? "bg-white text-[#0F4C81] shadow-md" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              SMP IPTEK
            </button>
            <button
              id="unit-smk-selector"
              onClick={() => setActiveUnit("SMK")}
              className={`flex-1 py-2.5 rounded-lg text-xs tracking-wider uppercase cursor-pointer transition-all ${
                activeUnit === "SMK" ? "bg-white text-[#0F4C81] shadow-md" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              SMK IPTEK
            </button>
          </div>

          {/* Unit interactive detailed display */}
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Visual left */}
            <div className="space-y-4">
              <span className="inline-flex px-3 py-1 bg-blue-50 text-[#2F80ED] text-[10px] font-bold rounded uppercase">
                {activeUnit === "SMP" ? "Kurikulum Merdeka 2026" : "Kemitraan Perusahaan"}
              </span>
              <h3 className="text-xl md:text-2xl font-bold font-heading text-gray-950">
                {activeUnit === "SMP" ? UNIT_DETAILS.smp.title : UNIT_DETAILS.smk.title}
              </h3>
              <p className="text-sm font-semibold text-[#0F4C81] italic">
                {activeUnit === "SMP" ? UNIT_DETAILS.smp.sub : UNIT_DETAILS.smk.sub}
              </p>
              <p className="text-gray-600 font-sans text-sm md:text-base leading-relaxed">
                {activeUnit === "SMP" ? UNIT_DETAILS.smp.description : UNIT_DETAILS.smk.description}
              </p>
              
              <div className="pt-2">
                <button
                  id="unit-ppdb-link"
                  onClick={() => scrollTo("ppdb")}
                  className="px-5 py-3 bg-[#0F4C81] hover:bg-[#2F80ED] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-1"
                >
                  Daftar di {activeUnit === "SMP" ? "SMP" : "SMK"} Sekarang <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bullet points right */}
            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/80 space-y-4">
              <h4 className="font-heading font-bold text-slate-800 text-xs md:text-sm uppercase tracking-wide">Fokus & Unggulan Tambahan</h4>
              <div className="space-y-3 font-sans text-xs md:text-sm text-gray-600">
                {(activeUnit === "SMP" ? UNIT_DETAILS.smp.features : UNIT_DETAILS.smk.features).map((feat, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <Check className="w-5 h-5 text-emerald-500 bg-emerald-50 border border-emerald-200 rounded-full p-1 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 5. PROGRAM KEAHLIAN SMK GRID */}
      <section id="jurusan" className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Program Kejuruan</span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950 uppercase">Program Studi Keahlian SMK</h2>
            <p className="text-gray-500 text-xs md:text-sm">Menyelenggarakan 4 Program Kejuruan industri terpopuler yang mengadopsi standar kurikulum vokasi canggih.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map((prog) => (
              <div 
                key={prog.id} 
                className="bg-white border hover:border-blue-400 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="p-3 bg-blue-50 text-blue-700 w-max rounded-xl mb-4 text-2xl font-bold">
                    {prog.id === "dkv" && <Palette className="w-6 h-6 text-indigo-700" />}
                    {prog.id === "perhotelan" && <Hotel className="w-6 h-6 text-amber-600" />}
                    {prog.id === "tsm" && <Wrench className="w-6 h-6 text-rose-600" />}
                    {prog.id === "akuntansi" && <TrendingUp className="w-6 h-6 text-emerald-600" />}
                  </div>

                  <h3 className="font-heading font-bold text-gray-900 text-md md:text-md mb-2">{prog.title}</h3>
                  <p className="text-gray-500 font-sans text-xs md:text-sm leading-relaxed mb-4">{prog.desc}</p>
                </div>

                <div className="pt-4 border-t border-gray-100/80">
                  <button
                    id={`learn-more-${prog.id}`}
                    onClick={() => {
                      setSelectedProgram(prog);
                      setIsProgramModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 text-[#0F4C81] hover:text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    Pelajari Lebih Lanjut
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 6. KEUNGGULAN SEKOLAH CORE */}
      <section id="keunggulan" className="py-20 bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Mengapa Memilih Kami</span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950 uppercase">8 Keunggulan IPTEK SCHOOL</h2>
            <p className="text-gray-500 text-xs md:text-sm">Infrastruktur dan pelayanan prima untuk menjamin keterserapan siswa di kancah nasional.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-heading select-none">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-200/50 hover:-translate-y-1 transition-all shadow-sm">
              <div className="text-2xl">👩‍🏫</div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm mt-3 uppercase tracking-wide">Guru Profesional</h4>
              <p className="text-gray-500 text-[10px] md:text-xs font-sans mt-1.5 leading-relaxed">Seluruh pendidik tersertifikasi, alumni PTN terkemuka & pakar ahli industri.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/50 hover:-translate-y-1 transition-all shadow-sm">
              <div className="text-2xl">🌲</div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm mt-3 uppercase tracking-wide">Lingkungan Nyaman</h4>
              <p className="text-gray-500 text-[10px] md:text-xs font-sans mt-1.5 leading-relaxed">Kampus asri, hijau, bersih, berfasilitas AC penuh, dan bebas kebisingan.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/50 hover:-translate-y-1 transition-all shadow-sm">
              <div className="text-2xl">🧪</div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm mt-3 uppercase tracking-wide">Laboratorium Lengkap</h4>
              <p className="text-gray-500 text-[10px] md:text-xs font-sans mt-1.5 leading-relaxed">Studio praktik, kamar mockup hotel, dan mesin uji roda dua standar industri.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/50 hover:-translate-y-1 transition-all shadow-sm">
              <div className="text-2xl">✨</div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm mt-3 uppercase tracking-wide">Penguatan Karakter</h4>
              <p className="text-gray-500 text-[10px] md:text-xs font-sans mt-1.5 leading-relaxed">Tadarus pagi, tahfidz Juz Amma, pembekalan akhlak, serta budi pekerti luhur.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/50 hover:-translate-y-1 transition-all shadow-sm">
              <div className="text-2xl font-bold bg-blue-55 text-blue-80">🤝</div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm mt-3 uppercase tracking-wide">Kemitraan Industri</h4>
              <p className="text-gray-500 text-[10px] md:text-xs font-sans mt-1.5 leading-relaxed">Kerjasama magang dan sertifikasi dengan puluhan partner korporasi nasional.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/50 hover:-translate-y-1 transition-all shadow-sm">
              <div className="text-2xl">🏅</div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm mt-3 uppercase tracking-wide">Sertifikasi Kompetensi</h4>
              <p className="text-gray-500 text-[10px] md:text-xs font-sans mt-1.5 leading-relaxed">Kelulusan bersertifikasi profesi BNSP dan asosiasi keahlian terlisensi.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/50 hover:-translate-y-1 transition-all shadow-sm">
              <div className="text-2xl">📈</div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm mt-3 uppercase tracking-wide">Pendampingan Karir</h4>
              <p className="text-gray-500 text-[10px] md:text-xs font-sans mt-1.5 leading-relaxed">Fasilitas BKK aktif menyalurkan bimbingan alumni ke dunia kerja global.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/50 hover:-translate-y-1 transition-all shadow-sm">
              <div className="text-2xl">💻</div>
              <h4 className="font-bold text-gray-900 text-xs md:text-sm mt-3 uppercase tracking-wide">Berbasis Teknologi</h4>
              <p className="text-gray-500 text-[10px] md:text-xs font-sans mt-1.5 leading-relaxed">E-learning Chromebook, coding materi, absensi barcode, serta pelayanan digital.</p>
            </div>

          </div>

        </div>
      </section>


      {/* 7. FASILITAS SEKOLAH COMPONENT (Interactive filters + Cards) */}
      <section id="fasilitas" className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Fasilitas Praktik</span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950 uppercase">Sarana Prasarana Sekolah</h2>
            <p className="text-gray-500 text-xs md:text-sm">Menyediakan penunjang belajar premium standar industri demi kenyamanan dan ketangkasan praktik siswa.</p>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto font-heading select-none">
            {["All", "Lab", "DKV", "TSM", "Perhotelan", "Umum"].map((cat) => (
              <button
                key={cat}
                id={`filter-fac-${cat}`}
                onClick={() => setFacilityFilter(cat as any)}
                className={`py-1.5 px-4 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                  facilityFilter === cat 
                    ? "bg-[#0F4C81] text-white shadow-md" 
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat === "All" ? "Semua Sarana" : cat === "Lab" ? "Lab Komputer" : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFacilities.map((fac) => (
              <div 
                key={fac.id} 
                className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-44 overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-900/10 z-10 group-hover:bg-transparent transition-all" />
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <span className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded uppercase">
                    {fac.category}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <h4 className="font-heading font-extrabold text-[#0F4C81] text-xs md:text-sm uppercase">{fac.name}</h4>
                  <p className="text-gray-500 font-sans text-xs leading-relaxed">{fac.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 8. PRESTASI SEKOLAH COMPONENT */}
      <section id="prestasi" className="py-20 bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-200/60 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Galeri Penghargaan</span>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950 uppercase">Catatan Prestasi Siswa</h2>
              <p className="text-gray-500 text-xs md:text-sm">Raihan piala kompetisi akademik, non-akademik, sains, dan teknologi global.</p>
            </div>
            
            {/* CMS Trigger shortcut */}
            {isAdminLoggedIn && (
              <button
                id="prestasi-cms-shortcut"
                onClick={() => handleAdminAction("achievements")}
                className="py-2 px-4 bg-white hover:bg-gray-100 text-[#0F4C81] border font-bold text-xs rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer animate-fadeIn"
              >
                👑 Tambah Data Prestasi (Admin)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((ach) => (
              <div 
                key={ach.id} 
                className="bg-white p-5 rounded-2xl border border-gray-200/70 shadow-sm flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow items-start"
              >
                <div className="w-full sm:w-28 h-28 shrink-0 rounded-xl overflow-hidden relative">
                  <img
                    src={ach.image}
                    alt={ach.title}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-blue-900 text-white text-[8px] font-bold rounded">
                    {ach.year}
                  </span>
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold rounded-full border border-amber-200 uppercase">
                      Tingkat {ach.level}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-bold rounded-full border border-blue-200 uppercase">
                      {ach.category}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-sm md:text-sm uppercase leading-tight">{ach.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{ach.description}</p>
                  {ach.winnerName && (
                    <p className="text-[10px] text-gray-400 font-sans font-semibold">
                      Peraih: <span className="text-[#0F4C81]">{ach.winnerName}</span> &bull; Event: {ach.event}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 9. BERITA DAN INFORMASI (BLOG) */}
      <section id="berita" className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-gray-200/60 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Kabar Terkini</span>
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950 uppercase">Berita & Pengumuman Terbaru</h2>
              <p className="text-gray-500 text-xs md:text-sm">Membagikan pencapaian penting, event mading, serta kabar rekrutmen sekolah.</p>
            </div>

            {/* CMS News trigger */}
            {isAdminLoggedIn && (
              <button
                id="news-cms-shortcut"
                onClick={() => handleAdminAction("news")}
                className="py-2.5 px-4 bg-white hover:bg-gray-100 text-[#0F4C81] border font-bold text-xs rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer animate-fadeIn"
              >
                📝 Tulis Berita Baru (CMS)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article 
                key={item.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative select-none">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded uppercase">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex gap-2 text-[10px] text-gray-400 font-sans">
                      <span>{item.date}</span>
                      <span>&bull;</span>
                      <span>Penulis: {item.author}</span>
                    </div>
                    
                    <h3 className="font-heading font-extrabold text-gray-900 text-xs md:text-sm group-hover:text-amber-500 transition-colors uppercase leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 font-sans text-[11px] md:text-xs leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3">
                  <button
                    id={`read-news-${item.id}`}
                    onClick={() => {
                      alert(`[BERITA PORTAL IPTEK]\n\nJudul: ${item.title}\nKategori: ${item.category}\nTanggal: ${item.date}\nPenulis: ${item.author}\n\nIsi Lengkap:\n${item.content}`);
                    }}
                    className="text-xs font-bold text-[#0F4C81] group-hover:text-[#2F80ED] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Baca Selengkapnya <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>


      {/* 10. GALERI KEGIATAN MASONRY LIGHTBOX */}
      <section id="galeri" className="py-20 bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Lensa IPTEK</span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950 uppercase">Galeri Dokumentasi Kegiatan</h2>
            <p className="text-gray-500 text-xs md:text-sm">Potret interaktif keseruan siswa saat belajar harian, praktik, ekskul, dan raihan medali juara.</p>
          </div>

          {/* Gallery selector filters */}
          <div className="flex flex-wrap gap-2 justify-center font-heading select-none">
            {["Semua", "Kegiatan Belajar", "Praktik Jurusan", "Ekstrakurikuler", "Kunjungan Industri", "Wisuda", "Lomba dan Prestasi"].map((cat) => (
              <button
                key={cat}
                id={`gal-fn-${cat}`}
                onClick={() => setGalleryFilter(cat)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  galleryFilter === cat 
                    ? "bg-[#0F4C81] text-white shadow-md" 
                    : "bg-white text-gray-600 hover:bg-gray-200 border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry-style simulated grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredGallery.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative h-48 md:h-56 overflow-hidden rounded-xl bg-gray-200 cursor-pointer border border-gray-100"
                onClick={() => setSelectedImage(item.image)}
              >
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-3" />
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover select-none group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Labels */}
                <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none text-white transition-transform duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-[8px] uppercase tracking-widest text-amber-300 font-bold leading-none">{item.category}</span>
                  <p className="font-heading font-bold text-xs mt-0.5 leading-snug drop-shadow-sm">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 11. TESTIMONI SEKOLAH */}
      <section id="testimoni" className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Apa Kata Mereka</span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950 uppercase">Testimoni Stakeholder Sekolah</h2>
            <p className="text-gray-500 text-xs md:text-sm">Ulasan dan kesan tulus dari mahasiswa, alumni sukses, mitra industri, dan perwakilan wali siswa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {INITIAL_TESTIMONIALS.map((test) => (
              <div 
                key={test.id} 
                className="bg-slate-50 border rounded-2xl p-5 hover:bg-white hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-400 select-none">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 font-sans text-xs md:text-sm leading-relaxed italic">
                    "{test.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 border-t border-gray-200 mt-5">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-10 h-10 rounded-full object-cover border shrink-0 select-none"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-heading font-extrabold text-[#0F4C81] text-xs uppercase leading-tight">{test.name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">{test.role}</p>
                    <p className="text-[9px] text-gray-500 font-sans mt-0.5 line-clamp-1">{test.companyOrClass}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 12. SPECIAL PPDB (Countdown + Form + FAQ accordion) */}
      <section id="ppdb" className="py-20 bg-gradient-to-br from-primary-dark via-blue-900 to-indigo-950 text-white relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="px-3 py-1 bg-amber-400 text-slate-900 text-[10px] font-black rounded uppercase tracking-widest inline-block select-none">
              TAHUN KELAYAKAN 2026/2027
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase leading-tight text-white select-none">
              Pendaftaran Peserta Didik Baru Telah Dibuka!
            </h2>
            <p className="text-gray-300 font-sans text-xs md:text-sm leading-relaxed">
              Jaminan beasiswa bebas uang gedung dan potongan SPP khusus untuk pendaftar awal di Gelombang 1. Silakan isi form di bawah ini secara instan atau lakukan unduh file persyaratan pendaftaran.
            </p>

            {/* LIVE COUNTDOWN CLOCK TIMER */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 max-w-lg mx-auto shadow-lg select-none">
              <p className="text-[10px] uppercase text-amber-300 tracking-widest font-extrabold font-heading mb-2">COUNTDOWN PENUTUPAN GELOMBANG 1</p>
              <div className="grid grid-cols-4 gap-2 font-heading font-extrabold">
                <div className="bg-slate-950/40 p-2 rounded-xl border border-white/5">
                  <p className="text-xl sm:text-2xl text-white">{timeLeft.days}</p>
                  <p className="text-[8px] text-gray-300 uppercase mt-0.5 font-bold tracking-wider">HARI</p>
                </div>
                <div className="bg-slate-950/40 p-2 rounded-xl border border-white/5">
                  <p className="text-xl sm:text-2xl text-white">{timeLeft.hours}</p>
                  <p className="text-[8px] text-gray-300 uppercase mt-0.5 font-bold tracking-wider">JAM</p>
                </div>
                <div className="bg-slate-950/40 p-2 rounded-xl border border-white/5">
                  <p className="text-xl sm:text-2xl text-white">{timeLeft.minutes}</p>
                  <p className="text-[8px] text-gray-300 uppercase mt-0.5 font-bold tracking-wider">MENIT</p>
                </div>
                <div className="bg-slate-950/40 p-2 rounded-xl border border-white/5 animate-pulse">
                  <p className="text-xl sm:text-2xl text-accent-gold">{timeLeft.seconds}</p>
                  <p className="text-[8px] text-gray-300 uppercase mt-0.5 font-bold tracking-wider">DETIK</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-6">
            
            {/* Left side PPDB Form */}
            <div className="lg:col-span-7">
              <PPDBForm 
                onSuccess={() => {
                  setPpdbSuccessToast(true);
                  setTimeout(() => setPpdbSuccessToast(false), 8000);
                }} 
                onNewApplicantAdded={refreshCMSData}
              />
            </div>

            {/* Right side Steps & FAQ */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Alur Penerimaan card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner space-y-4">
                <h3 className="font-heading font-bold text-xs md:text-sm text-amber-300 uppercase flex items-center gap-1.5 tracking-wider select-none">
                  🧭 Alur Cepat Pendaftaran PPDB
                </h3>
                <div className="space-y-4 font-sans text-xs md:text-sm">
                  
                  <div className="flex gap-3 leading-relaxed">
                    <span className="w-6 h-6 shrink-0 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-xs select-none">1</span>
                    <div>
                      <p className="font-bold text-white uppercase text-xs">Isi Formulir Mandiri</p>
                      <p className="text-gray-300 text-xs">Isilah biodata calon siswa di form pendaftaran sebelah kiri secara online.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 leading-relaxed">
                    <span className="w-6 h-6 shrink-0 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-xs select-none">2</span>
                    <div>
                      <p className="font-bold text-white uppercase text-xs">Kirim Persyaratan Dasar</p>
                      <p className="text-gray-300 text-xs">Cetak kartu bukti registrasi Anda, lalu kirim fotokopi berkas ke WhatsApp Admin PPDB.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 leading-relaxed">
                    <span className="w-6 h-6 shrink-0 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-bold text-xs select-none">3</span>
                    <div>
                      <p className="font-bold text-white uppercase text-xs font-heading">Wawancara & Pemetaan</p>
                      <p className="text-gray-300 text-xs">Ikuti wawancara online atau panggil tim ke rumah untuk seleksi minat siswa secara ramah.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* FAQ Accordion block */}
              <div className="space-y-3">
                <h3 className="font-heading font-extrabold text-sm uppercase text-gray-200 tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-5 h-5 text-blue-400" /> FAQ Calon Wali Murid
                </h3>
                
                <div className="space-y-2">
                  {GENERAL_FAQ.map((faq, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden transition-all">
                      <button
                        id={`faq-btn-${idx}`}
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full text-left p-3.5 flex justify-between items-center hover:bg-white/5 transition-all cursor-pointer font-heading font-bold text-xs md:text-xs tracking-wider"
                      >
                        <span className="pr-3 leading-relaxed text-gray-100">{faq.question}</span>
                        <span className="text-amber-400 shrink-0 text-md">{expandedFaq === idx ? "−" : "+"}</span>
                      </button>
                      
                      {expandedFaq === idx && (
                        <div id={`faq-answer-${idx}`} className="p-3.5 pt-0 border-t border-white/5 text-gray-300 font-sans text-xs md:text-xs leading-relaxed leading-normal bg-slate-950/20">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* 13. CALL TO ACTION BANNER */}
      <section id="cta-banner" className="py-20 bg-gradient-to-r from-blue-900 to-primary-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">
          <h2 className="text-2xl md:text-4xl font-heading font-extrabold uppercase leading-snug">
            Bergabunglah Bersama IPTEK SCHOOL Tangsel & Wujudkan Masa Depan Cerdas Buah Hati Anda!
          </h2>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Diskusikan minat, potensi karir, serta kebutuhan beasiswa bagi putra-putri tercinta langsung bersama konsultan PPDB kami secara ramah dan profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center select-none pt-4">
            <button
              id="cta-join-daftar"
              onClick={() => scrollTo("ppdb")}
              className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-[#0F4C81] font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider"
            >
              Daftar Siswa Baru Now
            </button>
            <a
              id="cta-join-wa"
              href={`https://wa.me/${SCHOOL_PROFILE.whatsapp}?text=Halo%20Admin%20PPDB%20IPTEK%20Tangsel,%20saya%20tertarik%20bertanya%20mengenai%20sekolah`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-all uppercase tracking-wider text-center"
            >
              📞 Konsultasi WhatsApp
            </a>
          </div>
        </div>
      </section>


      {/* 14. CONTACT SECTION (Form validation + Google Maps) */}
      <section id="kontak" className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2F80ED]">Hubungi Kami</span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-950 uppercase">Kantor Layanan Administratif</h2>
            <p className="text-gray-500 text-xs md:text-sm">Silakan hubungi kami untuk konfirmasi dokumen, jadwalkan kunjungan sekolah, atau koordinasi.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Col Left: Contact Info and Maps */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4 text-sm">
                
                <div className="flex gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-[#2F80ED] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 font-heading text-xs uppercase tracking-wider">Lokasi Kampus Terpadu</p>
                    <p className="text-xs leading-relaxed text-gray-600 mt-1">{SCHOOL_PROFILE.address}</p>
                  </div>
                </div>

                <div className="flex gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-[#2F80ED] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 font-heading text-xs uppercase tracking-wider">Email Korespondensi</p>
                    <p className="text-xs text-gray-600 mt-1">{SCHOOL_PROFILE.email}</p>
                  </div>
                </div>

                <div className="flex gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-[#2F80ED] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 font-heading text-xs uppercase tracking-wider">Telepon & WhatsApp PPDB</p>
                    <p className="text-xs text-gray-600 mt-1">Telp: {SCHOOL_PROFILE.phone} &bull; WA: +62 821-1234-5678</p>
                  </div>
                </div>

                <div className="flex gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-[#2F80ED] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 font-heading text-xs uppercase tracking-wider">Jam Operasional Layanan</p>
                    <p className="text-xs text-gray-600 mt-1">{SCHOOL_PROFILE.operationalHours}</p>
                  </div>
                </div>

              </div>

              {/* Responsive Google Maps Embedded widget */}
              <div id="google-maps-frame" className="rounded-2xl overflow-hidden shadow-md border aspect-video w-full bg-gray-100">
                <iframe
                  title="IPTEK School Tangsel Map Location representation"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.085449785!2d106.666666!3d-6.333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f06ddcd4cbd3%3A0x401576d14fed910!2sPamulang%2C%20South%20Tangerang%20City%2C%20Banten!5e0!3m2!1sen!2sid!4v1714578901234!5m2!1sen!2sid"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

            </div>

            {/* Col Right: Interactive validated Contact Form */}
            <div className="lg:col-span-7">
              <form id="contact-form" onSubmit={handleContactSubmit} className="bg-gray-50 border p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-heading font-extrabold text-slate-900 text-sm md:text-md uppercase">Kirimkan Surat Pesan Anda</h3>
                
                {contactSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Pesan pengaduan/pertanyaan Anda berhasil dikirim! Kami akan merespon via email secepatnya.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5">Nama Lengkap Anda *</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Contoh: Andi Wijaya"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                    {contactErrors.name && <p className="text-[10px] text-red-500 mt-1">{contactErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5">Alamat Email Aktif *</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="Contoh: andi@gmail.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                    />
                    {contactErrors.email && <p className="text-[10px] text-red-500 mt-1">{contactErrors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5">Subjek / Perihal Pesan *</label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="Contoh: Pertanyaan Syarat Beasiswa Jalur Rapor"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                  />
                  {contactErrors.subject && <p className="text-[10px] text-red-500 mt-1">{contactErrors.subject}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1.5">Isi Pesan Detail *</label>
                  <textarea
                    id="contact-message"
                    placeholder="Ketik rincian pesan Anda di sini..."
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                  />
                  {contactErrors.message && <p className="text-[10px] text-red-500 mt-1">{contactErrors.message}</p>}
                </div>

                <button
                  id="contact-submit"
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#0F4C81] hover:bg-[#2F80ED] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Send className="w-3.5 h-3.5" /> Kirim Pesan Ke Admin
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>


      {/* 15. FOOTER COMPONENT */}
      <footer id="footer" className="bg-slate-950 text-white select-none relative pt-16 pb-8 border-t border-white/5">
        <div id="footer-inner" className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12">
          
          {/* Col 1 Left: Brand PROFILE */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-gradient-to-br from-blue-400 to-amber-400 rounded-xl flex items-center justify-center text-white">
                <School className="w-5 h-5" />
              </span>
              <h4 className="font-heading font-extrabold tracking-tight text-white uppercase text-base">
                IPTEK SCHOOL TANGSEL
              </h4>
            </div>
            <p className="text-gray-400 font-sans text-xs leading-relaxed">
              SMP & SMK IPTEK SCHOOL Tangsel adalah institusi pendidikan sains dan rekayasa terkemuka berakreditasi A yang mendidik siswa berintegritas tinggi serta berpandangan visioner industri digital.
            </p>
            <div className="flex gap-2.5 pt-2">
              {/* Social Medias */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-amber-400 hover:text-slate-950 transition-all rounded-lg text-xs font-semibold">IG</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-amber-400 hover:text-slate-950 transition-all rounded-lg text-xs font-semibold">FB</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-amber-400 hover:text-slate-950 transition-all rounded-lg text-xs font-semibold">YT</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-amber-400 hover:text-slate-950 transition-all rounded-lg text-xs font-semibold">TK</a>
            </div>
          </div>

          {/* Col 2: Quick links */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-amber-400">Navigasi Link</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-amber-400 transition-colors uppercase leading-none text-[10px] font-semibold cursor-pointer">Menuju Beranda</button></li>
              <li><button onClick={() => scrollTo("tentang")} className="hover:text-amber-400 transition-colors uppercase leading-none text-[10px] font-semibold cursor-pointer">Profil Tentang Kami</button></li>
              <li><button onClick={() => scrollTo("unit")} className="hover:text-amber-400 transition-colors uppercase leading-none text-[10px] font-semibold cursor-pointer">Unit SMP & SMK IPTEK</button></li>
              <li><button onClick={() => scrollTo("jurusan")} className="hover:text-amber-400 transition-colors uppercase leading-none text-[10px] font-semibold cursor-pointer">Program Jurusan SMK</button></li>
              <li><button onClick={() => scrollTo("fasilitas")} className="hover:text-amber-400 transition-colors uppercase leading-none text-[10px] font-semibold cursor-pointer">Sarana Fasilitas Belajar</button></li>
              <li><button onClick={() => scrollTo("prestasi")} className="hover:text-amber-400 transition-colors uppercase leading-none text-[10px] font-semibold cursor-pointer">Catatan Rekor Prestasi</button></li>
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div className="lg:col-span-5 space-y-3 text-left">
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-amber-400">Informasi Kontak Yayasan</h5>
            <div className="space-y-2 text-xs text-gray-400 font-sans leading-relaxed">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{SCHOOL_PROFILE.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Telp: {SCHOOL_PROFILE.phone} &bull; WA: +62 821-1234-5678</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>info@iptekschool-tangsel.sch.id</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{SCHOOL_PROFILE.operationalHours}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Powered info credit line */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-heading font-extrabold font-semibold">
            &copy; {new Date().getFullYear()} IPTEK SCHOOL Tangsel. All Rights Reserved.
          </p>
          <div className="flex gap-3 text-[10px] text-gray-400">
            <button onClick={() => handleAdminAction("ppdb")} className="hover:text-amber-400 font-bold uppercase transition-colors text-[10px] cursor-pointer">Administrator Portal</button>
            <span>&bull;</span>
            <span className="text-[9px] uppercase text-gray-500">SEO Friendly - Verified Schema Organization</span>
          </div>
        </div>
      </footer>


      {/* FLOATING ACTION INTERACTION TOOLS */}
      
      {/* 1. WHATSAPP QUICK BUTTON */}
      <a
        id="whatsapp-floating-trigger"
        href={`https://wa.me/${SCHOOL_PROFILE.whatsapp}?text=Halo%20Admin%20PPDB%20IPTEK%20Tangsel,%20berkenan%20meminta%20brosur%20dan%20informasi%20beasiswa?`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 left-6 z-40 p-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all duration-300 relative"
        title="Hubungi Admin PPDB via WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <Phone className="w-5.5 h-5.5" />
      </a>

      {/* 2. BACK TO TOP SCROLL BUTTON */}
      {showBackToTop && (
        <button
          id="back-to-top-trigger"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 p-3.5 bg-slate-900 border border-white/15 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-slate-800 transition-colors cursor-pointer"
          title="Scroll Kembali Ke Atas"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}


      {/* COMPONENT POPUP LAYER SYSTEM */}

      {/* 1. DYNAMIC LIGHTBOX FOR GALERIES IN LAPTOP OR PHONES */}
      {selectedImage && (
        <div 
          id="lightbox-frame" 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            id="close-lightbox-btn"
            onClick={() => setSelectedImage(null)} 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-[#F2C94C] text-white transition-all cursor-pointer"
            title="Tutup Galeri"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={selectedImage}
            alt="Expanded gallery snapshot representation"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* 2. VOCATIONAL PROGRAM DETAILS POPUP MODAL */}
      <ProgramsModal
        isOpen={isProgramModalOpen}
        onClose={() => {
          setIsProgramModalOpen(false);
          setSelectedProgram(null);
        }}
        program={selectedProgram}
      />

      {/* 3. SCHOOL CMS / PORTAL COMPILING PANEL */}
      <AdminCMS
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        onRefreshData={refreshCMSData}
        initialTab={cmsInitialTab}
      />

      {/* 4. AI-POWERED IMMERSIVE CHATBOT SERVICE WIDGET */}
      <AdmissionsChatbot />

      {/* 5. ADMIN LOGIN MODAL */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
