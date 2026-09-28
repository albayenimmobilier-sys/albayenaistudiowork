import React, { useState } from 'react';
import { X, Send, CheckCircle, Mail, Phone, MessageSquare } from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../utils/translations';

interface InfoModalProps {
  property: Property;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ property, onClose }) => {
  const { currentUser, language, submitInfoRequest } = useApp();
  const t = getTranslation(language);

  const [name, setName] = useState(currentUser.name !== 'Visiteur Public' ? currentUser.name : '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email !== 'visiteur@gmail.com' ? currentUser.email : '');
  const [preference, setPreference] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [message, setMessage] = useState(
    `Bonjour, je souhaite obtenir de plus amples informations concernant le bien réf. ${property.ref} ("${property.title}"). Merci de me recontacter.`
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    submitInfoRequest({
      propertyRef: property.ref,
      name,
      email: email || 'contact@client.tn',
      phone,
      message,
      preference
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-display font-bold text-stone-900">
              {t.infoRequestTitle} {property.ref}
            </h2>
            <p className="text-xs text-stone-500 truncate max-w-xs">
              {property.title}
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
            <h3 className="text-base font-bold text-stone-900">Demande Transmise avec Succès</h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              {t.inquirySubmittedSuccess}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Votre nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  {t.phone} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+216 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                placeholder="votre.email@domaine.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>

            {/* Contact Preference */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                {t.contactPreference}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPreference('whatsapp')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                    preference === 'whatsapp'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreference('phone')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                    preference === 'phone'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreference('email')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                    preference === 'email'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                {t.message}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-amber-600 focus:outline-none resize-none"
              />
            </div>

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
                className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm hover:shadow transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendInquiry}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
