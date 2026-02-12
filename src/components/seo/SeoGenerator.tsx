'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, RefreshCw, Trash2, Tag, Info, AlertCircle } from 'lucide-react';
import { TREND_PACKS, QUICK_TAGS } from './seoData';

export default function SeoGenerator() {
  const t = useTranslations('Seo');
  const t_styles = useTranslations('seo_data'); // Access complex object

  const [formData, setFormData] = useState({
    brand: '',
    type: '',
    color: '',
    material: '',
    condition: '',
    style: 'Casual', // Default style key
    details: '',
    vibe: ''
  });

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [manualTag, setManualTag] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [remixSeed, setRemixSeed] = useState(0);

  const generateDescription = useCallback(() => {
    // Helper to get array from translation
    const getArray = (path: string) => {
        // This is a hack because useTranslations doesn't return arrays easily without full key
        // We will try to fetch 3 items max (0, 1, 2) and filter.
        return [0, 1, 2].map(idx => t_styles(`${formData.style}.${path}.${idx}`)).filter((s, idx) => s !== `${formData.style}.${path}.${idx}`);
    };

    const hooks = getArray('hooks');
    const reasons = getArray('reasons');
    const states = getArray('states');
    const closings = getArray('closings');

    // Pick random (using seed to keep it stable unless remix clicked)
    const pick = (arr: string[]) => arr[(remixSeed + Math.floor(Math.random() * arr.length)) % arr.length] || "";

    const ctx = {
        brand: formData.brand || t('ph_brand'),
        type: formData.type || "Article",
        color: formData.color,
        material: formData.material,
        condition: formData.condition || "Bon état",
        vibe: formData.vibe,
        details: formData.details
    };

    const fill = (tpl: string) => tpl.replace(/\{(\w+)\}/g, (_, k) => (ctx as any)[k] || "");

    let desc = "";
    if(hooks.length) desc += fill(pick(hooks)) + "\n\n";
    if(reasons.length) desc += fill(pick(reasons)) + "\n";
    if(states.length) desc += fill(pick(states)) + "\n\n";

    if(formData.details) desc += `📝 ${formData.details}\n\n`;
    if(formData.material) desc += `🧶 ${formData.material}\n`;
    if(formData.color) desc += `🎨 ${formData.color}\n\n`;

    if(closings.length) desc += fill(pick(closings)) + "\n\n";

    if(activeTags.length) desc += activeTags.join(' ');

    setGeneratedDesc(desc);
  }, [formData, activeTags, remixSeed, t_styles, t]);

  // --- LOGIC: UPDATE PREVIEW ---
  useEffect(() => {
    // 1. Generate Title
    const parts = [formData.brand, formData.type, formData.material, formData.color, formData.vibe, formData.condition].filter(Boolean);
    const title = parts.join(' ');
    setGeneratedTitle(title);

    // 2. Calculate Score
    let score = 0;
    if (title.length > 10) score += 20;
    if (formData.brand) score += 20;
    if (formData.type) score += 20;
    if (formData.color) score += 10;
    if (formData.material) score += 10;
    if (formData.condition) score += 10;
    if (formData.vibe) score += 10;

    // Penalties
    if (title.toLowerCase().includes('joli') || title.toLowerCase().includes('sympa')) score -= 10;

    setSeoScore(Math.min(100, Math.max(0, score)));

    // 3. Generate Description
    generateDescription();

    // Check Trophy
    if (score >= 100 && typeof window !== 'undefined') {
         window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'seo_master' }));
    }

  }, [formData, activeTags, remixSeed, generateDescription]); // Dependencies

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'copy_paste' }));
    }
  };

  const addTag = (tag: string) => {
    if (!activeTags.includes(tag) && activeTags.length < 15) {
      setActiveTags([...activeTags, tag]);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'tag_collector' }));
    }
  };

  return (
    <div className="animate-fade-in grid gap-8">

      {/* HEADER + STYLE SELECTOR */}
      <div className="bg-[var(--color-bg)] p-4 rounded-[15px] border border-[var(--color-accent)] flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
            <label className="font-bold text-[var(--color-primary-dark)]">Style :</label>
            <select
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
                className="bg-white border border-[var(--color-primary)] rounded-lg px-3 py-1 font-semibold text-[var(--color-text-main)]"
            >
                {['Casual', 'Pro', 'Emoji', 'Story', 'Minimal'].map(s => (
                    <option key={s} value={s}>{t(`seo_data.styles.${['Casual', 'Pro', 'Emoji', 'Story', 'Minimal'].indexOf(s)}`)}</option> // Dirty key map or just use literal if translation keys match
                    // Ideally: use keys like style_casual
                ))}
                {/* Fallback to keys matching messages.json */}
                 <option value="Casual">{t('style_casual')}</option>
                 <option value="Pro">{t('style_pro')}</option>
                 <option value="Emoji">{t('style_emoji')}</option>
                 <option value="Story">{t('style_story')}</option>
                 <option value="Minimal">{t('style_minimal')}</option>
            </select>
        </div>
        <button
            onClick={() => setRemixSeed(s => s + 1)}
            className="flex items-center gap-2 bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-transform active:scale-95"
        >
            <RefreshCw size={18} /> {t('btn_remix')}
        </button>
      </div>

      {/* TITLE GENERATOR */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)]">
        <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--color-primary-dark)] mb-4">
            <Tag size={20} /> {t('title_perfect')}
        </h3>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
             <input placeholder={t('ph_brand')} className="input-field" onChange={e => setFormData({...formData, brand: e.target.value})} />
             <input placeholder={t('ph_type')} className="input-field" onChange={e => setFormData({...formData, type: e.target.value})} />
             <input placeholder={t('ph_color')} className="input-field" onChange={e => setFormData({...formData, color: e.target.value})} />
             <input placeholder={t('ph_material')} className="input-field" onChange={e => setFormData({...formData, material: e.target.value})} />
             <select className="input-field" onChange={e => setFormData({...formData, condition: e.target.value})}>
                 <option value="">{t('ph_condition')}</option>
                 <option value={t('cond_new')}>{t('cond_new')}</option>
                 <option value={t('cond_vgood')}>{t('cond_vgood')}</option>
                 <option value={t('cond_good')}>{t('cond_good')}</option>
                 <option value={t('cond_fair')}>{t('cond_fair')}</option>
             </select>
             <input placeholder={t('ph_vibe')} className="input-field" onChange={e => setFormData({...formData, vibe: e.target.value})} />
        </div>

        {/* Score & Preview */}
        <div className="bg-[var(--color-bg)] p-4 rounded-[15px] border border-dashed border-[var(--color-primary-dark)] relative">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t('label_preview')}</span>
                <span className="text-xs font-bold">Score SEO: {seoScore}/100</span>
            </div>

            <div className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
                <div
                    className="h-full transition-all duration-500"
                    style={{
                        width: `${seoScore}%`,
                        backgroundColor: seoScore < 40 ? '#ff6b6b' : seoScore < 80 ? '#ffd93d' : '#6bff6b'
                    }}
                />
            </div>

            <p className="font-bold text-lg mb-2 min-h-[1.75rem]">{generatedTitle || "..."}</p>

            {seoScore < 100 && (
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] italic">
                    <AlertCircle size={12} /> Conseil: {seoScore < 50 ? t('seo_hint_short') : t('seo_hint_adj')}
                </div>
            )}

            <button
                onClick={() => handleCopy(generatedTitle)}
                className="absolute top-4 right-4 text-[var(--color-primary-dark)] hover:bg-white p-2 rounded-lg transition-colors"
                title={t('btn_copy')}
            >
                <Copy size={18} />
            </button>
        </div>
      </div>

      {/* DESCRIPTION GENERATOR */}
      <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)]">
        <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--color-primary-dark)] mb-4">
            <Info size={20} /> {t('desc_magic')}
        </h3>

        <textarea
            placeholder={t('ph_details')}
            className="w-full h-24 p-3 rounded-xl border border-[var(--color-accent)] bg-[var(--color-bg)] mb-6 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            onChange={e => setFormData({...formData, details: e.target.value})}
        />

        {/* Tags Section */}
        <div className="mb-6">
            <h4 className="font-bold text-sm text-[var(--color-text-muted)] mb-3">{t('tags_title')}</h4>

            <div className="flex gap-2 mb-3">
                <input
                    value={manualTag}
                    onChange={e => setManualTag(e.target.value)}
                    placeholder={t('ph_manual_tag')}
                    className="flex-1 input-field py-1"
                />
                <button
                    onClick={() => { if(manualTag) { addTag(manualTag.startsWith('#') ? manualTag : '#'+manualTag); setManualTag(''); } }}
                    className="bg-[var(--color-primary-dark)] text-white px-4 rounded-lg font-bold"
                >
                    {t('btn_add')}
                </button>
            </div>

            <select
                onChange={(e) => {
                    const pack = TREND_PACKS[e.target.value];
                    if(pack) {
                        pack.forEach(addTag);
                        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'trend_setter' }));
                    }
                    e.target.value = "";
                }}
                className="w-full mb-3 input-field"
            >
                <option value="">{t('pack_select')}</option>
                {Object.keys(TREND_PACKS).map(k => (
                    <option key={k} value={k}>#{k}</option>
                ))}
            </select>

            <div className="flex flex-wrap gap-2 mb-4 max-h-20 overflow-y-auto">
                {QUICK_TAGS.map(tag => (
                    <button key={tag} onClick={() => addTag(tag)} className="text-xs bg-[var(--color-surface)] border border-[var(--color-primary)] rounded-full px-3 py-1 hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                        {tag}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-[var(--color-bg)] rounded-xl min-h-[50px]">
                {activeTags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-[var(--color-primary-dark)] text-white text-xs px-2 py-1 rounded-lg">
                        {tag}
                        <button onClick={() => setActiveTags(activeTags.filter(t => t !== tag))}><Trash2 size={12} /></button>
                    </span>
                ))}
            </div>
        </div>

        {/* Preview */}
        <div className="bg-[var(--color-bg)] p-4 rounded-[15px] border border-dashed border-[var(--color-primary-dark)] relative">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-2">{t('label_preview')}</span>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-main)]">
                {generatedDesc || "..."}
            </div>
            <button
                onClick={() => handleCopy(generatedDesc)}
                className="absolute top-4 right-4 text-[var(--color-primary-dark)] hover:bg-white p-2 rounded-lg transition-colors"
                title={t('btn_copy')}
            >
                <Copy size={18} />
            </button>
        </div>

      </div>
    </div>
  );
}
