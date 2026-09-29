import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Send,
  Building,
  DollarSign,
  UserCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UnifiedContact, ContactRole, CRMInteractionType, Property } from '../../types';

interface ContactsManagerProps {
  onSelectProperty?: (property: Property) => void;
}

export const ContactsManager: React.FC<ContactsManagerProps> = ({ onSelectProperty }) => {
  const { 
    unifiedContacts, 
    crmInteractions, 
    crmTasks, 
    properties,
    addUnifiedContact, 
    updateUnifiedContact, 
    deleteUnifiedContact, 
    mergeContacts, 
    detectDuplicateContacts, 
    addCRMInteraction,
    matchContactWithProperties,
    formatPrice,
    currentUser
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<ContactRole | 'all'>('all');
  const [selectedContact, setSelectedContact] = useState<UnifiedContact | null>(null);

  // New Contact Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCity, setFormCity] = useState('Sousse');
  const [formRoles, setFormRoles] = useState<ContactRole[]>(['prospect']);
  const [formNotes, setFormNotes] = useState('');
  const [formBudgetMin, setFormBudgetMin] = useState<number>(300000);
  const [formBudgetMax, setFormBudgetMax] = useState<number>(800000);
  const [formTargetDistricts, setFormTargetDistricts] = useState<string>('Sahloul, Kantaoui');

  // Duplicate merge modal
  const [duplicateModalTarget, setDuplicateModalTarget] = useState<UnifiedContact | null>(null);
  const [duplicateModalSource, setDuplicateModalSource] = useState<UnifiedContact | null>(null);

  // Log interaction form state inside contact drawer
  const [interactionType, setInteractionType] = useState<CRMInteractionType>('appel');
  const [interactionContent, setInteractionContent] = useState('');
  const [interactionResult, setInteractionResult] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [nextActionDate, setNextActionDate] = useState('');

  // Filtered contacts
  const filteredContacts = unifiedContacts.filter(c => {
    const matchesSearch = `${c.firstName} ${c.lastName} ${c.phone} ${c.email} ${c.ref} ${c.city}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || c.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  // Calculate potential duplicates across entire contact list
  const duplicateAlerts = unifiedContacts.flatMap(c => {
    const dupes = detectDuplicateContacts({
      id: c.id,
      phone: c.phone,
      email: c.email,
      firstName: c.firstName,
      lastName: c.lastName
    });
    return dupes.map(d => ({ contactA: c, contactB: d.matchedWith, score: d.matchScore, reasons: d.matchReasons }));
  }).filter((item, idx, self) => 
    // Deduplicate pair (A, B) vs (B, A)
    self.findIndex(t => (t.contactA.id === item.contactB.id && t.contactB.id === item.contactA.id) || (t.contactA.id === item.contactA.id && t.contactB.id === item.contactB.id)) === idx &&
    item.contactA.id < item.contactB.id
  );

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName.trim() || !formPhone.trim()) return;

    // Check for duplicate warning before saving
    const dupes = detectDuplicateContacts({
      phone: formPhone,
      email: formEmail,
      firstName: formFirstName,
      lastName: formLastName
    });

    const newContact = addUnifiedContact({
      firstName: formFirstName,
      lastName: formLastName,
      phone: formPhone,
      secondaryPhones: [],
      email: formEmail,
      city: formCity,
      country: 'Tunisie',
      preferredLanguage: 'fr',
      type: 'particulier',
      roles: formRoles,
      source: 'passage_agence',
      agentId: currentUser.id,
      status: 'chaud',
      notes: formNotes,
      searchCriteria: formRoles.includes('acquereur') || formRoles.includes('investisseur') ? {
        transactionType: 'sale',
        propertyTypes: ['appartement', 'villa'],
        budgetMin: formBudgetMin,
        budgetMax: formBudgetMax,
        targetDistricts: formTargetDistricts.split(',').map(s => s.trim())
      } : undefined
    });

    setIsAddModalOpen(false);
    setSelectedContact(newContact);
    resetForm();

    if (dupes.length > 0) {
      alert(`⚠️ Attention : Ce contact ressemble fortement à une fiche existante (${dupes[0].matchedWith.firstName} ${dupes[0].matchedWith.lastName}). Vous pourrez les fusionner si nécessaire.`);
    }
  };

  const resetForm = () => {
    setFormFirstName('');
    setFormLastName('');
    setFormPhone('');
    setFormEmail('');
    setFormNotes('');
    setFormRoles(['prospect']);
  };

  const toggleFormRole = (role: ContactRole) => {
    setFormRoles(prev => 
      prev.includes(role) 
        ? (prev.length > 1 ? prev.filter(r => r !== role) : prev) 
        : [...prev, role]
    );
  };

  const handleAddInteraction = (contactId: string) => {
    if (!interactionContent.trim() || !selectedContact) return;
    addCRMInteraction({
      contactId: selectedContact.id,
      contactName: `${selectedContact.firstName} ${selectedContact.lastName}`,
      type: interactionType,
      content: interactionContent,
      result: interactionResult || undefined,
      nextAction: nextAction || undefined,
      nextActionDate: nextActionDate || undefined
    });
    setInteractionContent('');
    setInteractionResult('');
    setNextAction('');
    setNextActionDate('');
  };

  const roleLabels: Record<ContactRole, { label: string; color: string }> = {
    proprietaire: { label: 'Propriétaire', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    acquereur: { label: 'Acquéreur', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    investisseur: { label: 'Investisseur', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    locataire: { label: 'Locataire', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    prospect: { label: 'Prospect', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    ancien_client: { label: 'Ancien Client', color: 'bg-stone-100 text-stone-700 border-stone-300' }
  };

  const contactInteractions = selectedContact 
    ? crmInteractions.filter(i => i.contactId === selectedContact.id)
    : [];

  const contactTasks = selectedContact
    ? crmTasks.filter(t => t.contactId === selectedContact.id || t.contactName?.toLowerCase().includes(selectedContact.lastName.toLowerCase()))
    : [];

  const matchedProps = selectedContact
    ? matchContactWithProperties(selectedContact)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Duplicates alert */}
      {duplicateAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900">
                {duplicateAlerts.length} doublon(s) potentiel(s) détecté(s) dans le CRM
              </h4>
              <p className="text-xs text-amber-700">
                Une même personne peut posséder plusieurs rôles (Propriétaire, Acquéreur). Fusionnez les fiches pour conserver l'historique complet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDuplicateModalTarget(duplicateAlerts[0].contactA);
                setDuplicateModalSource(duplicateAlerts[0].contactB);
              }}
              className="px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              Examiner & Fusionner
            </button>
          </div>
        </div>
      )}

      {/* Action Header & Search Bar */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, téléphone (+216), email, réf..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                roleFilter === 'all' ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Tous ({unifiedContacts.length})
            </button>
            {(Object.keys(roleLabels) as ContactRole[]).map(role => {
              const count = unifiedContacts.filter(c => c.roles.includes(role)).length;
              return (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1 ${
                    roleFilter === role ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{roleLabels[role].label}</span>
                  <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Contact Unifié</span>
        </button>
      </div>

      {/* Contacts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredContacts.map(contact => {
          const matchCount = matchContactWithProperties(contact).length;
          const interactionsCount = crmInteractions.filter(i => i.contactId === contact.id).length;

          return (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`bg-white rounded-xl border p-5 transition-all cursor-pointer hover:shadow-md relative flex flex-col justify-between ${
                selectedContact?.id === contact.id ? 'border-amber-800 ring-2 ring-amber-800/15' : 'border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={contact.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
                      alt={contact.firstName}
                      className="w-11 h-11 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900 leading-tight">
                          {contact.firstName} {contact.lastName}
                        </h4>
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                          {contact.ref}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {contact.city || 'Sousse'} • {contact.type}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    contact.status === 'chaud' ? 'bg-red-100 text-red-700' :
                    contact.status === 'actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {contact.status}
                  </span>
                </div>

                {/* Multi-roles Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {contact.roles.map(r => (
                    <span
                      key={r}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${roleLabels[r].color}`}
                    >
                      {roleLabels[r].label}
                    </span>
                  ))}
                </div>

                {/* Quick Info & Contacts */}
                <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <a 
                        href={`tel:${contact.phone}`} 
                        onClick={(e) => e.stopPropagation()} 
                        className="font-medium text-stone-800 hover:text-amber-800"
                      >
                        {contact.phone}
                      </a>
                    </span>
                    <a
                      href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline"
                    >
                      WhatsApp
                    </a>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                </div>

                {/* Search criteria snippet if buyer */}
                {contact.searchCriteria && (
                  <div className="mt-3 text-[11px] text-stone-500 border-t border-stone-100 pt-2 flex items-center justify-between">
                    <span>Budget : {formatPrice(contact.searchCriteria.budgetMax)}</span>
                    <span className="text-amber-800 font-semibold">{matchCount} bien(s) compatibles</span>
                  </div>
                )}
              </div>

              {/* Bottom footer button */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                  {interactionsCount} interaction(s)
                </span>
                <span className="text-amber-800 font-medium flex items-center gap-1 hover:underline">
                  Ouvrir fiche <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Detailed Drawer / File Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-6 bg-stone-900 text-white flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedContact.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'}
                  alt={selectedContact.firstName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-600/50"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-display font-bold text-white">
                      {selectedContact.firstName} {selectedContact.lastName}
                    </h3>
                    <span className="text-xs bg-stone-800 text-amber-400 px-2 py-0.5 rounded font-mono">
                      {selectedContact.ref}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1">
                    Contact enregistré le {selectedContact.createdAt} • Langue : {selectedContact.preferredLanguage.toUpperCase()}
                  </p>
                  
                  {/* Multi-roles display */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedContact.roles.map(r => (
                      <span key={r} className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-800 text-amber-200 border border-stone-700">
                        {roleLabels[r].label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedContact(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Tabs / Body */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Direct Communication Bar */}
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={`tel:${selectedContact.phone}`}
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-center gap-2 text-xs font-semibold text-stone-800 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Appeler
                </a>
                <a
                  href={`https://wa.me/${selectedContact.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  WhatsApp
                </a>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-center gap-2 text-xs font-semibold text-stone-800 transition-colors"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email
                </a>
              </div>

              {/* Commercial Notes */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
                  Notes & Profil Commercial
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                  {selectedContact.notes || 'Aucune note commerciale enregistrée pour le moment.'}
                </p>
              </div>

              {/* Matching Properties Section (if buyer or investor) */}
              {(selectedContact.roles.includes('acquereur') || selectedContact.roles.includes('investisseur')) && (
                <div className="border border-stone-200 rounded-xl p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-800" />
                      <h4 className="text-sm font-bold text-stone-900">
                        Rapprochement Automatique (Matching Portefeuille)
                      </h4>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                      {matchedProps.length} biens trouvés
                    </span>
                  </div>

                  {matchedProps.length === 0 ? (
                    <p className="text-xs text-stone-500">
                      Aucun bien disponible ne correspond aux critères stricts actuellement.
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {matchedProps.map(({ property, score, matchReasons }) => (
                        <div
                          key={property.id}
                          className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={property.mainImage}
                              alt={property.title}
                              className="w-12 h-10 rounded object-cover"
                            />
                            <div>
                              <p className="font-semibold text-stone-900 truncate max-w-xs">
                                {property.ref} - {property.title}
                              </p>
                              <p className="text-[11px] text-stone-500">
                                {property.district} • {formatPrice(property.price)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                              {score}% match
                            </span>
                            {onSelectProperty && (
                              <button
                                onClick={() => onSelectProperty(property)}
                                className="px-2 py-1 bg-amber-800 text-white rounded text-[11px] font-medium hover:bg-amber-900"
                              >
                                Voir
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Log new CRM Interaction */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white">
                <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-800" />
                  Consigner une Nouvelle Interaction
                </h4>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block mb-1">Type d'échange</label>
                      <select
                        value={interactionType}
                        onChange={(e) => setInteractionType(e.target.value as any)}
                        className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                      >
                        <option value="appel">Appel Téléphonique</option>
                        <option value="whatsapp">Échange WhatsApp</option>
                        <option value="email">Email</option>
                        <option value="rendez_vous">Rendez-vous Agence</option>
                        <option value="visite">Visite Terrain</option>
                        <option value="note">Note Interne</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-stone-600 block mb-1">Date prochaine action</label>
                      <input
                        type="date"
                        value={nextActionDate}
                        onChange={(e) => setNextActionDate(e.target.value)}
                        className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Compte-rendu de l'échange</label>
                    <textarea
                      rows={2}
                      placeholder="Détails de la conversation..."
                      value={interactionContent}
                      onChange={(e) => setInteractionContent(e.target.value)}
                      className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Résultat (ex: Intéressé, À relancer...)"
                      value={interactionResult}
                      onChange={(e) => setInteractionResult(e.target.value)}
                      className="text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Prochaine action (ex: Envoyer plans...)"
                      value={nextAction}
                      onChange={(e) => setNextAction(e.target.value)}
                      className="text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg"
                    />
                  </div>

                  <button
                    onClick={() => handleAddInteraction(selectedContact.id)}
                    className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Enregistrer dans la Timeline
                  </button>
                </div>
              </div>

              {/* Timeline of interactions */}
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-800" />
                  Timeline Chronologique ({contactInteractions.length} événements)
                </h4>

                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                  {contactInteractions.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">Aucune interaction consignée.</p>
                  ) : (
                    contactInteractions.map(int => (
                      <div key={int.id} className="relative">
                        <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-amber-800 border-2 border-white" />
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider text-amber-800">
                              {int.type} • {int.authorName}
                            </span>
                            <span className="text-[11px] text-stone-400">{int.date}</span>
                          </div>
                          <p className="text-stone-700">{int.content}</p>
                          {int.result && (
                            <p className="text-emerald-700 font-medium text-[11px]">
                              Résultat : {int.result}
                            </p>
                          )}
                          {int.nextAction && (
                            <p className="text-blue-700 font-medium text-[11px]">
                              Prochaine action : {int.nextAction} ({int.nextActionDate || 'N/A'})
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal: Fusionner deux fiches doublons */}
      {duplicateModalTarget && duplicateModalSource && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-800">
              <Copy className="w-6 h-6" />
              <h3 className="text-lg font-bold text-stone-900">
                Fusionner les fiches contacts (Dé-duplication)
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Le système va conserver la fiche principale tout en y agrégeant automatiquement l'ensemble des rôles, numéros de téléphone secondaires, interactions de timeline, et biens associés de la seconde fiche.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">Fiche Principale (Conservée)</span>
                <p className="font-bold text-stone-900">{duplicateModalTarget.firstName} {duplicateModalTarget.lastName}</p>
                <p className="text-stone-500">{duplicateModalTarget.phone}</p>
                <p className="text-stone-500">{duplicateModalTarget.email}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {duplicateModalTarget.roles.map(r => (
                    <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 font-medium">{r}</span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-amber-700 block mb-1">Fiche Doublon (Fusionnée)</span>
                <p className="font-bold text-stone-900">{duplicateModalSource.firstName} {duplicateModalSource.lastName}</p>
                <p className="text-stone-500">{duplicateModalSource.phone}</p>
                <p className="text-stone-500">{duplicateModalSource.email}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {duplicateModalSource.roles.map(r => (
                    <span key={r} className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 font-medium">{r}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => {
                  setDuplicateModalTarget(null);
                  setDuplicateModalSource(null);
                }}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-100"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  mergeContacts(duplicateModalTarget.id, duplicateModalSource.id);
                  setDuplicateModalTarget(null);
                  setDuplicateModalSource(null);
                }}
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Confirmer la Fusion Définitive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nouveau Contact Unifié */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-800" />
                <h3 className="text-base font-bold text-stone-900">Nouveau Contact Unifié Albayen</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Mohamed"
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Ben Ali"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Téléphone Principal *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+216 98 000 000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Adresse Email</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Multi-roles Selector */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1.5">
                  Rôles de la personne (Cochez tous les rôles applicables)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(roleLabels) as ContactRole[]).map(r => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => toggleFormRole(r)}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                        formRoles.includes(r)
                          ? 'border-amber-800 bg-amber-50 text-amber-900 font-semibold'
                          : 'border-stone-200 bg-stone-50 text-stone-600'
                      }`}
                    >
                      <span>{roleLabels[r].label}</span>
                      {formRoles.includes(r) && <CheckCircle className="w-3.5 h-3.5 text-amber-800" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Informations & Contexte Commercial</label>
                <textarea
                  rows={3}
                  placeholder="Détails du projet, biens possédés, attentes..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-semibold shadow-xs"
                >
                  Enregistrer le Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
