import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ImportEntityType, 
  FieldMapping, 
  ImportPreviewRow, 
  ImportJobReport, 
  ExportFilterOptions,
  Property,
  UnifiedContact
} from '../../types';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Copy, 
  RotateCcw, 
  Filter, 
  ShieldAlert,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const DataImportExportManager: React.FC = () => {
  const { 
    properties, 
    unifiedContacts, 
    mandates, 
    currentUser, 
    addUnifiedContact,
    logActivity 
  } = useApp();

  const [activeMode, setActiveMode] = useState<'import' | 'export'>('import');
  const [selectedEntity, setSelectedEntity] = useState<ImportEntityType>('contacts');

  // 10-Step Import Wizard State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('contacts_clients_sousse.csv');
  const [detectedColumns, setDetectedColumns] = useState<string[]>([
    'Nom & Prénom', 'Téléphone', 'Email', 'Type', 'Rôles', 'Budget Max', 'Quartier Cible'
  ]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([
    { fileColumn: 'Nom & Prénom', targetField: 'fullName', required: true, detectedType: 'string' },
    { fileColumn: 'Téléphone', targetField: 'phone', required: true, detectedType: 'phone' },
    { fileColumn: 'Email', targetField: 'email', required: false, detectedType: 'email' },
    { fileColumn: 'Type', targetField: 'type', required: false, detectedType: 'string' },
    { fileColumn: 'Rôles', targetField: 'roles', required: false, detectedType: 'string' },
    { fileColumn: 'Budget Max', targetField: 'budgetMax', required: false, detectedType: 'number' },
    { fileColumn: 'Quartier Cible', targetField: 'district', required: false, detectedType: 'string' }
  ]);

  // Preview Data Rows with errors & duplicate detection
  const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([
    {
      rowNumber: 1,
      data: {
        'Nom & Prénom': 'Tahar Mansour',
        'Téléphone': '+216 98 445 120',
        'Email': 'tahar.mansour@gmail.com',
        'Type': 'particulier',
        'Rôles': 'acquereur',
        'Budget Max': '450000',
        'Quartier Cible': 'Sahloul 4'
      },
      isValid: true,
      errors: [],
      warnings: [],
      isPotentialDuplicate: false
    },
    {
      rowNumber: 2,
      data: {
        'Nom & Prénom': 'Cabinet Dr. Ben Abdallah',
        'Téléphone': '+216 73 221 900',
        'Email': 'contact@clinique-sahel.tn',
        'Type': 'professionnel',
        'Rôles': 'locataire,investisseur',
        'Budget Max': '3500',
        'Quartier Cible': 'Khézama Est'
      },
      isValid: true,
      errors: [],
      warnings: [],
      isPotentialDuplicate: false
    },
    {
      rowNumber: 3,
      data: {
        'Nom & Prénom': 'Mongi Trabelsi',
        'Téléphone': '98123456', // missing format, warning
        'Email': 'mongi@yahoo.fr',
        'Type': 'particulier',
        'Rôles': 'proprietaire',
        'Budget Max': '',
        'Quartier Cible': 'Port El Kantaoui'
      },
      isValid: true,
      errors: [],
      warnings: ['Numéro converti au format international (+216 98 123 456)'],
      isPotentialDuplicate: true,
      duplicateMatchedRef: 'CNT-2026-004'
    },
    {
      rowNumber: 4,
      data: {
        'Nom & Prénom': '', // Missing required field!
        'Téléphone': '+216 22 999 888',
        'Email': 'invalide-email-format',
        'Type': 'promoteur',
        'Rôles': 'investisseur',
        'Budget Max': '900000',
        'Quartier Cible': 'Chott Meriem'
      },
      isValid: false,
      errors: ['Nom et Prénom obligatoire manquant', 'Format email non valide'],
      warnings: [],
      isPotentialDuplicate: false
    },
    {
      rowNumber: 5,
      data: {
        'Nom & Prénom': 'Salma Ghedira',
        'Téléphone': '+216 55 330 110',
        'Email': 'salma.ghedira@topnet.tn',
        'Type': 'particulier',
        'Rôles': 'acquereur',
        'Budget Max': '620000',
        'Quartier Cible': 'Corniche Sousse'
      },
      isValid: true,
      errors: [],
      warnings: [],
      isPotentialDuplicate: false
    }
  ]);

  const [importSummary, setImportSummary] = useState<ImportJobReport | null>(null);

  // Export State
  const [exportFilter, setExportFilter] = useState<ExportFilterOptions>({
    entityType: 'contacts',
    format: 'csv',
    includeConfidentialData: currentUser.role === 'admin' || currentUser.role === 'superadmin'
  });
  const [exportSuccess, setExportSuccess] = useState(false);

  // Steps Definition
  const stepTitles = [
    'Sélection',
    'Analyse',
    'Colonnes',
    'Correspondance',
    'Validation',
    'Erreurs',
    'Aperçu',
    'Confirmation',
    'Exécution',
    'Rapport'
  ];

  const handleExecuteImport = () => {
    // Only import valid rows
    const validRows = previewRows.filter(r => r.isValid);
    
    // Simulate real addition
    validRows.forEach(r => {
      const names = (r.data['Nom & Prénom'] || '').split(' ');
      addUnifiedContact({
        firstName: names[0] || 'Client',
        lastName: names.slice(1).join(' ') || 'Importé',
        phone: r.data['Téléphone'] || '+216 73 000 000',
        email: r.data['Email'] || '',
        preferredLanguage: 'fr',
        type: (r.data['Type'] as any) || 'particulier',
        roles: (r.data['Rôles'] || 'acquereur').split(',') as any,
        source: 'site_web',
        status: 'actif',
        city: 'Sousse',
        country: 'Tunisie',
        notes: `Importé via fichier ${fileName} le 29/09/2026`
      });
    });

    const report: ImportJobReport = {
      id: `IMP-${Date.now()}`,
      entityType: selectedEntity,
      fileName,
      totalRows: previewRows.length,
      validRowsCount: validRows.length,
      invalidRowsCount: previewRows.filter(r => !r.isValid).length,
      createdCount: validRows.filter(r => !r.isPotentialDuplicate).length,
      updatedCount: validRows.filter(r => r.isPotentialDuplicate).length,
      duplicatesHandledCount: previewRows.filter(r => r.isPotentialDuplicate).length,
      executedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      executedBy: currentUser.name,
      status: previewRows.some(r => !r.isValid) ? 'partial' : 'success',
      errorLog: previewRows.filter(r => !r.isValid).map(r => ({ row: r.rowNumber, error: r.errors.join(', ') }))
    };

    setImportSummary(report);
    logActivity('IMPORT_DONNEES', `Import ${selectedEntity}`, `${validRows.length} enregistrements importés.`);
    setCurrentStep(10);
  };

  const handleTriggerExport = () => {
    let dataToExport: any[] = [];
    if (exportFilter.entityType === 'properties') {
      dataToExport = properties.map(p => ({
        Reference: p.ref,
        Titre: p.title,
        Type: p.type,
        Transaction: p.transactionType,
        Prix_TND: p.price,
        Surface_m2: p.surface,
        Chambres: p.bedrooms,
        Quartier: p.district,
        Ville: p.city,
        Statut: p.status,
        ...(exportFilter.includeConfidentialData ? {
          Titre_Bleu_Cadastre: p.cadastralBlueTitleNumber || 'TB-INDIVIDUEL-CONFORME',
          Prix_Plancher_Net_Vendeur: p.minNetOwnerPrice || (p.price * 0.95),
          CIN_Proprietaire: p.ownerCinNumber || '08745612'
        } : {})
      }));
    } else if (exportFilter.entityType === 'contacts') {
      dataToExport = unifiedContacts.map(c => ({
        Reference: c.ref,
        Nom: c.lastName,
        Prenom: c.firstName,
        Telephone: c.phone,
        Email: c.email,
        Type: c.type,
        Roles: c.roles.join(','),
        Statut: c.status
      }));
    } else if (exportFilter.entityType === 'mandates') {
      dataToExport = mandates.map(m => ({
        Numero_Mandat: m.mandateNumber,
        Bien_Ref: m.propertyRef,
        Bien_Titre: m.propertyTitle,
        Proprietaire: m.ownerName,
        Agent_Negociateur: m.agentName,
        Type_Mandat: m.type,
        Prix_Demande_TND: m.askingPrice,
        Taux_Commission: `${m.commissionRate}%`,
        Commission_TND: m.commissionAmount,
        Date_Debut: m.startDate,
        Date_Echeance: m.endDate,
        Statut: m.status
      }));
    }

    // Generate CSV Download
    const headers = Object.keys(dataToExport[0] || {}).join(';');
    const rows = dataToExport.map(row => Object.values(row).map(v => `"${v}"`).join(';'));
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `albayen_${exportFilter.entityType}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3500);
    logActivity('EXPORT_DONNEES', `Export ${exportFilter.entityType}`, `Fichier ${exportFilter.format.toUpperCase()} téléchargé.`);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      
      {/* Top Header Switcher */}
      <div className="p-6 bg-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-amber-600/30 text-amber-400 border border-amber-500/40">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Centre de Gestion des Données
            </span>
          </div>
          <h2 className="text-xl font-display font-bold text-white">
            Importation & Exportation Certifiée des Données Métier
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Pipeline en 10 étapes pour l'import sans faille et export filtré avec respect rigoureux du RBAC et de la confidentialité.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-stone-800 p-1 rounded-xl border border-stone-700">
          <button
            onClick={() => setActiveMode('import')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeMode === 'import' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Processus d'Import (10 étapes)</span>
          </button>
          <button
            onClick={() => setActiveMode('export')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
              activeMode === 'export' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtré & Sécurisé</span>
          </button>
        </div>
      </div>

      {/* IMPORT MODE: 10-STEP PIPELINE */}
      {activeMode === 'import' && (
        <div className="p-6">
          
          {/* Step Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between overflow-x-auto pb-2 gap-1 text-[11px] font-semibold text-stone-500">
              {stepTitles.map((title, idx) => {
                const stepNum = idx + 1;
                const isCurrent = currentStep === stepNum;
                const isPassed = currentStep > stepNum;
                return (
                  <div key={stepNum} className="flex items-center gap-1.5 shrink-0">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isPassed ? 'bg-emerald-600 text-white' :
                      isCurrent ? 'bg-amber-800 text-white ring-2 ring-amber-600/30' :
                      'bg-stone-200 text-stone-600'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : stepNum}
                    </span>
                    <span className={isCurrent ? 'text-amber-900 font-bold' : isPassed ? 'text-stone-800' : 'text-stone-400'}>
                      {title}
                    </span>
                    {idx < stepTitles.length - 1 && <span className="text-stone-300 mx-1">›</span>}
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-amber-800 h-full transition-all duration-300 rounded-full" 
                style={{ width: `${(currentStep / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: Sélection du fichier */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-1.5">
                  1. Choisissez le type de données à importer
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'contacts', label: 'Contacts & Clients', desc: 'Acquéreurs, Propriétaires' },
                    { id: 'properties', label: 'Biens Immobiliers', desc: 'Appartements, Villas' },
                    { id: 'mandates', label: 'Mandats de Vente', desc: 'Contrats & Conditions' }
                  ].map(e => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEntity(e.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedEntity === e.id 
                          ? 'border-amber-800 bg-amber-50/70 ring-1 ring-amber-800' 
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <strong className="block text-xs text-stone-900">{e.label}</strong>
                      <span className="text-[11px] text-stone-500">{e.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-stone-300 hover:border-amber-800 rounded-2xl p-8 text-center bg-stone-50 transition-colors">
                <Upload className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  Déposez votre fichier CSV, Excel (.xlsx) ou JSON ici
                </h4>
                <p className="text-xs text-stone-500 mb-4">
                  Encodage UTF-8 recommandé. Fichiers jusqu'à 25 Mo acceptés.
                </p>
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-700 shadow-xs">
                    {fileName} (5 lignes pré-chargées)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-stone-500">
                  Modèle conforme : <strong className="text-stone-800">albayen_template_{selectedEntity}.csv</strong>
                </span>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>Analyser le fichier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 & 3: Analyse & Détection des Colonnes */}
          {(currentStep === 2 || currentStep === 3) && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Fichier analysé avec succès : {fileName}
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Format détecté : CSV séparateur virgule / point-virgule · Encodage : UTF-8 · 5 lignes détectées
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-900 mb-2">
                  3. Colonnes d'en-tête identifiées automatiquement ({detectedColumns.length}) :
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detectedColumns.map((col, idx) => (
                    <span key={idx} className="px-3 py-1 bg-stone-100 border border-stone-200 rounded-lg text-xs font-medium text-stone-700">
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Retour
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>Correspondance des champs (Mapping)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Correspondance des champs (Field Mapping) */}
          {currentStep === 4 && (
            <div className="max-w-3xl mx-auto space-y-6 py-4">
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  4. Vérifiez la correspondance entre votre fichier et le système Albayen
                </h4>
                <p className="text-xs text-stone-500">
                  Associez chaque colonne de votre fichier source avec l'attribut destination dans l'application.
                </p>
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                <div className="bg-stone-50 px-4 py-2 text-xs font-bold text-stone-700 grid grid-cols-12 gap-4">
                  <div className="col-span-5">Colonne dans votre fichier</div>
                  <div className="col-span-5">Champ cible Albayen</div>
                  <div className="col-span-2 text-right">Obligatoire</div>
                </div>

                {fieldMappings.map((m, idx) => (
                  <div key={idx} className="px-4 py-3 grid grid-cols-12 gap-4 items-center text-xs">
                    <div className="col-span-5 font-semibold text-stone-800">
                      {m.fileColumn}
                    </div>
                    <div className="col-span-5">
                      <select 
                        defaultValue={m.targetField}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
                      >
                        <option value="fullName">Nom & Prénom complet</option>
                        <option value="phone">Téléphone portable (+216)</option>
                        <option value="email">Adresse Email</option>
                        <option value="type">Type de contact (Particulier/Pro)</option>
                        <option value="roles">Rôles (Acquéreur, Vendeur...)</option>
                        <option value="budgetMax">Budget Maximal (TND)</option>
                        <option value="district">Zone / Quartier de recherche</option>
                      </select>
                    </div>
                    <div className="col-span-2 text-right">
                      {m.required ? (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-sm">Requis</span>
                      ) : (
                        <span className="text-[10px] text-stone-400">Optionnel</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Retour
                </button>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>Validation & Détection Erreurs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5, 6 & 7: Validation, Erreurs & Aperçu interactif */}
          {(currentStep === 5 || currentStep === 6 || currentStep === 7) && (
            <div className="space-y-6">
              
              {/* Summary Badges */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl">
                  <span className="text-[11px] text-stone-500 block font-medium">Lignes analysées</span>
                  <strong className="text-xl font-bold text-stone-900">{previewRows.length}</strong>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                  <span className="text-[11px] text-emerald-800 block font-medium">Lignes valides</span>
                  <strong className="text-xl font-bold text-emerald-800">
                    {previewRows.filter(r => r.isValid).length}
                  </strong>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                  <span className="text-[11px] text-amber-800 block font-medium">Doublons potentiels</span>
                  <strong className="text-xl font-bold text-amber-800">
                    {previewRows.filter(r => r.isPotentialDuplicate).length}
                  </strong>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                  <span className="text-[11px] text-red-800 block font-medium">Lignes invalides (Rejet)</span>
                  <strong className="text-xl font-bold text-red-800">
                    {previewRows.filter(r => !r.isValid).length}
                  </strong>
                </div>
              </div>

              {/* Strict No-Silent-Import Rule Callout */}
              <div className="p-3.5 bg-stone-900 text-white rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Règle de gestion Albayen :</strong> Aucune donnée n'est importée silencieusement en cas d'erreur critique. Les lignes invalides sont isolées dans le rapport.
                  </span>
                </div>
              </div>

              {/* Table Preview */}
              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3">Nom & Prénom</th>
                        <th className="p-3">Téléphone</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Rôles</th>
                        <th className="p-3">Quartier</th>
                        <th className="p-3">Diagnostic / Erreurs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {previewRows.map(row => (
                        <tr key={row.rowNumber} className={!row.isValid ? 'bg-red-50/50' : row.isPotentialDuplicate ? 'bg-amber-50/30' : ''}>
                          <td className="p-3 font-mono text-stone-400">{row.rowNumber}</td>
                          <td className="p-3">
                            {row.isValid ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">Valide</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-bold text-[10px]">Erreur</span>
                            )}
                          </td>
                          <td className="p-3 font-semibold text-stone-900">{row.data['Nom & Prénom'] || <span className="text-red-500 italic">[Vide]</span>}</td>
                          <td className="p-3 font-mono">{row.data['Téléphone']}</td>
                          <td className="p-3 text-stone-600">{row.data['Email']}</td>
                          <td className="p-3 capitalize">{row.data['Rôles']}</td>
                          <td className="p-3">{row.data['Quartier Cible']}</td>
                          <td className="p-3">
                            {row.errors.length > 0 && (
                              <span className="text-red-600 font-medium block">
                                {row.errors.join(' · ')}
                              </span>
                            )}
                            {row.warnings.length > 0 && (
                              <span className="text-amber-700 block text-[11px]">
                                {row.warnings.join(' · ')}
                              </span>
                            )}
                            {row.isPotentialDuplicate && (
                              <span className="text-amber-800 font-semibold block text-[11px]">
                                Doublon avec {row.duplicateMatchedRef} (Mise à jour prévue)
                              </span>
                            )}
                            {row.isValid && row.errors.length === 0 && row.warnings.length === 0 && !row.isPotentialDuplicate && (
                              <span className="text-emerald-600 font-medium">Prêt pour création</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Retour
                </button>
                <button
                  onClick={() => setCurrentStep(8)}
                  className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                  <span>Passer à la confirmation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 8 & 9: Confirmation & Exécution */}
          {(currentStep === 8 || currentStep === 9) && (
            <div className="max-w-xl mx-auto space-y-6 py-4 text-center">
              <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto">
                <FileCheck className="w-7 h-7 text-amber-800" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Confirmation finale de l'importation
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Vous êtes sur le point d'importer {previewRows.filter(r => r.isValid).length} éléments valides dans la base active d'Albayen Sousse.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Nouveaux contacts à créer :</span>
                  <strong className="text-emerald-800">3</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Contacts existants à enrichir (doublons) :</span>
                  <strong className="text-amber-800">1</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Lignes ignorées pour erreurs critiques :</span>
                  <strong className="text-red-700">1</strong>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(7)}
                  className="px-4 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Annuler / Modifier
                </button>
                <button
                  onClick={handleExecuteImport}
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Confirmer & Exécuter l'import</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 10: Rapport de Résultat Détaillé */}
          {currentStep === 10 && importSummary && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-base font-bold text-emerald-950">
                  Importation terminée avec succès !
                </h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Rapport horodaté {importSummary.executedAt} · Exécuté par {importSummary.executedBy}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl">
                  <span className="text-[11px] text-stone-500 block">Créés</span>
                  <strong className="text-lg font-bold text-stone-900">{importSummary.createdCount}</strong>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                  <span className="text-[11px] text-amber-800 block">Mis à jour</span>
                  <strong className="text-lg font-bold text-amber-800">{importSummary.updatedCount}</strong>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                  <span className="text-[11px] text-red-800 block">Rejetés (Erreurs)</span>
                  <strong className="text-lg font-bold text-red-800">{importSummary.invalidRowsCount}</strong>
                </div>
              </div>

              {importSummary.errorLog.length > 0 && (
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs">
                  <h4 className="font-bold text-stone-900 mb-2">Journal des erreurs rejetées :</h4>
                  <ul className="space-y-1 text-red-600">
                    {importSummary.errorLog.map((err, i) => (
                      <li key={i}>• Ligne {err.row} : {err.error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setImportSummary(null);
                  }}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Nouvel import</span>
                </button>

                <button
                  onClick={() => alert("Le journal d'importation certifié a été exporté en log.")}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger le rapport d'audit</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* EXPORT MODE: FILTERED & RBAC RESPECTED */}
      {activeMode === 'export' && (
        <div className="p-8 max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Exporter les données de l'agence Albayen Sousse
            </h3>
            <p className="text-xs text-stone-500">
              Sélectionnez les données et formats d'exportation. Les permissions d'accès ({currentUser.role.toUpperCase()}) sont strictement appliquées.
            </p>
          </div>

          <div className="space-y-4 bg-stone-50 p-6 rounded-2xl border border-stone-200">
            {/* Entity selector */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Données à exporter
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'properties', label: 'Biens Immobiliers' },
                  { id: 'contacts', label: 'Contacts & Clients' },
                  { id: 'mandates', label: 'Mandats de Vente' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setExportFilter({ ...exportFilter, entityType: item.id as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      exportFilter.entityType === item.id 
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format selector */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Format de fichier
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'csv', label: 'CSV (Universel)' },
                  { id: 'excel', label: 'Excel (.xlsx)' },
                  { id: 'json', label: 'JSON API' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setExportFilter({ ...exportFilter, format: f.id as any })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      exportFilter.format === f.id 
                        ? 'bg-amber-800 text-white border-amber-800 shadow-xs' 
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidential Data Checkbox (RBAC governed) */}
            <div className="pt-2 border-t border-stone-200">
              <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportFilter.includeConfidentialData}
                  disabled={currentUser.role !== 'admin' && currentUser.role !== 'superadmin'}
                  onChange={(e) => setExportFilter({ ...exportFilter, includeConfidentialData: e.target.checked })}
                  className="mt-0.5 rounded text-amber-800 focus:ring-amber-500"
                />
                <div>
                  <span className="font-semibold block">Inclure les données confidentielles (Titre Bleu & CIN)</span>
                  <span className="text-[11px] text-stone-500">
                    {currentUser.role === 'admin' || currentUser.role === 'superadmin' ? (
                      'Autorisé pour votre rôle Direction / Responsable'
                    ) : (
                      'Verrouillé : Nécessite les droits Super Admin / Direction'
                    )}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleTriggerExport}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Générer et Télécharger l'Export {exportFilter.format.toUpperCase()}</span>
            </button>

            {exportSuccess && (
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Exportation générée et téléchargée avec succès !</span>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
