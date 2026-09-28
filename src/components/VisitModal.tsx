import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle, MapPin } from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

interface VisitModalProps {
  property: Property;
  onClose: () => void;
}

export const VisitModal: React.FC<VisitModalProps> = ({ property, onClose }) => {
  const { currentUser, language, submitVisitRequest, formatPrice } = useApp();
  const t = getTranslation(language);

  // Tomorrow as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [timeSlot, setTimeSlot] = useState('15:30');
  const [visitorsCount, setVisitorsCount] = useState(2);
  const [clientName, setClientName] = useState(currentUser.name !== 'Visiteur Public' ? currentUser.name : '');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '');
  const [clientEmail, setClientEmail] = useState(currentUser.email !== 'visiteur@gmail.com' ? currentUser.email : '');
  const [comment, setComment] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    submitVisitRequest({
      propertyId: property.id,
      propertyRef: property.ref,
      propertyTitle: property.title,
      propertyImage: property.mainImage,
      propertyPrice: property.price,
      clientName,
      clientPhone,
      clientEmail: clientEmail || 'client@contact-sousse.tn',
      agentId: property.agentId || 'user-agent-1',
      date,
      timeSlot,
      visitorsCount,
      comment
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-display font-bold text-stone-900">
              {t.scheduleVisitTitle}
            </h2>
            <p className="text-xs text-stone-500">
              Réf. {property.ref} · {property.district}, Sousse
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Demande de Visite Enregistrée</h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              Votre conseiller Albayen prendra contact sous 2 heures ouvrées pour vous confirmer le rendez-vous du {date} à {timeSlot}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Property Summary Strip */}
            <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
              <img
                src={property.mainImage}
                alt={property.title}
                className="w-14 h-12 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-stone-900 truncate block">
                  {property.title}
                </span>
                <span className="text-[11px] font-bold text-amber-800 tabular-nums">
                  {formatPrice(property.price)}
                </span>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {t.selectDate} *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-medium focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {t.selectTimeSlot} *
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 font-medium focus:ring-2 focus:ring-amber-600 focus:outline-none"
                >
                  <option value="09:30">09:30 (Matinée)</option>
                  <option value="11:00">11:00 (Matinée)</option>
                  <option value="14:30">14:30 (Après-midi)</option>
                  <option value="15:30">15:30 (Après-midi)</option>
                  <option value="17:00">17:00 (Fin de journée)</option>
                  <option value="18:00">18:00 (Sur demande)</option>
                </select>
              </div>
            </div>

            {/* Visitors count */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                {t.numberOfVisitors}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setVisitorsCount(num)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      visitorsCount === num
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {num} pers.
                  </button>
                ))}
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Tarek Mansour"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {t.phone} (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+216 98 000 000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                {t.email}
              </label>
              <input
                type="email"
                placeholder="votre.email@exemple.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                {t.notesComment}
              </label>
              <textarea
                rows={2}
                placeholder="Précisions pour l'agent (ex: disponibilité, question sur le titre bleu, etc.)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm hover:shadow transition-colors"
              >
                {t.confirmVisitRequest}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
