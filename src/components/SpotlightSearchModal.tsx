import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Property, UnifiedContact } from '../types';
import { 
  Search, 
  Building2, 
  User, 
  MapPin, 
  FileText, 
  ArrowRight, 
  Command, 
  X,
  Compass,
  Sparkles
} from 'lucide-react';
import { SOUSSE_DISTRICTS_DATA } from '../data/sousseGeography';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  onSelectContact?: (contact: UnifiedContact) => void;
  onSelectDistrict?: (districtName: string) => void;
}

export const SpotlightSearchModal: React.FC<SpotlightSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
  onSelectContact,
  onSelectDistrict
}) => {
  const { properties, unifiedContacts, setActiveView } = useApp();
  const [query, setQuery] = useState('');

  // Handle escape and keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();

  // Search Properties
  const matchedProperties = properties.filter(p => 
    p.title.toLowerCase().includes(normalizedQuery) ||
    p.ref.toLowerCase().includes(normalizedQuery) ||
    p.district.toLowerCase().includes(normalizedQuery) ||
    p.city.toLowerCase().includes(normalizedQuery) ||
    p.type.toLowerCase().includes(normalizedQuery)
  ).slice(0, 4);

  // Search Contacts
  const matchedContacts = unifiedContacts.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(normalizedQuery) ||
    c.phone.includes(normalizedQuery) ||
    c.email.toLowerCase().includes(normalizedQuery) ||
    c.ref.toLowerCase().includes(normalizedQuery)
  ).slice(0, 3);

  // Search Sousse Districts
  const matchedDistricts = SOUSSE_DISTRICTS_DATA.filter(d => 
    d.name.toLowerCase().includes(normalizedQuery) ||
    d.nameAr.includes(query) ||
    d.sectors.some(s => s.toLowerCase().includes(normalizedQuery))
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50/50">
          <Search className="w-5 h-5 text-amber-800 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Rechercher un bien, un client, un mandat, un quartier de Sousse (ex: Sahloul, AL-SO-101)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-stone-900 placeholder-stone-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold text-stone-500 bg-stone-200 rounded border border-stone-300">
            ESC
          </kbd>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 sm:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto divide-y divide-stone-100 flex-1">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-stone-400">
              <Command className="w-8 h-8 mx-auto mb-2 text-stone-300" />
              <p className="font-semibold text-stone-600">Recherche Universelle Instantanée</p>
              <p className="mt-1">Tapez une référence de bien, un nom de client ou un quartier de Sousse.</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Properties Results */}
              {matchedProperties.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 px-2 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-800" />
                    Biens Immobiliers ({matchedProperties.length})
                  </div>
                  <div className="space-y-1">
                    {matchedProperties.map(prop => (
                      <button
                        key={prop.id}
                        onClick={() => {
                          onSelectProperty(prop);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-amber-50/60 text-left transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={prop.mainImage || prop.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-stone-900 truncate group-hover:text-amber-900">
                              {prop.title}
                            </div>
                            <div className="text-[11px] text-stone-500 flex items-center gap-2">
                              <span className="font-semibold text-amber-800">{prop.ref}</span>
                              <span>·</span>
                              <span>{prop.district}</span>
                              <span>·</span>
                              <span className="font-bold text-stone-800">{prop.price.toLocaleString('fr-FR')} DT</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-800 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contacts Results */}
              {matchedContacts.length > 0 && (
                <div className="pt-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 px-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    Contacts & Clients CRM ({matchedContacts.length})
                  </div>
                  <div className="space-y-1">
                    {matchedContacts.map(contact => (
                      <button
                        key={contact.id}
                        onClick={() => {
                          if (onSelectContact) onSelectContact(contact);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-2">
                            <span>{contact.phone}</span>
                            <span>·</span>
                            <span className="capitalize">{contact.roles.join(', ')}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                          {contact.ref}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sousse Districts Results */}
              {matchedDistricts.length > 0 && (
                <div className="pt-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 px-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Quartiers & Micro-Zones de Sousse ({matchedDistricts.length})
                  </div>
                  <div className="space-y-1">
                    {matchedDistricts.map(dist => (
                      <button
                        key={dist.id}
                        onClick={() => {
                          if (onSelectDistrict) onSelectDistrict(dist.name);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            {dist.name} <span className="font-normal text-stone-500 font-arabic">({dist.nameAr})</span>
                          </div>
                          <div className="text-[11px] text-stone-500">
                            Délégation : {dist.delegation} · Prix moyen : ~{dist.averagePriceM2Apartment} DT/m²
                          </div>
                        </div>
                        <span className="text-xs text-amber-800 font-semibold underline">Filtrer →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedProperties.length === 0 && matchedContacts.length === 0 && matchedDistricts.length === 0 && (
                <div className="py-8 text-center text-xs text-stone-500">
                  Aucun résultat correspondant à "<span className="font-semibold text-stone-800">{query}</span>".
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-4">
            <span>Navigation : <kbd className="font-mono font-bold bg-white px-1 border rounded">↑</kbd> <kbd className="font-mono font-bold bg-white px-1 border rounded">↓</kbd></span>
            <span>Ouvrir : <kbd className="font-mono font-bold bg-white px-1 border rounded">Entrée</kbd></span>
          </div>
          <span className="text-amber-800 font-semibold">Albayen Immobilier Sousse</span>
        </div>

      </div>
    </div>
  );
};
