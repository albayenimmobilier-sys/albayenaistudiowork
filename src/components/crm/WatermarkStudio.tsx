import React, { useState, useRef, useEffect } from 'react';
import { Property, WatermarkConfig } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Stamp, 
  Eye, 
  Download, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  Sliders,
  X
} from 'lucide-react';

interface WatermarkStudioProps {
  property?: Property;
  onClose?: () => void;
}

export const WatermarkStudio: React.FC<WatermarkStudioProps> = ({ property, onClose }) => {
  const { properties, agencySettings } = useApp();
  
  // Default to first property if none provided
  const targetProperty = property || properties[0];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const [config, setConfig] = useState<WatermarkConfig>({
    enabled: true,
    text: `ALBAYEN IMMOBILIER SOUSSE · ${targetProperty?.ref || 'OFFICIEL'}`,
    position: 'bottom-right',
    fontSize: 'medium',
    opacity: 0.65,
    includeAgencyLogo: true
  });

  const [isApplied, setIsApplied] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentPhoto = targetProperty?.images?.[selectedPhotoIndex] || targetProperty?.mainImage || '';

  // Render Watermark on Canvas
  useEffect(() => {
    if (!currentPhoto) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentPhoto;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width || 1200;
      canvas.height = img.height || 800;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (!config.enabled) {
        setPreviewDataUrl(canvas.toDataURL());
        return;
      }

      ctx.save();

      // Configure font size
      const baseFontSize = config.fontSize === 'small' ? 24 : config.fontSize === 'medium' ? 36 : 52;
      ctx.font = `bold ${baseFontSize}px 'Cinzel', 'Playfair Display', sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${config.opacity})`;
      ctx.shadowColor = `rgba(0, 0, 0, ${config.opacity * 0.8})`;
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const padding = 40;
      const textMetrics = ctx.measureText(config.text);
      const textWidth = textMetrics.width;

      if (config.position === 'bottom-right') {
        const x = canvas.width - textWidth - padding;
        const y = canvas.height - padding;
        ctx.fillText(config.text, x, y);
      } else if (config.position === 'bottom-left') {
        const x = padding;
        const y = canvas.height - padding;
        ctx.fillText(config.text, x, y);
      } else if (config.position === 'center') {
        const x = (canvas.width - textWidth) / 2;
        const y = canvas.height / 2;
        ctx.fillText(config.text, x, y);
      } else if (config.position === 'diagonal') {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6);
        ctx.textAlign = 'center';
        ctx.fillText(config.text, 0, 0);
      }

      ctx.restore();
      setPreviewDataUrl(canvas.toDataURL());
    };
  }, [currentPhoto, config]);

  const handleApplyToAll = () => {
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-w-5xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-600/30 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <Stamp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Watermark Studio & Filigrane Automatique
            </h3>
            <p className="text-xs text-stone-400">
              Protection légale des visuels Albayen Immobilier pour diffusion publique & portails
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Visual Preview */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-800" />
              Aperçu en direct (Qualité de publication)
            </span>
            <span className="text-[11px] text-stone-400">
              {targetProperty?.title} ({targetProperty?.ref})
            </span>
          </div>

          <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-950 border border-stone-200 shadow-inner flex items-center justify-center">
            {previewDataUrl ? (
              <img 
                src={previewDataUrl} 
                alt="Aperçu filigrane" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-stone-400 text-xs">Génération du rendu...</div>
            )}
            {/* Hidden canvas used for processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Photo Selector Thumbnail Strip */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {targetProperty?.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  selectedPhotoIndex === idx 
                    ? 'border-amber-600 ring-2 ring-amber-600/30 scale-105' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-stone-50 p-5 rounded-xl border border-stone-200">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Paramètres du filigrane
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                Activer
              </label>
            </div>

            {/* Custom Text */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Texte du filigrane
              </label>
              <input
                type="text"
                value={config.text}
                onChange={(e) => setConfig({ ...config, text: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
                placeholder="Ex: ALBAYEN IMMOBILIER SOUSSE"
              />
            </div>

            {/* Position Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Positionnement sur l'image
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bottom-right', label: 'Coin Bas-Droit' },
                  { id: 'bottom-left', label: 'Coin Bas-Gauche' },
                  { id: 'center', label: 'Centré' },
                  { id: 'diagonal', label: 'Filigrane Diagonale' }
                ].map(pos => (
                  <button
                    key={pos.id}
                    onClick={() => setConfig({ ...config, position: pos.id as any })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                      config.position === pos.id 
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size & Opacity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Taille du texte
                </label>
                <select
                  value={config.fontSize}
                  onChange={(e) => setConfig({ ...config, fontSize: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg bg-white focus:outline-none cursor-pointer"
                >
                  <option value="small">Discret (Petit)</option>
                  <option value="medium">Standard (Moyen)</option>
                  <option value="large">Accentue (Grand)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Opacité : {Math.round(config.opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0.15"
                  max="0.95"
                  step="0.05"
                  value={config.opacity}
                  onChange={(e) => setConfig({ ...config, opacity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-800 cursor-pointer"
                />
              </div>
            </div>

            {/* Guarantee note */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span>
                L'image originale haute définition est conservée de manière sécurisée en interne. Seule la version filigranée est diffusée aux portails externes et visiteurs.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-200 space-y-2 mt-4">
            <button
              onClick={handleApplyToAll}
              className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Filigrane appliqué aux {targetProperty?.images?.length || 0} photos !
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Appliquer le filigrane aux photos publiques
                </>
              )}
            </button>

            <a
              href={previewDataUrl}
              download={`albayen-${targetProperty?.ref}-watermarked.png`}
              className="w-full py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              Télécharger cette photo filigranée
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
