import React, { useState } from 'react';
import { 
  Building2, 
  Heart, 
  UserCheck, 
  Menu, 
  X, 
  Bell, 
  Phone, 
  ShieldCheck, 
  Briefcase, 
  UserCircle,
  MapPin,
  CalendarCheck,
  ChevronDown,
  Search,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenRoleSwitcher: () => void;
  onOpenFavorites: () => void;
  onOpenSpotlight?: () => void;
  onToggleMap?: () => void;
  isMapActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenRoleSwitcher, 
  onOpenFavorites, 
  onOpenSpotlight,
  onToggleMap,
  isMapActive = false
}) => {
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
    setActiveView,
    agencySettings
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [portalsDropdownOpen, setPortalsDropdownOpen] = useState(false);
  const t = getTranslation(language);

  const unreadNotifs = notifications.filter(n => !n.read);

  const handleNavClick = (view: 'public' | 'client-portal' | 'agent-portal' | 'admin-portal', sectionId?: string) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    setPortalsDropdownOpen(false);
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
    <header className="sticky top-0 z-40 w-full shadow-xs">
      
      {/* TOP UTILITY BAR (Pre-header) - Resolves all congestion and display issues */}
      <div className="bg-stone-950 text-stone-300 text-xs border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          
          {/* Left: Contact & Location */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a 
              href={`tel:${agencySettings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-stone-300 hover:text-amber-400 transition-colors font-medium whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>{agencySettings.phone}</span>
            </a>
            
            <div className="hidden sm:flex items-center gap-1.5 text-stone-400 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-amber-500/80" />
              <span>Sousse · Sahel Tunisien</span>
            </div>

            <div className="hidden md:inline-flex items-center text-[11px] text-amber-400/90 bg-amber-950/40 px-2 py-0.5 rounded-sm border border-amber-800/40">
              Agence Agréée · Titres Bleus Garantis
            </div>
          </div>

          {/* Right: Currency, Language & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Currency selector */}
            <div className="flex items-center bg-stone-900 rounded-md p-0.5 border border-stone-800 text-[11px] font-medium">
              {(['TND', 'EUR', 'USD'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    currency === c 
                      ? 'bg-amber-600 text-white font-bold shadow-xs' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title={`Devise ${c}`}
                >
                  {c === 'TND' ? 'DT' : c === 'EUR' ? '€' : '$'}
                </button>
              ))}
            </div>

            {/* Language selector */}
            <div className="flex items-center bg-stone-900 rounded-md p-0.5 border border-stone-800 text-[11px] font-medium">
              {(['fr', 'ar', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-1.5 py-0.5 rounded uppercase transition-colors ${
                    language === l 
                      ? 'bg-amber-600 text-white font-bold shadow-xs' 
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title={`Langue ${l}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={onOpenRoleSwitcher}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-stone-200 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-md transition-colors whitespace-nowrap"
              title="Tester les différents profils d'utilisateurs"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-stone-400 font-normal">Profil :</span>
              <span className="text-amber-300 font-bold">{getRoleLabel(currentUser.role)}</span>
            </button>

          </div>

        </div>
      </div>

      {/* MAIN NAVIGATION BAR */}
      <div className="bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* BRAND LOGO & IDENTITY */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleNavClick('public')}
                className="text-left group flex items-center gap-3 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-900 group-hover:bg-amber-700 text-amber-400 group-hover:text-white flex items-center justify-center font-display font-bold text-xl shadow-xs transition-colors shrink-0">
                  A
                </div>
                <div className="min-w-0">
                  <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-stone-900 block truncate group-hover:text-amber-800 transition-colors">
                    {t.agencyName}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-amber-700 font-semibold uppercase tracking-wider block">
                    Sousse & Sahel Tunisien
                  </span>
                </div>
              </button>
            </div>

            {/* DESKTOP NAVIGATION LINKS (Clean, no 'Quartiers de Sousse', no overflow) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-stone-600">
              <button 
                onClick={() => handleNavClick('public')} 
                className={`hover:text-stone-900 transition-colors whitespace-nowrap ${activeView === 'public' ? 'text-amber-800 font-semibold' : ''}`}
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

              {/* Portals Dropdown / Quick Links */}
              <div className="h-4 w-px bg-stone-200" aria-hidden="true" />

              <div className="relative">
                <button
                  onClick={() => setPortalsDropdownOpen(!portalsDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeView !== 'public'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {currentUser.role === 'client' && <UserCircle className="w-4 h-4 text-amber-700" />}
                  {currentUser.role === 'agent' && <Briefcase className="w-4 h-4 text-amber-700" />}
                  {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && <ShieldCheck className="w-4 h-4 text-amber-700" />}
                  {currentUser.role === 'visitor' && <UserCircle className="w-4 h-4 text-stone-500" />}
                  
                  <span>
                    {activeView === 'client-portal' ? 'Espace Client' :
                     activeView === 'agent-portal' ? 'Espace Agent' :
                     activeView === 'admin-portal' ? 'Back-office Admin' :
                     'Espaces Portails'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${portalsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {portalsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in">
                    <button
                      onClick={() => handleNavClick('client-portal')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-stone-50 ${activeView === 'client-portal' ? 'bg-amber-50 font-bold text-amber-900' : 'text-stone-700'}`}
                    >
                      <UserCircle className="w-4 h-4 text-amber-700" />
                      <div>
                        <div className="font-semibold">Espace Client</div>
                        <div className="text-[10px] text-stone-400">Favoris, demandes & visites</div>
                      </div>
                    </button>

                    {(currentUser.role === 'agent' || currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
                      <button
                        onClick={() => handleNavClick('agent-portal')}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-stone-50 ${activeView === 'agent-portal' ? 'bg-amber-50 font-bold text-amber-900' : 'text-stone-700'}`}
                      >
                        <Briefcase className="w-4 h-4 text-amber-700" />
                        <div>
                          <div className="font-semibold">Espace Agent (CRM)</div>
                          <div className="text-[10px] text-stone-400">Pipeline, leads & visites</div>
                        </div>
                      </button>
                    )}

                    {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
                      <button
                        onClick={() => handleNavClick('admin-portal')}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-stone-50 ${activeView === 'admin-portal' ? 'bg-amber-50 font-bold text-amber-900' : 'text-stone-700'}`}
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <div>
                          <div className="font-semibold">Back-office Admin</div>
                          <div className="text-[10px] text-stone-400">Gestion globale & catalogue</div>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              </div>

            </nav>

            {/* RIGHT ACTIONS: SEARCH, MAP, FAVORITES, NOTIFICATIONS & CTA */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Quick Spotlight Search (Cmd+K) */}
              {onOpenSpotlight && (
                <button
                  onClick={onOpenSpotlight}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-stone-600 hover:text-stone-900 bg-stone-100/80 hover:bg-stone-200/80 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-stone-200/60"
                  title="Recherche instantanée (Cmd+K)"
                  aria-label="Recherche instantanée"
                >
                  <Search className="w-4 h-4 text-amber-800" />
                  <span className="hidden md:inline">Recherche</span>
                  <kbd className="hidden lg:inline text-[9px] font-mono bg-white px-1 py-0.5 rounded border border-stone-300 text-stone-400">⌘K</kbd>
                </button>
              )}

              {/* Map View Quick Toggle */}
              {onToggleMap && (
                <button
                  onClick={onToggleMap}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                    isMapActive
                      ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                      : 'text-stone-700 hover:text-stone-900 bg-stone-100/80 hover:bg-stone-200/80 border-stone-200/60'
                  }`}
                  title="Afficher la recherche par carte interactive"
                  aria-label="Carte interactive"
                >
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span className="hidden md:inline">Carte Sousse</span>
                </button>
              )}

              {/* Favorites Button */}
              <button
                onClick={onOpenFavorites}
                className="relative p-2 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Biens favoris"
                aria-label="Biens favoris"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {unreadNotifs.length}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in">
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

              {/* Direct Action Button */}
              <button
                onClick={() => handleNavClick('public', 'contact-section')}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Programmer une Visite</span>
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
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          
          {/* Nav links (Clean, no 'Quartiers de Sousse') */}
          <div className="grid grid-cols-1 gap-1 text-sm font-medium text-stone-700">
            <button 
              onClick={() => handleNavClick('public')}
              className={`text-left py-2.5 px-3 rounded-lg hover:bg-stone-100 ${activeView === 'public' ? 'bg-amber-50 font-bold text-amber-900' : ''}`}
            >
              {t.navHome}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'properties-section')}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100"
            >
              {t.navProperties}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'services-section')}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100"
            >
              {t.navServices}
            </button>
            <button 
              onClick={() => handleNavClick('public', 'contact-section')}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-stone-100"
            >
              {t.navContact}
            </button>
          </div>

          {/* Portals Section */}
          <div className="pt-3 border-t border-stone-100 space-y-1.5">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3 mb-1">
              Espaces & Accès
            </div>

            <button 
              onClick={() => handleNavClick('client-portal')}
              className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between text-xs font-semibold ${
                activeView === 'client-portal' ? 'bg-amber-100 text-amber-900' : 'bg-stone-50 hover:bg-stone-100 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-amber-700" />
                <span>Espace Client & Acquéreur</span>
              </div>
            </button>

            {(currentUser.role === 'agent' || currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
              <button 
                onClick={() => handleNavClick('agent-portal')}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between text-xs font-semibold ${
                  activeView === 'agent-portal' ? 'bg-amber-100 text-amber-900' : 'bg-stone-50 hover:bg-stone-100 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-700" />
                  <span>Espace Agent Négociateur (CRM)</span>
                </div>
              </button>
            )}

            {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
              <button 
                onClick={() => handleNavClick('admin-portal')}
                className={`w-full text-left py-2 px-3 rounded-lg flex items-center justify-between text-xs font-semibold ${
                  activeView === 'admin-portal' ? 'bg-amber-100 text-amber-900' : 'bg-stone-50 hover:bg-stone-100 text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Back-office Administration</span>
                </div>
              </button>
            )}
          </div>

          {/* Quick Contact & Action */}
          <div className="pt-2 border-t border-stone-100">
            <a
              href={`tel:${agencySettings.phone.replace(/\s+/g, '')}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler l'Agence : {agencySettings.phone}</span>
            </a>
          </div>

        </div>
      )}

    </header>
  );
};
