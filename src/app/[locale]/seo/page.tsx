'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, RefreshCw, Sparkles, Tags, Tag } from 'lucide-react';

export default function SeoPage() {
  const t = useTranslations('Seo');

  const [inputs, setInputs] = useState({
    brand: '',
    type: '',
    color: '',
    material: '',
    condition: '',
    vibe: '',
    details: '',
  });

  const [style, setStyle] = useState('Casual');
  const [tags, setTags] = useState<string[]>([]);
  const [manualTag, setManualTag] = useState('');

  const handleInput = (key: string, val: string) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tags.length < 15) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const titleParts = [inputs.brand, inputs.type, inputs.material, inputs.color, inputs.vibe, inputs.condition].filter(Boolean);
  const title = titleParts.join(' ');

  let score = 0;
  if (title.length > 10) score += 20;
  if (inputs.brand) score += 20;
  if (inputs.type) score += 20;
  if (inputs.color) score += 10;
  if (inputs.material) score += 10;
  if (inputs.condition) score += 10;
  if (inputs.vibe) score += 10;
  if (title.toLowerCase().includes("joli") || title.toLowerCase().includes("sympa")) score -= 10;
  score = Math.min(100, Math.max(0, score));

  let scoreColor = 'bg-[#ff6b6b]';
  if (score >= 40) scoreColor = 'bg-[#ffd93d]';
  if (score >= 80) scoreColor = 'bg-[#6bff6b]';

  const templates: any = {
    Casual: {
        hooks: ["Coucou ! Je vends ce {type} {brand}.", "Salut les Vinties ! ✨ Voici un superbe {type} {brand}."],
        reasons: ["Je ne le porte plus assez souvent.", "Erreur de taille pour moi, dommage !"],
        states: ["Il est en {condition}.", "État : {condition}, nickel."],
        closings: ["Envoi rapide et soigné ! 📦", "N'hésitez pas pour des questions !"]
    },
    Pro: {
        hooks: ["Vends {type} de marque {brand} authentique.", "Article : {type} {brand} - {condition}."],
        reasons: ["Article issu d'un dressing soigné.", "Vente cause double emploi."],
        states: ["État constaté : {condition}.", "Conforme aux photos, état {condition}."],
        closings: ["Expédition sous 24h ouvrées.", "Emballage protecteur garanti."]
    }
  };

  const currentTemplate = templates[style] || templates.Casual;
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const fill = (str: string) => str.replace(/\{(\w+)\}/g, (_, k) => (inputs as any)[k] || "");

  const desc = [
    fill(pick(currentTemplate.hooks)),
    fill(pick(currentTemplate.reasons)),
    fill(pick(currentTemplate.states)),
    inputs.details ? `📝 ${inputs.details}` : '',
    inputs.material ? `🧶 ${inputs.material}` : '',
    inputs.color ? `🎨 ${inputs.color}` : '',
    fill(pick(currentTemplate.closings)),
    tags.join(' ')
  ].filter(Boolean).join('\n\n');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] shadow-[var(--shadow-soft)]">
        <h2 className="text-2xl font-bold text-[var(--color-primary-dark)] mb-2 flex items-center gap-2">
          <Sparkles className="text-yellow-400" /> {t('seo_title')}
        </h2>
        <p className="text-[var(--color-text-muted)] mb-6">{t('seo_subtitle')}</p>

        <div className="flex gap-4 mb-6 bg-[var(--color-bg)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-accent)]">
            <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="flex-1 bg-transparent font-bold text-[var(--color-primary-dark)] outline-none"
            >
                <option value="Casual">Casual</option>
                <option value="Pro">Pro</option>
                <option value="Emoji">Emoji Max</option>
                <option value="Story">Storytelling</option>
                <option value="Minimal">Minimaliste</option>
            </select>
            <button
                onClick={() => setStyle(['Casual', 'Pro', 'Emoji', 'Story', 'Minimal'][Math.floor(Math.random() * 5)])}
                className="bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2"
            >
                <RefreshCw size={16} /> Remix
            </button>
        </div>

        <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Tag size={20} /> {t('title_perfect')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <input placeholder={t('ph_brand')} className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent)] outline-none focus:border-[var(--color-primary-dark)]" onChange={e => handleInput('brand', e.target.value)} />
                <input placeholder={t('ph_type')} className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent)] outline-none focus:border-[var(--color-primary-dark)]" onChange={e => handleInput('type', e.target.value)} />
                <input placeholder={t('ph_color')} className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent)] outline-none focus:border-[var(--color-primary-dark)]" onChange={e => handleInput('color', e.target.value)} />
                <input placeholder={t('ph_material')} className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent)] outline-none focus:border-[var(--color-primary-dark)]" onChange={e => handleInput('material', e.target.value)} />
                <select className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent)] outline-none focus:border-[var(--color-primary-dark)]" onChange={e => handleInput('condition', e.target.value)}>
                    <option value="">-- État --</option>
                    <option value="Neuf avec étiquette">Neuf avec étiquette</option>
                    <option value="Très bon état">Très bon état</option>
                    <option value="Bon état">Bon état</option>
                    <option value="Satisfaisant">Satisfaisant</option>
                </select>
                <input placeholder={t('ph_vibe')} className="p-3 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent)] outline-none focus:border-[var(--color-primary-dark)]" onChange={e => handleInput('vibe', e.target.value)} />
            </div>
            <div className="bg-[var(--color-bg)] p-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-primary-dark)] relative">
                <div className="flex justify-between items-center mb-2 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    <span>Aperçu</span>
                    <span className="font-bold">Score: {score}/100</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-3 overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${scoreColor}`} style={{ width: `${score}%` }}></div>
                </div>
                <p className="font-bold text-lg min-h-[1.5em]">{title || "..."}</p>
                <button
                    onClick={() => copyToClipboard(title)}
                    className="absolute top-4 right-4 text-[var(--color-primary-dark)] hover:scale-110 transition-transform"
                >
                    <Copy size={20} />
                </button>
            </div>
        </div>

        <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Tags size={20} /> {t('desc_magic')}
            </h3>
            <textarea
                placeholder={t('ph_details')}
                className="w-full h-24 p-4 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent)] outline-none focus:border-[var(--color-primary-dark)] mb-4"
                onChange={e => handleInput('details', e.target.value)}
            ></textarea>
            <div className="mb-4">
                <div className="flex gap-2 mb-2">
                    <input
                        value={manualTag}
                        onChange={e => setManualTag(e.target.value)}
                        placeholder="#Hashtag"
                        className="flex-1 p-2 bg-[var(--color-bg)] rounded-lg border border-[var(--color-accent)]"
                    />
                    <button onClick={() => { addTag(manualTag); setManualTag(''); }} className="bg-[var(--color-primary-dark)] text-white px-4 rounded-lg font-bold">Ajouter</button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <button key={tag} onClick={() => removeTag(tag)} className="bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-sm hover:bg-red-400 transition-colors">
                            {tag} ✕
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-[var(--color-bg)] p-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-primary-dark)] relative">
                <div className="text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Aperçu</div>
                <div className="whitespace-pre-wrap text-sm">{desc || "..."}</div>
                <button
                    onClick={() => copyToClipboard(desc)}
                    className="absolute top-4 right-4 text-[var(--color-primary-dark)] hover:scale-110 transition-transform"
                >
                    <Copy size={20} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
