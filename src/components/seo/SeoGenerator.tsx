'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, RefreshCw, Trash2, Tag, Info, AlertCircle, Plus } from 'lucide-react';
import { TREND_PACKS, QUICK_TAGS } from './seoData';

export default function SeoGenerator() {
  const t = useTranslations('Seo');

  const [formData, setFormData] = useState({
    brand: '',
    type: '',
    color: '',
    material: '',
    condition: '',
    style: 'Casual',
    details: '',
    vibe: ''
  });

  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [manualTag, setManualTag] = useState('');
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [remixSeed, setRemixSeed] = useState(0);

  const inputStyle = "w-full p-3 rounded-xl border border-[var(--color-accent)] bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--color-text-muted)] text-[var(--color-text-main)]";

  const generateDescription = useCallback(() => {
    // Retrieve array of templates from translation files
    // Key format: Seo.seo_data.Casual.hooks -> Returns Array
    const getTemplate = (section: string) => {
        // Construct the key path relative to 'Seo' namespace
        const key = `seo_data.${formData.style}.${section}`;
        const templates = t.raw(key);

        // Ensure we got an array
        if (Array.isArray(templates) && templates.length > 0) {
            const idx = (remixSeed + Math.floor(Math.random() * templates.length)) % templates.length;
            return templates[idx];
        }
        return "";
    };

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
    const hook = getTemplate('hooks');
    const reason = getTemplate('reasons');
    const state = getTemplate('states');
    const closing = getTemplate('closings');

    if(hook) desc += fill(hook) + "\n\n";
    if(reason) desc += fill(reason) + "\n";
    if(state) desc += fill(state) + "\n\n";

    if(formData.details) desc += `📝 ${formData.details}\n\n`;
    if(formData.material) desc += `🧶 ${formData.material}\n`;
    if(formData.color) desc += `🎨 ${formData.color}\n\n`;

    if(closing) desc += fill(closing) + "\n\n";

    if(activeTags.length) desc += activeTags.join(' ');

    setGeneratedDesc(desc);
  }, [formData, activeTags, remixSeed, t]);

  useEffect(() => {
    const parts = [formData.brand, formData.type, formData.material, formData.color, formData.vibe, formData.condition].filter(Boolean);
    const title = parts.join(' ');
    setGeneratedTitle(title);

    let score = 0;
    if (title.length > 10) score += 20;
    if (formData.brand) score += 20;
    if (formData.type) score += 20;
    if (formData.color) score += 10;
    if (formData.material) score += 10;
    if (formData.condition) score += 10;
    if (formData.vibe) score += 10;

    if (title.toLowerCase().includes('joli') || title.toLowerCase().includes('sympa')) score -= 10;

    setSeoScore(Math.min(100, Math.max(0, score)));

    generateDescription();

    if (score >= 100 && typeof window !== 'undefined') {
         window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'seo_master' }));
    }

  }, [formData, activeTags, remixSeed, generateDescription]);

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
      <div className="bg-[var(--color-bg)] p-4 rounded-[15px] border border-[var(--color-accent)] flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
            <label className="font-bold text-[var(--color-primary-dark)]">Style :</label>
            <select
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
                className="bg-[var(--color-surface)] border border-[var(--color-primary)] rounded-lg px-3 py-1 font-semibold text-[var(--color-text-main)] outline-none dark:bg-[#383848]"
            >
                 <option value="Casual">{t('style_casual')}</option>
                 <option value="Pro">{t('style_pro')}</option>
                 <option value="Emoji">{t('style_emoji')}</option>
                 <option value="Story">{t('style_story')}</option>
                 <option value="Minimal">{t('style_minimal')}</option>
            </select>
        </div>
        <button
            onClick={() => setRemixSeed(s => s + 1)}
            className="flex items-center gap-2 bg-[var(--color-secondary)] text-gray-900 px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-transform active:scale-95"
        >
            <RefreshCw size={18} /> {t('btn_remix')}
        </button>
      </div>

      <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)]">
        <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--color-primary-dark)] mb-4">
            <Tag size={20} /> {t('title_perfect')}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
             <div className="flex flex-col">
                <input placeholder={t('ph_brand')} className={inputStyle} onChange={e => setFormData({...formData, brand: e.target.value})} />
                <span className="text-[10px] text-[var(--color-text-muted)] italic mt-1 ml-1">{t('ex_brand')}</span>
             </div>
             <div className="flex flex-col">
                <input placeholder={t('ph_type')} className={inputStyle} onChange={e => setFormData({...formData, type: e.target.value})} />
                <span className="text-[10px] text-[var(--color-text-muted)] italic mt-1 ml-1">{t('ex_type')}</span>
             </div>
             <div className="flex flex-col">
                <input placeholder={t('ph_color')} className={inputStyle} onChange={e => setFormData({...formData, color: e.target.value})} />
                <span className="text-[10px] text-[var(--color-text-muted)] italic mt-1 ml-1">{t('ex_color')}</span>
             </div>
             <div className="flex flex-col">
                <input placeholder={t('ph_material')} className={inputStyle} onChange={e => setFormData({...formData, material: e.target.value})} />
                <span className="text-[10px] text-[var(--color-text-muted)] italic mt-1 ml-1">{t('ex_material')}</span>
             </div>
             <div className="flex flex-col">
                <select className={inputStyle} onChange={e => setFormData({...formData, condition: e.target.value})}>
                    <option value="">{t('ph_condition')}</option>
                    <option value={t('cond_new')}>{t('cond_new')}</option>
                    <option value={t('cond_vgood')}>{t('cond_vgood')}</option>
                    <option value={t('cond_good')}>{t('cond_good')}</option>
                    <option value={t('cond_fair')}>{t('cond_fair')}</option>
                </select>
                <span className="text-[10px] text-[var(--color-text-muted)] italic mt-1 ml-1">{t('ex_condition')}</span>
             </div>
             <div className="flex flex-col">
                <input placeholder={t('ph_vibe')} className={inputStyle} onChange={e => setFormData({...formData, vibe: e.target.value})} />
                <span className="text-[10px] text-[var(--color-text-muted)] italic mt-1 ml-1">{t('ex_vibe')}</span>
             </div>
        </div>

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
                className="absolute top-4 right-4 text-[var(--color-primary-dark)] hover:bg-white p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                title={t('btn_copy')}
            >
                <Copy size={14} /> {t('btn_copy')}
            </button>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)]">
        <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--color-primary-dark)] mb-4">
            <Info size={20} /> {t('desc_magic')}
        </h3>

        <textarea
            placeholder={t('ph_details')}
            className={`w-full h-24 ${inputStyle} mb-6 resize-none`}
            onChange={e => setFormData({...formData, details: e.target.value})}
        />

        <div className="mb-6">
            <h4 className="font-bold text-sm text-[var(--color-text-muted)] mb-3">{t('tags_title')}</h4>

            <div className="flex gap-2 mb-3">
                <input
                    value={manualTag}
                    onChange={e => setManualTag(e.target.value)}
                    placeholder={t('ph_manual_tag')}
                    className={`flex-1 ${inputStyle} py-2`}
                />
                <button
                    onClick={() => { if(manualTag) { addTag(manualTag.startsWith('#') ? manualTag : '#'+manualTag); setManualTag(''); } }}
                    className="bg-[var(--color-primary-dark)] text-white px-4 rounded-xl font-bold flex items-center gap-2"
                >
                    <Plus size={18} /> {t('btn_add')}
                </button>
            </div>

            <select
                onChange={(e) => {
                    const pack = TREND_PACKS[e.target.value];
                    if(pack) {
                        // Pick 5 random unique tags from the pack
                        const shuffled = [...pack].sort(() => 0.5 - Math.random());
                        const selected = shuffled.slice(0, 5);

                        selected.forEach(tag => {
                            // Only add if not already present and limit total tags (e.g., 15)
                            if (!activeTags.includes(tag) && activeTags.length < 15) {
                                setActiveTags(prev => [...prev, tag]);
                            }
                        });

                        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'trend_setter' }));
                    }
                    e.target.value = "";
                }}
                className={`w-full mb-3 ${inputStyle} py-2 bg-[var(--color-surface)] text-[var(--color-text-main)] dark:bg-[#383848]`}
            >
                <option value="">{t('pack_select')}</option>
                {Object.keys(TREND_PACKS).map(k => (
                    <option key={k} value={k}>{k}</option>
                ))}
            </select>

            <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-y-auto">
                {QUICK_TAGS.map(tag => (
                    <button key={tag} onClick={() => addTag(tag)} className="text-xs bg-[var(--color-surface)] border border-[var(--color-primary)] rounded-full px-3 py-1 hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                        {tag}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-[var(--color-bg)] rounded-xl min-h-[50px] border border-[var(--color-accent)]">
                {activeTags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-[var(--color-primary-dark)] text-white text-xs px-2 py-1 rounded-lg animate-in fade-in zoom-in">
                        {tag}
                        <button onClick={() => setActiveTags(activeTags.filter(t => t !== tag))} className="hover:text-red-300"><Trash2 size={12} /></button>
                    </span>
                ))}
            </div>
        </div>

        <div className="bg-[var(--color-bg)] p-4 rounded-[15px] border border-dashed border-[var(--color-primary-dark)] relative">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-2">{t('label_preview')}</span>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-main)] min-h-[4rem]">
                {generatedDesc || "..."}
            </div>
            <button
                onClick={() => handleCopy(generatedDesc)}
                className="absolute top-4 right-4 text-[var(--color-primary-dark)] hover:bg-white p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                title={t('btn_copy')}
            >
                <Copy size={14} /> {t('btn_copy')}
            </button>
        </div>

      </div>
    </div>
  );
}
