import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactSection: React.FC = () => {
  const { agencySettings, addLead } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [needType, setNeedType] = useState<'buy' | 'rent' | 'invest' | 'sell'>('buy');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    addLead({
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
      phone,
      email: email || 'contact@client-sousse.tn',
      needType,
      propertyType: 'appartement',
      budgetMin: 0,
      budgetMax: 0,
      targetAreas: ['Sousse'],
      source: 'site_web',
      status: 'nouveau',
      agentId: 'user-agent-1'
    });

    setIsSuccess(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const handleWhatsAppDirect = () => {
    window.open(`https://wa.me/${agencySettings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Bonjour Albayen Immobilier Sousse, je vous contacte depuis votre site web pour un projet immobilier.')}`, '_blank');
  };

  return (
    <section id="contact-section" className="py-16 sm:py-20 bg-stone-900 text-white border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Agency Information & Coordinates */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 block mb-2">
                Agence Albayen Sousse
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Rencontrez Nos Conseillers à Sousse
              </h2>
              <p className="mt-3 text-sm text-stone-300 font-light leading-relaxed">
                Nos bureaux sont idéalement situés sur l'artère principale de Sousse. Notre équipe vous accueille pour échanger sur vos acquisitions, ventes ou recherches locatives en toute confidentialité.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">Adresse du siège</span>
                  <span className="text-sm font-semibold text-white block">{agencySettings.address}</span>
                  <span className="text-xs text-stone-300">{agencySettings.city}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">Ligne directe & Mobile</span>
                  <span className="text-sm font-semibold text-white block">{agencySettings.phone}</span>
                  <span className="text-xs text-stone-300">GSM : {agencySettings.mobile}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">Courrier électronique</span>
                  <a href={`mailto:${agencySettings.email}`} className="text-sm font-semibold text-amber-400 hover:underline block">
                    {agencySettings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block">Horaires de réception</span>
                  <span className="text-sm font-semibold text-white block">{agencySettings.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <div className="pt-2">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contacter l'Agence sur WhatsApp (+216 98 440 220)</span>
              </button>
            </div>
          </div>

          {/* Interactive Contact Form (Auto-creates CRM Lead) */}
          <div className="bg-stone-800/90 rounded-2xl p-6 sm:p-8 border border-stone-700/80 shadow-xl">
            <h3 className="text-lg font-display font-bold text-white mb-1">
              Envoyez-nous un Message
            </h3>
            <p className="text-xs text-stone-400 mb-6 font-light">
              Votre demande sera prise en charge immédiatement par notre CRM et attribuée à un conseiller spécialiste de votre zone.
            </p>

            {isSuccess && (
              <div className="p-4 mb-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Merci ! Votre message a été enregistré dans notre CRM. Un conseiller Albayen vous répondra dans les plus brefs délais.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sonia Ben Salem"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+216 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Adresse Email
                </label>
                <input
                  type="email"
                  placeholder="votre.email@exemple.tn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Nature de votre projet
                </label>
                <select
                  value={needType}
                  onChange={(e) => setNeedType(e.target.value as any)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="buy">Je souhaite acheter un bien à Sousse</option>
                  <option value="rent">Je recherche une location (annuelle / meublée)</option>
                  <option value="sell">Je souhaite confier mon bien à la vente</option>
                  <option value="invest">Je souhaite investir dans le foncier au Sahel</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Votre message ou détails de recherche
                </label>
                <textarea
                  rows={3}
                  placeholder="Budget envisagé, quartier privilégié, nombre de pièces, etc."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transmettre ma demande à l'agence</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
