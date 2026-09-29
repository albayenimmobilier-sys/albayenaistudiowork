import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  Percent, 
  DollarSign, 
  Building, 
  User, 
  Download, 
  Search,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Mandate, MandateType, MandateStatus, Property } from '../../types';

interface MandatesManagerProps {
  onSelectProperty?: (property: Property) => void;
}

export const MandatesManager: React.FC<MandatesManagerProps> = ({ onSelectProperty }) => {
  const { 
    mandates, 
    addMandate, 
    updateMandate, 
    properties, 
    unifiedContacts, 
    agents, 
    currentUser, 
    formatPrice 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected mandate for document view modal
  const [selectedMandate, setSelectedMandate] = useState<Mandate | null>(null);

  // New Mandate Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState(currentUser.id);
  const [formType, setFormType] = useState<MandateType>('exclusif');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(
    new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0] // 6 months
  );
  const [formAskingPrice, setFormAskingPrice] = useState<number>(500000);
  const [formMarketingPrice, setFormMarketingPrice] = useState<number>(520000);
  const [formCommissionRate, setFormCommissionRate] = useState<number>(3.0);
  const [formSpecialConditions, setFormSpecialConditions] = useState('');

  // Auto-fill owner and prices when property selected
  const handlePropertyChange = (propId: string) => {
    setSelectedPropertyId(propId);
    const prop = properties.find(p => p.id === propId);
    if (prop) {
      setFormMarketingPrice(prop.price);
      setFormAskingPrice(Math.round(prop.price * 0.96));
      if (prop.ownerId) {
        const owner = unifiedContacts.find(c => c.id === prop.ownerId || (c.ownedPropertyIds && c.ownedPropertyIds.includes(prop.id)));
        if (owner) setSelectedOwnerId(owner.id);
      }
    }
  };

  // Expiration calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const mandatesWithDays = mandates.map(m => {
    const diffTime = new Date(m.endDate).getTime() - new Date(todayStr).getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { ...m, daysLeft };
  });

  const expiringSoonList = mandatesWithDays.filter(m => m.status === 'actif' && m.daysLeft <= 30 && m.daysLeft > 0);

  const filteredMandates = mandatesWithDays.filter(m => {
    const matchesSearch = `${m.mandateNumber} ${m.propertyRef} ${m.propertyTitle} ${m.ownerName} ${m.agentName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || m.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // KPI calculations
  const activeCount = mandates.filter(m => m.status === 'actif' || m.status === 'expirant_proche').length;
  const exclusiveCount = mandates.filter(m => m.type === 'exclusif' && (m.status === 'actif' || m.status === 'expirant_proche')).length;
  const totalCommissionPotentielle = mandates
    .filter(m => m.status === 'actif' || m.status === 'expirant_proche')
    .reduce((acc, curr) => acc + (curr.commissionAmount || Math.round((curr.marketingPrice * curr.commissionRate) / 100)), 0);

  const handleCreateMandate = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === selectedPropertyId);
    const owner = unifiedContacts.find(c => c.id === selectedOwnerId);
    const agent = agents.find(a => a.id === selectedAgentId) || { name: currentUser.name };

    if (!prop || !owner) {
      alert('Veuillez sélectionner un bien et son propriétaire');
      return;
    }

    const calculatedCommission = Math.round((formMarketingPrice * formCommissionRate) / 100);

    addMandate({
      propertyId: prop.id,
      propertyRef: prop.ref,
      propertyTitle: prop.title,
      ownerId: owner.id,
      ownerName: `${owner.firstName} ${owner.lastName}`,
      agentId: selectedAgentId,
      agentName: agent.name,
      type: formType,
      startDate: formStartDate,
      endDate: formEndDate,
      askingPrice: formAskingPrice,
      marketingPrice: formMarketingPrice,
      commissionRate: formCommissionRate,
      commissionAmount: calculatedCommission,
      specialConditions: formSpecialConditions,
      documentName: `Mandat_${formType.toUpperCase()}_${prop.ref}.pdf`,
      status: 'actif',
      alertDays: 30
    });

    setIsAddModalOpen(false);
  };

  const typeLabels: Record<MandateType, { label: string; color: string }> = {
    exclusif: { label: 'Exclusif Albayen', color: 'bg-amber-100 text-amber-900 border-amber-300 font-bold' },
    non_exclusif: { label: 'Simple (Non exclusif)', color: 'bg-stone-100 text-stone-700 border-stone-300' },
    semi_exclusif: { label: 'Semi-Exclusif', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    gestion_locative: { label: 'Gestion Locative', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
  };

  const statusLabels: Record<MandateStatus, { label: string; color: string }> = {
    brouillon: { label: 'Brouillon', color: 'bg-stone-100 text-stone-600' },
    actif: { label: 'Actif', color: 'bg-emerald-100 text-emerald-800' },
    expirant_proche: { label: 'Expirant sous peu', color: 'bg-red-100 text-red-800 animate-pulse' },
    expire: { label: 'Expiré', color: 'bg-stone-200 text-stone-600' },
    resilie: { label: 'Résilié', color: 'bg-stone-100 text-stone-500' },
    termine: { label: 'Terminé / Vente conclue', color: 'bg-blue-100 text-blue-800' }
  };

  return (
    <div className="space-y-6">

      {/* Expiration alert banner */}
      {expiringSoonList.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900">
                Alerte : {expiringSoonList.length} mandat(s) arrivent à échéance dans les 30 prochains jours
              </h4>
              <p className="text-xs text-red-700">
                Contactez les propriétaires pour faire le bilan commercial et proroger le mandat d'exclusivité.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {expiringSoonList.slice(0, 2).map(m => (
              <span key={m.id} className="text-xs font-mono font-semibold bg-white text-red-800 border border-red-200 px-2 py-1 rounded">
                {m.mandateNumber} ({m.daysLeft}j)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Mandats Actifs</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-display text-stone-900">{activeCount}</div>
          <p className="text-[11px] text-stone-500 mt-0.5">En cours de commercialisation</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Taux d'Exclusivité</span>
            <Percent className="w-4 h-4 text-amber-800" />
          </div>
          <div className="text-2xl font-bold font-display text-amber-800">
            {activeCount > 0 ? Math.round((exclusiveCount / activeCount) * 100) : 0}%
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">{exclusiveCount} mandats exclusifs</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Commissions Prévisionnelles</span>
            <DollarSign className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-2xl font-bold font-display text-stone-900">
            {formatPrice(totalCommissionPotentielle)}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Potentiel agence engagé</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Alertes Expiration (&lt; 30j)</span>
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-display text-red-600">
            {expiringSoonList.length}
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">À renouveler en priorité</p>
        </div>
      </div>

      {/* Filter and Action bar */}
      <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher n° mandat, réf bien, propriétaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
          >
            <option value="all">Tous types de mandat</option>
            <option value="exclusif">Exclusif</option>
            <option value="non_exclusif">Simple (Non exclusif)</option>
            <option value="semi_exclusif">Semi-Exclusif</option>
            <option value="gestion_locative">Gestion Locative</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
          >
            <option value="all">Tous statuts</option>
            <option value="actif">Actif</option>
            <option value="expirant_proche">Expirant proche</option>
            <option value="expire">Expiré</option>
            <option value="termine">Terminé</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Mandat Immobilier</span>
        </button>
      </div>

      {/* Mandates Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <th className="py-3 px-4">N° Mandat</th>
                <th className="py-3 px-4">Bien Immobilier</th>
                <th className="py-3 px-4">Propriétaire</th>
                <th className="py-3 px-4">Agent Responsable</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Période & Échéance</th>
                <th className="py-3 px-4">Prix & Commission</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredMandates.map(mandate => {
                const isExpiring = mandate.status === 'actif' && mandate.daysLeft <= 30;

                return (
                  <tr key={mandate.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {mandate.mandateNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <div>
                          <p className="font-semibold text-stone-900 truncate">{mandate.propertyTitle}</p>
                          <p className="text-[11px] font-mono text-stone-400">{mandate.propertyRef}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-stone-800">
                      {mandate.ownerName}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600">
                      {mandate.agentName}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] border ${typeLabels[mandate.type]?.color}`}>
                        {typeLabels[mandate.type]?.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="text-stone-700 block">{mandate.startDate} → {mandate.endDate}</span>
                        {mandate.status === 'actif' && (
                          <span className={`text-[11px] font-semibold ${mandate.daysLeft <= 15 ? 'text-red-600 font-bold' : mandate.daysLeft <= 30 ? 'text-amber-800' : 'text-emerald-700'}`}>
                            {mandate.daysLeft} jours restants
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-stone-900 block">{formatPrice(mandate.marketingPrice)}</span>
                        <span className="text-[11px] text-amber-800">
                          {mandate.commissionRate}% ({formatPrice(mandate.commissionAmount)})
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isExpiring ? 'bg-red-100 text-red-800 font-bold' : statusLabels[mandate.status]?.color
                      }`}>
                        {isExpiring ? `Expire dans ${mandate.daysLeft}j` : statusLabels[mandate.status]?.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedMandate(mandate)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="Consulter le mandat officiel"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-800" />
                        <span>Fiche</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Fiche Mandat Officielle Imprimable */}
      {selectedMandate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header Document */}
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-800 font-bold">Cabinet Albayen Immobilier Sousse</span>
                <h3 className="text-xl font-display font-bold text-stone-900">
                  Fiche de Mandat Immobilier Officiel
                </h3>
                <p className="text-xs font-mono text-stone-500 mt-1">Réf: {selectedMandate.mandateNumber}</p>
              </div>

              <button onClick={() => setSelectedMandate(null)} className="text-stone-400 hover:text-stone-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-400 block mb-0.5">Propriétaire Mandant</span>
                  <strong className="text-stone-900 text-sm">{selectedMandate.ownerName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">Agent Négociateur</span>
                  <strong className="text-stone-900 text-sm">{selectedMandate.agentName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">Bien Concerné</span>
                  <strong className="text-stone-900">{selectedMandate.propertyRef} - {selectedMandate.propertyTitle}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5">Nature Juridique du Mandat</span>
                  <strong className="text-amber-800">{typeLabels[selectedMandate.type]?.label}</strong>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200 text-center">
                <div>
                  <span className="text-stone-400 block text-[11px]">Prix Minimum Vendeur</span>
                  <span className="font-bold text-stone-900 text-sm">{formatPrice(selectedMandate.askingPrice)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Prix de Commercialisation</span>
                  <span className="font-bold text-amber-800 text-sm">{formatPrice(selectedMandate.marketingPrice)}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Honoraires Agence</span>
                  <span className="font-bold text-emerald-700 text-sm">{selectedMandate.commissionRate}% ({formatPrice(selectedMandate.commissionAmount)})</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 mb-1">Conditions Particulières & Engagements :</h4>
                <p className="bg-stone-50 p-3 rounded-lg border border-stone-200 italic">
                  {selectedMandate.specialConditions || 'Conditions générales conformes à la réglementation tunisienne régissant la profession d\'agent immobilier.'}
                </p>
              </div>

              <div className="pt-4 border-t flex items-center justify-between text-stone-500 text-[11px]">
                <span>Période de validité : du {selectedMandate.startDate} au {selectedMandate.endDate}</span>
                <span>Statut : <strong className="text-stone-800 uppercase">{selectedMandate.status}</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Imprimer le Mandat
              </button>
              <button
                onClick={() => setSelectedMandate(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-black cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nouveau Mandat */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-800" />
                <h3 className="text-base font-bold text-stone-900">Enregistrer un Mandat Immobilier</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMandate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Bien Immobilier *</label>
                <select
                  required
                  value={selectedPropertyId}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="">Sélectionner un bien du portefeuille</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.ref} - {p.title} ({formatPrice(p.price)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Propriétaire Mandant *</label>
                <select
                  required
                  value={selectedOwnerId}
                  onChange={(e) => setSelectedOwnerId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="">Sélectionner le propriétaire</option>
                  {unifiedContacts.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.roles.join(', ')})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Type de mandat</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  >
                    <option value="exclusif">Mandat Exclusif (Recommandé)</option>
                    <option value="non_exclusif">Mandat Simple (Non exclusif)</option>
                    <option value="semi_exclusif">Mandat Semi-Exclusif</option>
                    <option value="gestion_locative">Gestion Locative</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Agent Responsable</label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  >
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Date de début *</label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Date de fin (Expiration) *</label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Prix Demandé (DT)</label>
                  <input
                    type="number"
                    value={formAskingPrice}
                    onChange={(e) => setFormAskingPrice(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Prix Affiché (DT)</label>
                  <input
                    type="number"
                    value={formMarketingPrice}
                    onChange={(e) => setFormMarketingPrice(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Commission (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formCommissionRate}
                    onChange={(e) => setFormCommissionRate(Number(e.target.value))}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Conditions Particulières</label>
                <textarea
                  rows={2}
                  placeholder="Modalités de visites, matériel inclus, clause d'exclusivité..."
                  value={formSpecialConditions}
                  onChange={(e) => setFormSpecialConditions(e.target.value)}
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
                  Enregistrer le Mandat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
