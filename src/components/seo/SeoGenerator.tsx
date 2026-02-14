'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, RefreshCw, Trash2, Tag, Info, AlertCircle, Plus, Wand2 } from 'lucide-react';
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

  // New Input Style with "Encadré" look
  const InputField = ({ label, value, onChange, placeholder, type = 'text' }: any) => (
    <div className="relative group">
        <label className="absolute -top-2.5 left-3 bg-[var(--color-surface)] px-2 text-xs font-bold text-[var(--color-primary-dark)] z-10">
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 rounded-xl border-2 border-[var(--color-accent)] bg-transparent focus:border-[var(--color-primary)] outline-none transition-all placeholder:text-[var(--color-text-muted)]/50 text-[var(--color-text-main)] font-medium"
        />
    </div>
  );

  const SelectField = ({ label, value, onChange, options }: any) => (
    <div className="relative group">
        <label className="absolute -top-2.5 left-3 bg-[var(--color-surface)] px-2 text-xs font-bold text-[var(--color-primary-dark)] z-10">
            {label}
        </label>
        <select
            value={value}
            onChange={onChange}
            className="w-full p-3 rounded-xl border-2 border-[var(--color-accent)] bg-transparent focus:border-[var(--color-primary)] outline-none transition-all text-[var(--color-text-main)] font-medium appearance-none cursor-pointer"
        >
            {options}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">
            ▼
        </div>
    </div>
  );

  const generateDescription = useCallback(() => {
    const getTemplate = (section: string) => {
        const key = `seo_data.${formData.style}.${section}`;
        const templates = t.raw(key);
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
      {/* Top Bar */}
      <div className="bg-[var(--color-bg)] p-4 rounded-[15px] border border-[var(--color-accent)] flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
            <label className="font-bold text-[var(--color-primary-dark)]">Style :</label>
            <select
                value={formData.style}
                onChange={(e) => setFormData({...formData, style: e.target.value})}
                className="bg-[var(--color-surface)] border-2 border-[var(--color-primary)] rounded-lg px-3 py-1 font-bold text-[var(--color-text-main)] outline-none cursor-pointer hover:bg-[var(--color-bg)] transition-colors dark:bg-[#383848]"
            >
                 <option value="Casual">{t('style_casual')}</option>
                 <option value="Pro">{t('style_pro')}</option>
                 <option value="Emoji">{t('style_emoji')}</option>
                 <option value="Story">{t('style_story')}</option>
                 <option value="Minimal">{t('style_minimal')}</option>
            </select>
        </div>

        {/* Updated Remix Button with high contrast and background */}
        <button
            onClick={() => setRemixSeed(s => s + 1)}
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--color-secondary)] to-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
        >
            <Wand2 size={18} /> {t('btn_remix')}
        </button>
      </div>

      <div className="bg-[var(--color-surface)] p-6 rounded-[20px] shadow-[var(--shadow-soft)]">
        <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--color-primary-dark)] mb-6">
            <Tag size={20} /> {t('title_perfect')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="flex flex-col gap-1">
                <InputField
                    label={t('ph_brand')}
                    placeholder={t('ex_brand')}
                    value={formData.brand}
                    onChange={(e: any) => setFormData({...formData, brand: e.target.value})}
                />
             </div>
             <div className="flex flex-col gap-1">
                <InputField
                    label={t('ph_type')}
                    placeholder={t('ex_type')}
                    value={formData.type}
                    onChange={(e: any) => setFormData({...formData, type: e.target.value})}
                />
             </div>
             <div className="flex flex-col gap-1">
                <InputField
                    label={t('ph_color')}
                    placeholder={t('ex_color')}
                    value={formData.color}
                    onChange={(e: any) => setFormData({...formData, color: e.target.value})}
                />
             </div>
             <div className="flex flex-col gap-1">
                <InputField
                    label={t('ph_material')}
                    placeholder={t('ex_material')}
                    value={formData.material}
                    onChange={(e: any) => setFormData({...formData, material: e.target.value})}
                />
             </div>
             <div className="flex flex-col gap-1">
                <SelectField
                    label={t('ph_condition')}
                    value={formData.condition}
                    onChange={(e: any) => setFormData({...formData, condition: e.target.value})}
                    options={
                        <>
                            <option value="">{t('ph_condition')}</option>
                            <option value={t('cond_new')}>{t('cond_new')}</option>
                            <option value={t('cond_vgood')}>{t('cond_vgood')}</option>
                            <option value={t('cond_good')}>{t('cond_good')}</option>
                            <option value={t('cond_fair')}>{t('cond_fair')}</option>
                        </>
                    }
                />
             </div>
             <div className="flex flex-col gap-1">
                <InputField
                    label={t('ph_vibe')}
                    placeholder={t('ex_vibe')}
                    value={formData.vibe}
                    onChange={(e: any) => setFormData({...formData, vibe: e.target.value})}
                />
             </div>
        </div>

        {/* Preview Title */}
        <div className="bg-[var(--color-bg)] p-4 rounded-[15px] border-2 border-dashed border-[var(--color-primary-dark)] relative group hover:border-solid transition-all">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{t('label_preview')}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${seoScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    Score: {seoScore}/100
                </span>
            </div>

            <div className="h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
                <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                        width: `${seoScore}%`,
                        backgroundColor: seoScore < 40 ? '#ff6b6b' : seoScore < 80 ? '#ffd93d' : '#4ade80'
                    }}
                />
            </div>

            <p className="font-bold text-lg mb-2 min-h-[1.75rem] break-words">{generatedTitle || "..."}</p>

            {seoScore < 100 && (
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] italic">
                    <AlertCircle size={12} /> Conseil: {seoScore < 50 ? t('seo_hint_short') : t('seo_hint_adj')}
                </div>
            )}

            <button
                onClick={() => handleCopy(generatedTitle)}
                className="absolute top-4 right-4 bg-white/50 hover:bg-white p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold text-[var(--color-primary-dark)] shadow-sm"
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

        <div className="relative mb-6 group">
            <label className="absolute -top-2.5 left-3 bg-[var(--color-surface)] px-2 text-xs font-bold text-[var(--color-primary-dark)] z-10">
                {t('ph_details')}
            </label>
            <textarea
                placeholder="Ex: Jamais porté, cadeau..."
                className="w-full h-24 p-4 rounded-xl border-2 border-[var(--color-accent)] bg-transparent focus:border-[var(--color-primary)] outline-none transition-all resize-none text-[var(--color-text-main)]"
                onChange={e => setFormData({...formData, details: e.target.value})}
            />
        </div>

        <div className="mb-6">
            <h4 className="font-bold text-sm text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                <Tag size={16} /> {t('tags_title')}
            </h4>

            <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                     <InputField
                        label="#"
                        placeholder={t('ph_manual_tag')}
                        value={manualTag}
                        onChange={(e: any) => setManualTag(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => { if(manualTag) { addTag(manualTag.startsWith('#') ? manualTag : '#'+manualTag); setManualTag(''); } }}
                    className="bg-[var(--color-primary-dark)] text-white px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-[var(--color-primary)] transition-colors shadow-md h-[52px] mt-0.5"
                >
                    <Plus size={18} /> {t('btn_add')}
                </button>
            </div>

            <div className="relative group mb-4">
                <label className="absolute -top-2.5 left-3 bg-[var(--color-surface)] px-2 text-xs font-bold text-[var(--color-primary-dark)] z-10">
                    {t('pack_select')}
                </label>
                <select
                    onChange={(e) => {
                        const pack = TREND_PACKS[e.target.value];
                        if(pack) {
                            const shuffled = [...pack].sort(() => 0.5 - Math.random());
                            const selected = shuffled.slice(0, 5);
                            selected.forEach(tag => {
                                if (!activeTags.includes(tag) && activeTags.length < 15) {
                                    setActiveTags(prev => [...prev, tag]);
                                }
                            });
                            if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'trend_setter' }));
                        }
                        e.target.value = "";
                    }}
                    className="w-full p-3 rounded-xl border-2 border-[var(--color-accent)] bg-[var(--color-surface)] text-[var(--color-text-main)] outline-none cursor-pointer appearance-none dark:bg-[#383848]"
                >
                    <option value="">{t('pack_select')}</option>
                    {Object.keys(TREND_PACKS).map(k => (
                        <option key={k} value={k}>{k}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-text-muted)]">▼</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-y-auto custom-scrollbar">
                {QUICK_TAGS.map(tag => (
                    <button key={tag} onClick={() => addTag(tag)} className="text-xs bg-[var(--color-bg)] border border-[var(--color-accent)] rounded-full px-3 py-1 hover:bg-[var(--color-primary)] hover:text-white transition-colors hover:border-transparent">
                        {tag}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 p-4 bg-[var(--color-bg)] rounded-xl min-h-[60px] border border-[var(--color-accent)] items-start">
                {activeTags.length === 0 && <span className="text-xs text-[var(--color-text-muted)] italic">Les hashtags apparaitront ici...</span>}
                {activeTags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-[var(--color-primary-dark)] text-white text-xs px-2 py-1 rounded-lg animate-in fade-in zoom-in shadow-sm">
                        {tag}
                        <button onClick={() => setActiveTags(activeTags.filter(t => t !== tag))} className="hover:text-red-300 ml-1"><Trash2 size={12} /></button>
                    </span>
                ))}
            </div>
        </div>

        <div className="bg-[var(--color-bg)] p-4 rounded-[15px] border-2 border-dashed border-[var(--color-primary-dark)] relative hover:border-solid transition-all">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-2">{t('label_preview')}</span>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-main)] min-h-[4rem]">
                {generatedDesc || "..."}
            </div>
            <button
                onClick={() => handleCopy(generatedDesc)}
                className="absolute top-4 right-4 bg-white/50 hover:bg-white p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold text-[var(--color-primary-dark)] shadow-sm"
                title={t('btn_copy')}
            >
                <Copy size={14} /> {t('btn_copy')}
            </button>
        </div>

      </div>
    </div>
  );
}
