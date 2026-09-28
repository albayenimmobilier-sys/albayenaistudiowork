import React, { useState } from 'react';
import { 
  Building2, 
  Heart, 
  UserCheck, 
  Globe, 
  Menu, 
  X, 
  Bell, 
  Compass, 
  Phone, 
  ShieldCheck, 
  Briefcase, 
  UserCircle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenRoleSwitcher: () => void;
  onOpenFavorites: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRoleSwitcher, onOpenFavorites }) => {
  const { 
    currentUser, 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    favorites, 
    notifications, 
    markNotificationRead,
    activeView, 
    setActiveView 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const t = getTranslation(language);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleNavClick = (view: 'public' | 'client-portal' | 'agent-portal' | 'admin-portal', sectionId?: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    if (sectionId && view === 'public') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'visitor': return 'Visiteur';
      case 'client': return 'Client';
      case 'agent': return 'Agent';
      case 'admin': return 'Admin';
      case 'superadmin': return 'Super Admin';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ZONE 1: BRAND ZONE (Strict Top Bar Contract: Single text element wordmark) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('public')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-display font-bold text-xl shadow-xs">
                A
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-stone-900 block group-hover:text-amber-700 transition-colors">
                  {t.agencyName}
                </span>
                <span className="text-[11px] text-stone-500 uppercase tracking-widest font-medium block">
                  Sousse · Sahel Tunisien
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: 4-6 CLEAN NAV LINKS (Single-line, no capsules) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button 
              onClick={() => handleNavClick('public')} 
              className={`hover:text-stone-900 transition-colors whitespace-nowrap ${activeView === 'public' ? 'text-stone-900 font-semibold' : ''}`}
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'properties-section')} 
              className="hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              {t.navProperties}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'districts-section')} 
              className="hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              {t.navDistricts}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'services-section')} 
              className="hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              {t.navServices}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'contact-section')} 
              className="hover:text-stone-900 transition-colors whitespace-nowrap"
            >
              {t.navContact}
            </button>

            {/* Portal Direct Quick Links */}
            <div className="h-4 w-px bg-stone-200 mx-1" aria-hidden="true" />

            <button 
              onClick={() => handleNavClick('client-portal')} 
              className={`hover:text-amber-800 transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeView === 'client-portal' ? 'text-amber-900 font-semibold' : ''}`}
            >
              <UserCircle className="w-4 h-4 text-stone-400" />
              <span>{t.navClientPortal}</span>
            </button>

            {(currentUser.role === 'agent' || currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
              <button 
                onClick={() => handleNavClick('agent-portal')} 
                className={`hover:text-amber-800 transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeView === 'agent-portal' ? 'text-amber-900 font-semibold' : ''}`}
              >
                <Briefcase className="w-4 h-4 text-stone-400" />
                <span>{t.navAgentPortal}</span>
              </button>
            )}

            {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
              <button 
                onClick={() => handleNavClick('admin-portal')} 
                className={`hover:text-amber-800 transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeView === 'admin-portal' ? 'text-amber-900 font-semibold' : ''}`}
              >
                <ShieldCheck className="w-4 h-4 text-stone-400" />
                <span>{t.navAdminPortal}</span>
              </button>
            )}
          </nav>

          {/* ZONE 3: ACTIONS & CONTROLS */}
          <div className="flex items-center gap-2.5">
            
            {/* Currency selector */}
            <div className="hidden sm:flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs font-medium">
              {(['TND', 'EUR', 'USD'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded-md transition-colors ${currency === c ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-800'}`}
                >
                  {c === 'TND' ? 'DT' : c === 'EUR' ? '€' : '$'}
                </button>
              ))}
            </div>

            {/* Language selector */}
            <div className="hidden sm:flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs font-medium">
              {(['fr', 'ar', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2 py-1 rounded-md uppercase transition-colors ${language === l ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-800'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Favorites Button */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Biens favoris"
              aria-label="Biens favoris"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Notifications ({notifications.length})</span>
                    {unreadNotifs.length > 0 && (
                      <span className="text-xs text-amber-700 font-medium">
                        {unreadNotifs.length} nouvelle(s)
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-xs text-stone-500 text-center">Aucune notification</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.type === 'visit') {
                              if (currentUser.role === 'client') setActiveView('client-portal');
                              else setActiveView('agent-portal');
                            }
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3 text-left hover:bg-stone-50 cursor-pointer transition-colors ${!n.read ? 'bg-amber-50/50' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-stone-900">{n.title}</span>
                            <span className="text-[10px] text-stone-400">{n.date.split(' ')[1]}</span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill / Button */}
            <button
              onClick={onOpenRoleSwitcher}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors whitespace-nowrap"
              title="Tester les rôles de l'application"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden md:inline text-stone-500">Profil :</span>
              <span className="font-semibold text-stone-900">{getRoleLabel(currentUser.role)}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5 text-xs">
              {(['TND', 'EUR', 'USD'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded-md ${currency === c ? 'bg-white font-bold shadow-xs' : 'text-stone-500'}`}
                >
                  {c === 'TND' ? 'DT' : c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5 text-xs">
              {(['fr', 'ar', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2 py-1 rounded-md uppercase ${language === l ? 'bg-white font-bold shadow-xs' : 'text-stone-500'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm font-medium text-stone-700">
            <button 
              onClick={() => handleNavClick('public')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'properties-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              {t.navProperties}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'districts-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              {t.navDistricts}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'services-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              {t.navServices}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'contact-section')}
              className="text-left py-2 px-3 rounded-lg hover:bg-stone-100"
            >
              {t.navContact}
            </button>
            
            <div className="pt-2 border-t border-stone-100">
              <button 
                onClick={() => handleNavClick('client-portal')}
                className="w-full text-left py-2 px-3 rounded-lg text-amber-900 bg-amber-50/70 font-semibold flex items-center justify-between"
              >
                <span>{t.navClientPortal}</span>
                <UserCircle className="w-4 h-4 text-amber-700" />
              </button>
              <button 
                onClick={() => handleNavClick('agent-portal')}
                className="w-full text-left py-2 px-3 rounded-lg text-stone-800 hover:bg-stone-100 font-semibold flex items-center justify-between mt-1"
              >
                <span>{t.navAgentPortal} (CRM)</span>
                <Briefcase className="w-4 h-4 text-stone-600" />
              </button>
              <button 
                onClick={() => handleNavClick('admin-portal')}
                className="w-full text-left py-2 px-3 rounded-lg text-stone-800 hover:bg-stone-100 font-semibold flex items-center justify-between mt-1"
              >
                <span>{t.navAdminPortal}</span>
                <ShieldCheck className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
