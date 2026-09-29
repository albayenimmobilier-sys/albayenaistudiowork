import React, { useState } from 'react';
import { 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  User, 
  Building, 
  CheckCircle,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus } from '../../types';

interface CommercialKanbanPipelineProps {
  onSelectLead?: (lead: Lead) => void;
}

export const CommercialKanbanPipeline: React.FC<CommercialKanbanPipelineProps> = ({ onSelectLead }) => {
  const { leads, updateLeadStatus, formatPrice, agents, properties } = useApp();

  const stages: { id: LeadStatus; label: string; color: string; badgeColor: string }[] = [
    { id: 'nouveau', label: '1. Nouveau Prospect', color: 'border-blue-400 bg-blue-50/40', badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'contacte', label: '2. Contacté & Qualifié', color: 'border-amber-400 bg-amber-50/40', badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'visite_programmee', label: '3. Visite Programmée', color: 'border-indigo-400 bg-indigo-50/40', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'en_negociation', label: '4. Offre & Négociation', color: 'border-orange-400 bg-orange-50/40', badgeColor: 'bg-orange-100 text-orange-800' },
    { id: 'converti', label: '5. Conclu (Vente / Compromis)', color: 'border-emerald-400 bg-emerald-50/40', badgeColor: 'bg-emerald-100 text-emerald-800' }
  ];

  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    const sequence: LeadStatus[] = ['nouveau', 'contacte', 'visite_programmee', 'en_negociation', 'converti'];
    const idx = sequence.indexOf(current);
    return idx !== -1 && idx < sequence.length - 1 ? sequence[idx + 1] : null;
  };

  const getPrevStage = (current: LeadStatus): LeadStatus | null => {
    const sequence: LeadStatus[] = ['nouveau', 'contacte', 'visite_programmee', 'en_negociation', 'converti'];
    const idx = sequence.indexOf(current);
    return idx > 0 ? sequence[idx - 1] : null;
  };

  return (
    <div className="space-y-4">
      {/* Top Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-800" />
            Pipeline Commercial CRM (Progression Métier)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Suivi des dossiers acquéreurs et opportunités de vente avec calcul des volumes d'honoraires prévisionnels.
          </p>
        </div>

        <div className="text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
          Total Dossiers Actifs : <strong className="text-stone-900">{leads.length}</strong>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage.id);
          const totalBudgetVolume = stageLeads.reduce((acc, l) => acc + (l.budgetMax || 0), 0);
          const estimatedCommission = Math.round(totalBudgetVolume * 0.03); // 3% estimation

          return (
            <div
              key={stage.id}
              className={`rounded-xl border p-3 flex flex-col min-h-[500px] ${stage.color}`}
            >
              {/* Column Header */}
              <div className="pb-3 mb-3 border-b border-stone-200/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {stage.label}
                  </h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${stage.badgeColor}`}>
                    {stageLeads.length}
                  </span>
                </div>

                <div className="mt-2 text-[10px] text-stone-600 flex items-center justify-between">
                  <span>Volume : {formatPrice(totalBudgetVolume)}</span>
                  <span className="text-amber-800 font-semibold">Comm. ~{formatPrice(estimatedCommission)}</span>
                </div>
              </div>

              {/* Cards list */}
              <div className="space-y-2.5 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-stone-400 italic">
                    Aucun dossier à cette étape
                  </div>
                ) : (
                  stageLeads.map(lead => {
                    const next = getNextStage(lead.status);
                    const prev = getPrevStage(lead.status);

                    return (
                      <div
                        key={lead.id}
                        className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs hover:shadow-md transition-all text-xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[10px] font-mono text-stone-400 block">{lead.ref}</span>
                            <strong className="text-stone-900 text-xs block leading-tight">
                              {lead.firstName} {lead.lastName}
                            </strong>
                          </div>

                          <span className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded uppercase">
                            {lead.propertyType}
                          </span>
                        </div>

                        {/* Property interest */}
                        {lead.interestedPropertyRef && (
                          <div className="text-[11px] text-stone-600 bg-stone-50 p-1.5 rounded flex items-center gap-1 truncate">
                            <Building className="w-3 h-3 text-stone-400 shrink-0" />
                            <span className="truncate">{lead.interestedPropertyRef}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-stone-600">
                          <span>Budget max :</span>
                          <strong className="text-stone-900">{formatPrice(lead.budgetMax || 0)}</strong>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                          <a 
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1 hover:text-amber-800"
                          >
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{lead.phone}</span>
                          </a>

                          <span className="text-[10px] text-stone-400">
                            {lead.createdAt}
                          </span>
                        </div>

                        {/* Progression Controls */}
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                          {prev ? (
                            <button
                              onClick={() => updateLeadStatus(lead.id, prev)}
                              className="p-1 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100 text-[10px] flex items-center gap-0.5 cursor-pointer"
                              title="Reculer d'une étape"
                            >
                              <ChevronLeft className="w-3 h-3" />
                              <span>Préc.</span>
                            </button>
                          ) : <div />}

                          {next ? (
                            <button
                              onClick={() => updateLeadStatus(lead.id, next)}
                              className="px-2 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer shadow-2xs"
                              title="Avancer à l'étape suivante"
                            >
                              <span>Suivant</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" /> Conclu
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
