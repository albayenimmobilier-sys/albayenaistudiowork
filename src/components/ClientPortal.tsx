import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Send, 
  Building, 
  MessageSquare, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Upload, 
  Check, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Property, Visit } from '../types';

interface ClientPortalProps {
  onSelectProperty: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  onSelectProperty,
  onRequestVisit
}) => {
  const { 
    currentUser, 
    properties, 
    favorites, 
    visits, 
    offers, 
    addProperty, 
    formatPrice 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'visits' | 'favorites' | 'offers' | 'submit-property' | 'messages'>('visits');

  // Filter visits for this client
  const myVisits = visits.filter(v => 
    v.clientUserId === currentUser.id || 
    v.clientEmail.toLowerCase() === currentUser.email.toLowerCase() ||
    currentUser.role === 'client'
  );

  const myFavorites = properties.filter(p => favorites.includes(p.id));

  // State for "Déposer mon bien" form
  const [submitTitle, setSubmitTitle] = useState('');
  const [submitType, setSubmitType] = useState<Property['type']>('appartement');
  const [submitTransaction, setSubmitTransaction] = useState<Property['transactionType']>('sale');
  const [submitPrice, setSubmitPrice] = useState<number>(350000);
  const [submitSurface, setSubmitSurface] = useState<number>(120);
  const [submitDistrict, setSubmitDistrict] = useState('Sahloul');
  const [submitBedrooms, setSubmitBedrooms] = useState(2);
  const [submitBathrooms, setSubmitBathrooms] = useState(1);
  const [submitDescription, setSubmitDescription] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Client messages mock
  const [messagesList, setMessagesList] = useState([
    {
      id: 'msg-1',
      sender: 'Karim Ben Salah (Conseiller Albayen)',
      date: '2026-09-28 09:15',
      text: 'Bonjour M. Gharbi, je vous confirme notre rendez-vous pour la Villa Kantaoui. Je vous attendrai devant le portail à 15h30 avec le dossier cadastral complet.',
      isAgent: true
    }
  ]);
  const [replyText, setReplyText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setMessagesList(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: currentUser.name,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        text: replyText,
        isAgent: false
      }
    ]);
    setReplyText('');
  };

  const handleDepositProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTitle) return;

    addProperty({
      ref: `AL-CL-${Math.floor(100 + Math.random() * 900)}`,
      title: submitTitle,
      description: submitDescription || 'Bien soumis directement par son propriétaire via le portail client Albayen Sousse.',
      type: submitType,
      transactionType: submitTransaction,
      price: submitPrice,
      currency: 'TND',
      surface: submitSurface,
      bedrooms: submitBedrooms,
      bathrooms: submitBathrooms,
      condition: 'bon_etat',
      country: 'Tunisie',
      governorate: 'Sousse',
      city: 'Sousse',
      district: submitDistrict,
      address: `Quartier ${submitDistrict}, Sousse`,
      showExactAddress: false,
      latitude: 35.83,
      longitude: 10.63,
      features: ['Climatisation', 'Titre Bleu individuel'],
      images: ['/src/assets/images/property_kantaoui_apartment_1790605943306.jpg'],
      mainImage: '/src/assets/images/property_kantaoui_apartment_1790605943306.jpg',
      documents: [],
      status: 'brouillon', // pending agency verification
      isFeatured: false,
      isNew: true,
      ownerId: currentUser.id
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab('visits');
    }, 2800);
  };

  const getStatusBadge = (status: Visit['status']) => {
    switch (status) {
      case 'demandee':
        return <span className="text-amber-800 bg-amber-50 border border-amber-200 text-xs px-2.5 py-0.5 rounded-sm font-semibold">En attente confirmation</span>;
      case 'confirmee':
        return <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-sm font-semibold">Visite Confirmée</span>;
      case 'reprogrammee':
        return <span className="text-indigo-800 bg-indigo-50 border border-indigo-200 text-xs px-2.5 py-0.5 rounded-sm font-semibold">Reprogrammée</span>;
      case 'effectuee':
        return <span className="text-stone-700 bg-stone-100 border border-stone-200 text-xs px-2.5 py-0.5 rounded-sm font-semibold">Visite Effectuée</span>;
      case 'annulee':
        return <span className="text-rose-800 bg-rose-50 border border-rose-200 text-xs px-2.5 py-0.5 rounded-sm font-semibold">Annulée</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-full overflow-x-hidden">
      
      {/* Client Profile Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-900 text-white flex items-center justify-center font-display text-2xl font-bold border-2 border-amber-500">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-stone-900">
                {currentUser.name}
              </h1>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">
                Compte Client Vérifié
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
              {currentUser.email} · {currentUser.phone || '+216 98 710 405'}
            </p>
          </div>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={() => setActiveTab('submit-property')}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Confier un bien à l'agence</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 mb-8 no-scrollbar">
        <button
          onClick={() => setActiveTab('visits')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'visits'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Mes Visites ({myVisits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Mes Favoris ({myFavorites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'offers'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mes Offres d'Achat ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'messages'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Messagerie Agence ({messagesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submit-property')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'submit-property'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Déposer un Bien</span>
        </button>
      </div>

      {/* TAB 1: VISITS TRACKER */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-display font-bold text-stone-900">
              Historique & Suivi des Rendez-vous de Visite
            </h2>
            <span className="text-xs text-stone-500">Mise à jour en temps réel</span>
          </div>

          {myVisits.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-800">Aucune visite programmée</p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Parcourez le catalogue Albayen Immobilier et cliquez sur « Demander une visite » sur la fiche de votre choix.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myVisits.map(visit => {
                const targetProp = properties.find(p => p.id === visit.propertyId);

                return (
                  <div
                    key={visit.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={visit.propertyImage}
                        alt={visit.propertyTitle}
                        className="w-24 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                        onClick={() => targetProp && onSelectProperty(targetProp)}
                        referrerPolicy="no-referrer"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                            Réf. {visit.propertyRef}
                          </span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          {getStatusBadge(visit.status)}
                        </div>

                        <h3 
                          onClick={() => targetProp && onSelectProperty(targetProp)}
                          className="text-sm sm:text-base font-semibold text-stone-900 truncate hover:text-amber-800 cursor-pointer"
                        >
                          {visit.propertyTitle}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-2 font-medium">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>Date : <strong>{visit.date}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>Créneau : <strong>{visit.timeSlot}</strong></span>
                          </div>
                          <div className="text-stone-400">·</div>
                          <span className="tabular-nums font-bold text-stone-900">
                            {formatPrice(visit.propertyPrice)}
                          </span>
                        </div>

                        {visit.comment && (
                          <p className="text-xs text-stone-500 mt-2 italic bg-stone-50 p-2 rounded-lg">
                            Note : "{visit.comment}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {targetProp && (
                        <button
                          onClick={() => onSelectProperty(targetProp)}
                          className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>Fiche du bien</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAVORITES */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h2 className="text-base font-display font-bold text-stone-900">
            Mes Propriétés Favorites Sauvegardées
          </h2>

          {myFavorites.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-800">Aucun favori enregistré</p>
              <p className="text-xs text-stone-500 mt-1">
                Explorez nos villas et appartements et cliquez sur l'icône cœur.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myFavorites.map(prop => (
                <div key={prop.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                  <div className="relative aspect-[4/3]">
                    <img src={prop.mainImage} alt={prop.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-white/90 text-stone-900 text-xs px-2 py-0.5 rounded-sm font-semibold">
                      {prop.ref}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-stone-500 font-medium block">{prop.district}, Sousse</span>
                    <h3 className="text-sm font-semibold text-stone-900 truncate mt-1">{prop.title}</h3>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                      <span className="text-sm font-bold text-stone-900">{formatPrice(prop.price)}</span>
                      <button
                        onClick={() => onSelectProperty(prop)}
                        className="text-xs font-semibold text-amber-800 hover:underline"
                      >
                        Consulter →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: OFFERS */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <h2 className="text-base font-display font-bold text-stone-900">
            Mes Offres d'Achat & Négociations en Cours
          </h2>

          <div className="space-y-3">
            {offers.map(off => (
              <div key={off.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-800">{off.ref}</span>
                    <span className="text-xs text-stone-500">· Bien {off.propertyRef}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-amber-100 text-amber-900">
                      {off.status === 'pending' ? 'En étude par le vendeur' : off.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-stone-900">{off.propertyTitle}</h3>
                  <div className="flex items-center gap-4 text-xs text-stone-600 mt-2 font-medium">
                    <span>Prix affiché : <strong className="tabular-nums">{off.listedPrice.toLocaleString('fr-FR')} DT</strong></span>
                    <span>Offre soumise : <strong className="tabular-nums text-stone-900 text-sm">{off.offeredAmount.toLocaleString('fr-FR')} DT</strong></span>
                  </div>
                </div>

                <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <p className="font-semibold text-stone-700">Dossier pris en charge par l'agence</p>
                  <p className="text-[11px] mt-0.5">Accompagnement juridique & compromis notarié</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUBMIT PROPERTY */}
      {activeTab === 'submit-property' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-3xl">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 block">Espace Propriétaire</span>
            <h2 className="text-xl font-display font-bold text-stone-900 mt-1">
              Confiez la Vente ou la Location de Votre Bien à Albayen Immobilier
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Renseignez les caractéristiques principales. Un conseiller se déplacera pour une visite d'estimation gratuite à Sousse.
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-emerald-950">Bien Enregistré avec Succès</h3>
              <p className="text-xs text-emerald-800 mt-1">
                Votre fiche a été transmise à notre équipe pour contrôle du titre de propriété et planification du shooting photo professionnel.
              </p>
            </div>
          ) : (
            <form onSubmit={handleDepositProperty} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Titre de votre annonce *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bel appartement S+2 avec terrasse vue dégagée Sahloul 4"
                  value={submitTitle}
                  onChange={(e) => setSubmitTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Type de bien *</label>
                  <select
                    value={submitType}
                    onChange={(e) => setSubmitType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  >
                    <option value="appartement">Appartement</option>
                    <option value="villa">Villa</option>
                    <option value="maison">Maison</option>
                    <option value="terrain">Terrain</option>
                    <option value="bureau">Bureau</option>
                    <option value="local_commercial">Local commercial</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Type de mandat *</label>
                  <select
                    value={submitTransaction}
                    onChange={(e) => setSubmitTransaction(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  >
                    <option value="sale">Vente</option>
                    <option value="rent">Location annuelle</option>
                    <option value="seasonal">Location saisonnière / vacances</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Prix souhaité (DT) *</label>
                  <input
                    type="number"
                    required
                    value={submitPrice}
                    onChange={(e) => setSubmitPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Surface (m²) *</label>
                  <input
                    type="number"
                    required
                    value={submitSurface}
                    onChange={(e) => setSubmitSurface(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">Quartier à Sousse *</label>
                  <select
                    value={submitDistrict}
                    onChange={(e) => setSubmitDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  >
                    <option value="Port El Kantaoui">Port El Kantaoui</option>
                    <option value="Sahloul">Sahloul</option>
                    <option value="Hammam Sousse">Hammam Sousse</option>
                    <option value="Corniche Boujaafar">Corniche Boujaafar</option>
                    <option value="Khezama">Khezama</option>
                    <option value="Chott Mariem">Chott Mariem</option>
                    <option value="Sousse Centre">Sousse Centre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Description & Prestations</label>
                <textarea
                  rows={3}
                  placeholder="État du bien, étage, présence ascenseur, parking, titre foncier (titre bleu), etc."
                  value={submitDescription}
                  onChange={(e) => setSubmitDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Valider et Soumettre le Bien
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 5: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden max-w-3xl">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium">Interlocuteur dédié</span>
              <h3 className="text-sm font-bold text-stone-900">Karim Ben Salah (Agence Albayen Sousse)</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
              En ligne
            </span>
          </div>

          <div className="p-4 space-y-3 min-h-[220px] max-h-[350px] overflow-y-auto">
            {messagesList.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isAgent ? 'items-start' : 'items-end'}`}
              >
                <div className={`p-3.5 rounded-2xl max-w-md text-xs sm:text-sm ${
                  msg.isAgent 
                    ? 'bg-stone-100 text-stone-900 rounded-tl-xs' 
                    : 'bg-amber-600 text-white rounded-tr-xs'
                }`}>
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {msg.sender} · {msg.date.split(' ')[1]}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-200 bg-stone-50 flex items-center gap-2">
            <input
              type="text"
              placeholder="Écrivez votre message à votre agent..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-white border border-stone-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button
              type="submit"
              className="p-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
