import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  MapPin, 
  Building, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  ShieldAlert,
  Phone,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Visit, AgentUnavailability } from '../../types';

export const AgentCalendarView: React.FC = () => {
  const { 
    visits, 
    agentUnavailabilities, 
    agents, 
    properties, 
    currentUser, 
    checkAgentConflict, 
    addAgentUnavailability, 
    removeAgentUnavailability,
    submitVisitRequest
  } = useApp();

  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    currentUser.role === 'agent' ? currentUser.id : 'all'
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'list'>('week');

  // Conflict Testing Modal / New Visit Scheduler
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [testAgentId, setTestAgentId] = useState('user-agent-1');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [testTimeSlot, setTestTimeSlot] = useState('14:00');
  const [testClientName, setTestClientName] = useState('');
  const [testClientPhone, setTestClientPhone] = useState('');
  const [testPropertyId, setTestPropertyId] = useState('');
  const [detectedConflict, setDetectedConflict] = useState<string | null>(null);

  // Unavailability modal
  const [isUnavailModalOpen, setIsUnavailModalOpen] = useState(false);
  const [unavailReason, setUnavailReason] = useState('');
  const [unavailStartTime, setUnavailStartTime] = useState('14:00');
  const [unavailEndTime, setUnavailEndTime] = useState('16:00');

  // Time slots for day view (08:30 to 18:30)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Conflict check whenever testAgent, testDate, or testTimeSlot changes
  const runConflictCheck = (agentId: string, date: string, timeSlot: string) => {
    const res = checkAgentConflict(agentId, date, timeSlot);
    if (res.hasConflict) {
      setDetectedConflict(res.reason || 'Conflit de planning détecté sur ce créneau.');
    } else {
      setDetectedConflict(null);
    }
  };

  const handleTestSlotChange = (time: string) => {
    setTestTimeSlot(time);
    runConflictCheck(testAgentId, testDate, time);
  };

  const handleTestDateChange = (date: string) => {
    setTestDate(date);
    runConflictCheck(testAgentId, date, testTimeSlot);
  };

  const handleTestAgentChange = (agentId: string) => {
    setTestAgentId(agentId);
    runConflictCheck(agentId, testDate, testTimeSlot);
  };

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const conflict = checkAgentConflict(testAgentId, testDate, testTimeSlot);
    if (conflict.hasConflict) {
      alert(`⚠️ Impossible d'enregistrer : ${conflict.reason}`);
      return;
    }

    const prop = properties.find(p => p.id === testPropertyId);
    if (!prop) {
      alert('Veuillez sélectionner un bien');
      return;
    }

    submitVisitRequest({
      propertyId: prop.id,
      propertyRef: prop.ref,
      propertyTitle: prop.title,
      propertyImage: prop.mainImage,
      propertyPrice: prop.price,
      clientName: testClientName,
      clientPhone: testClientPhone,
      clientEmail: 'contact@client.tn',
      agentId: testAgentId,
      date: testDate,
      timeSlot: testTimeSlot,
      visitorsCount: 2,
      comment: 'Planifié via le calendrier des agents CRM'
    });

    setIsScheduleModalOpen(false);
    alert('✅ Visite planifiée avec succès ! Aucun conflit détecté.');
  };

  const handleAddUnavail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unavailReason.trim()) return;

    addAgentUnavailability({
      agentId: testAgentId,
      date: testDate,
      startTime: unavailStartTime,
      endTime: unavailEndTime,
      reason: unavailReason
    });

    setIsUnavailModalOpen(false);
    setUnavailReason('');
  };

  // Filter events by selected agent
  const activeVisits = visits.filter(v => 
    (selectedAgentId === 'all' || v.agentId === selectedAgentId) &&
    v.status !== 'annulee'
  );

  const activeUnavails = agentUnavailabilities.filter(u => 
    selectedAgentId === 'all' || u.agentId === selectedAgentId
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Conflict Detection Demo Trigger */}
      <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-800" />
            <h3 className="text-base font-bold text-stone-900">
              Agenda & Calendrier des Visites des Conseillers
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Détection automatique des chevauchements d'horaires et contrôle des disponibilités en temps réel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Agent Filter */}
          <select
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-700"
          >
            <option value="all">Tous les conseillers Albayen</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setIsUnavailModalOpen(true);
            }}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            + Indisponibilité / Congé
          </button>

          <button
            onClick={() => {
              setIsScheduleModalOpen(true);
              runConflictCheck(testAgentId, testDate, testTimeSlot);
            }}
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Planifier Visite (Vérif. Conflit)</span>
          </button>
        </div>
      </div>

      {/* Calendar Week / Day Grid */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 space-y-4">
        
        {/* Date Selector & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-600">Date consultée :</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg font-bold text-stone-800"
            />
          </div>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-semibold text-stone-600">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'week' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Vue Hebdomadaire
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'day' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Vue Journée
            </button>
          </div>
        </div>

        {/* Schedule Grid for Selected Date */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Créneaux du {selectedDate}
          </h4>

          <div className="grid grid-cols-1 divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
            {timeSlots.map(slot => {
              const visitOnSlot = activeVisits.find(v => v.date === selectedDate && v.timeSlot === slot);
              const unavailOnSlot = activeUnavails.find(u => u.date === selectedDate && slot >= u.startTime && slot < u.endTime);
              const isOccupied = Boolean(visitOnSlot || unavailOnSlot);

              return (
                <div
                  key={slot}
                  className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                    isOccupied ? 'bg-amber-50/40' : 'bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-800 w-14 shrink-0">
                      {slot}
                    </span>

                    {visitOnSlot ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <div>
                          <p className="font-bold text-stone-900">
                            Visite : {visitOnSlot.propertyRef} ({visitOnSlot.propertyTitle})
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Client : {visitOnSlot.clientName} ({visitOnSlot.clientPhone}) • Agent : {agents.find(a => a.id === visitOnSlot.agentId)?.name || 'Conseiller'}
                          </p>
                        </div>
                      </div>
                    ) : unavailOnSlot ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                        <div>
                          <p className="font-bold text-red-900">
                            Indisponible : {unavailOnSlot.reason}
                          </p>
                          <p className="text-[11px] text-red-700">
                            {unavailOnSlot.startTime} → {unavailOnSlot.endTime}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-stone-400 italic">
                        Créneau libre — Aucun rendez-vous planifié
                      </span>
                    )}
                  </div>

                  <div>
                    {!isOccupied ? (
                      <button
                        onClick={() => {
                          setTestDate(selectedDate);
                          setTestTimeSlot(slot);
                          setIsScheduleModalOpen(true);
                          runConflictCheck(testAgentId, selectedDate, slot);
                        }}
                        className="px-2.5 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        + Réserver créneau
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Occupé
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Planifier Visite avec Détection de Conflit en Direct */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-800" />
                <h3 className="text-base font-bold text-stone-900">Planifier une Visite Immobilière</h3>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LIVE CONFLICT ALERT BANNER */}
            {detectedConflict ? (
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-3.5 flex items-start gap-3 animate-in shake duration-300">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-900 uppercase tracking-wide">
                    ⚠️ Conflit de Planning Détecté
                  </h4>
                  <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                    {detectedConflict}
                  </p>
                  <p className="text-[11px] text-red-800 font-semibold mt-1">
                    Veuillez choisir un autre horaire ou réaffecter la visite à un autre conseiller.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-2.5 text-xs text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Créneau disponible. Aucun chevauchement détecté pour cet agent.</span>
              </div>
            )}

            <form onSubmit={handleBookVisit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Agent Conseiller *</label>
                <select
                  value={testAgentId}
                  onChange={(e) => handleTestAgentChange(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.specialty})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={testDate}
                    onChange={(e) => handleTestDateChange(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Heure de début *</label>
                  <select
                    value={testTimeSlot}
                    onChange={(e) => handleTestSlotChange(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg font-bold"
                  >
                    {timeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Bien à visiter *</label>
                <select
                  required
                  value={testPropertyId}
                  onChange={(e) => setTestPropertyId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="">Sélectionner un bien</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.ref} - {p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Nom du client *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Dr. Mansour"
                    value={testClientName}
                    onChange={(e) => setTestClientName(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Téléphone client *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+216 98 000 000"
                    value={testClientPhone}
                    onChange={(e) => setTestClientPhone(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={Boolean(detectedConflict)}
                  className={`px-5 py-2 rounded-lg font-semibold text-white shadow-xs transition-colors ${
                    detectedConflict 
                      ? 'bg-stone-400 cursor-not-allowed' 
                      : 'bg-amber-800 hover:bg-amber-900 cursor-pointer'
                  }`}
                >
                  Confirmer le Rendez-vous
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ajouter Indisponibilité */}
      {isUnavailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Enregistrer une Plage d'Indisponibilité</h3>
              <button onClick={() => setIsUnavailModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUnavail} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Conseiller</label>
                <select
                  value={testAgentId}
                  onChange={(e) => setTestAgentId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  {agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Heure Début</label>
                  <input
                    type="time"
                    value={unavailStartTime}
                    onChange={(e) => setUnavailStartTime(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Heure Fin</label>
                  <input
                    type="time"
                    value={unavailEndTime}
                    onChange={(e) => setUnavailEndTime(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Motif</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Réunion d'étude notariale, formation, absence..."
                  value={unavailReason}
                  onChange={(e) => setUnavailReason(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUnavailModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-lg"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
