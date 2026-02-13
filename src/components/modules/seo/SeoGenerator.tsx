'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, RefreshCw, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to fill template
function fillTemplate(template: string, data: Record<string, string>) {
    return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || "");
}

// Trend Packs Data
const trendPacks = {
    gorpcore: ["#gorpcore", "#trekking", "#arcteryxstyle", "#techwear", "#outdoor"],
    officesiren: ["#officesiren", "#corpcore", "#bayonetta", "#miumiu", "#90sminimalism"],
    coquette: ["#coquette", "#balletcore", "#ribbons", "#lanadelrey", "#softgirl"],
    oldmoney: ["#oldmoney", "#quietluxury", "#cashmere", "#ralphlauren", "#classy"],
    y2k: ["#y2k", "#2000s", "#cyber", "#bimbo", "#bratz"],
    darkacademia: ["#darkacademia", "#preppy", "#vintage", "#wool", "#classic"]
};

// Common Tags Library
const libraryTags = ["#vintage", "#summer", "#casual", "#chic", "#italy", "#laine", "#soie", "#cuir", "#rare", "#tendance"];

export default function SeoGenerator() {
  const t = useTranslations('Seo');
  // Hack to access nested data if keys are flattened like 'seo_data.styles.0'
  // Or assuming we have the full structure in translation context.
  // For V2 prototype fidelity, I will use a robust approach: try t.raw() if available or hardcode structure fallback if i18n fails.
  // Assuming 'seo_data' is accessible via t.raw('seo_data') if configured in next-intl.
  let seoData: any;
  try {
      seoData = t.raw('seo_data');
  } catch (e) {
      // Fallback or empty
      seoData = { styles: ["Casual"] };
  }

  const [formData, setFormData] = useState({
      brand: '', type: '', color: '', material: '', condition: '', vibe: '', details: ''
  });
  const [style, setStyle] = useState('Casual');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [manualTag, setManualTag] = useState('');
  const [previewTitle, setPreviewTitle] = useState('...');
  const [previewDesc, setPreviewDesc] = useState('...');
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState<string[]>([]);

  // Update Logic
  const updatePreview = (newData = formData, newTags = selectedTags, newStyle = style) => {
      // 1. Title
      const parts = [newData.brand, newData.type, newData.material, newData.color, newData.vibe, newData.condition].filter(Boolean);
      const title = parts.join(' ') || '...';
      setPreviewTitle(title);

      // 2. Score
      let s = 0;
      let h: string[] = [];
      if(title.length > 10) s += 20; else h.push(t('seo_hint_short'));
      if(newData.brand) s += 20; else h.push(t('seo_hint_brand'));
      if(newData.type) s += 20; else h.push(t('seo_hint_type'));
      if(newData.color) s += 10;
      if(newData.material) s += 10;
      if(newData.condition) s += 10;
      if(newData.vibe) s += 10;

      const lower = title.toLowerCase();
      if(lower.includes('joli') || lower.includes('sympa')) {
          s -= 10;
          h.push(t('seo_hint_adj'));
      }
      setScore(Math.min(100, Math.max(0, s)));
      setHints(h);
      if(s === 100 && h.length === 0) h.push(t('seo_hint_perfect'));

      // 3. Description
      if(seoData && seoData[newStyle]) {
          const templates = seoData[newStyle];
          const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

          const ctx = {
              brand: newData.brand || "Marque",
              type: newData.type || "Article",
              color: newData.color,
              material: newData.material,
              condition: newData.condition || "Bon état",
              vibe: newData.vibe,
              details: newData.details
          };

          let d = "";
          d += fillTemplate(pick(templates.hooks), ctx) + "\n\n";
          d += fillTemplate(pick(templates.reasons), ctx) + "\n";
          d += fillTemplate(pick(templates.states), ctx) + "\n\n";
          if(newData.details) d += `📝 ${newData.details}\n\n`;
          if(newData.material) d += `🧶 ${newData.material}\n`;
          if(newData.color) d += `🎨 ${newData.color}\n\n`;
          d += fillTemplate(pick(templates.closings), ctx) + "\n\n";
          if(newTags.length > 0) d += newTags.join(' ');

          setPreviewDesc(d);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      const key = id.replace('gen-', ''); // remove prefix
      const newData = { ...formData, [key]: value };
      setFormData(newData);
      updatePreview(newData);
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStyle(e.target.value);
      updatePreview(formData, selectedTags, e.target.value);
  };

  const addTag = (tag: string) => {
      if(!selectedTags.includes(tag) && selectedTags.length < 15) {
          const newTags = [...selectedTags, tag];
          setSelectedTags(newTags);
          updatePreview(formData, newTags);
          window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'tag_collector' }));
      }
  };

  const removeTag = (tag: string) => {
      const newTags = selectedTags.filter(t => t !== tag);
      setSelectedTags(newTags);
      updatePreview(formData, newTags);
  };

  const addManual = () => {
      let val = manualTag.trim();
      if(!val) return;
      if(!val.startsWith('#')) val = '#' + val;
      addTag(val);
      setManualTag('');
  };

  const handlePackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const pack = e.target.value as keyof typeof trendPacks;
      if(trendPacks[pack]) {
          let current = [...selectedTags];
          trendPacks[pack].forEach(t => {
              if(!current.includes(t) && current.length < 15) current.push(t);
          });
          setSelectedTags(current);
          updatePreview(formData, current);
          window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'trend_setter' }));
      }
      e.target.value = ""; // reset
  };

  const copyText = (text: string) => {
      navigator.clipboard.writeText(text);
      window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'copy_paste' }));
      // Could show toast here
  };

  // Unlock SEO trophy if high score
  if(score > 90) window.dispatchEvent(new CustomEvent('unlockTrophy', { detail: 'seo_master' }));

  return (
    <div className="animate-fade-in bg-[var(--surface)] p-5 rounded-[var(--border-radius)] shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-bold text-[var(--primary-dark)] mb-1">{t('seo_title')}</h2>
        <p className="text-[var(--text-muted)] mb-6 text-sm">{t('seo_subtitle')}</p>

        {/* Style & Remix */}
        <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--accent)] mb-6 flex gap-3 items-center">
            <select value={style} onChange={handleStyleChange} className="flex-1 bg-transparent font-bold text-[var(--primary-dark)] outline-none cursor-pointer">
                {seoData?.styles?.map((s: string) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
            <button
                onClick={() => updatePreview()} // Randomize templates logic is inside updatePreview via math.random
                className="bg-[var(--secondary)] text-white px-4 py-2 rounded-lg font-bold shadow-sm whitespace-nowrap hover:bg-[#ff8f8f] transition-colors flex items-center gap-2"
            >
                <RefreshCw size={16} /> {t.raw('btn_remix')}
            </button>
        </div>

        {/* Form Grid */}
        <div className="space-y-6">
            <div>
                <h3 className="text-md font-bold mb-3 flex items-center gap-2">
                    {t('title_perfect')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <input id="gen-brand" placeholder={t('ph_brand')} onChange={handleChange} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none focus:border-[var(--primary-dark)] transition-colors" />
                    <input id="gen-type" placeholder={t('ph_type')} onChange={handleChange} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none focus:border-[var(--primary-dark)] transition-colors" />
                    <input id="gen-color" placeholder={t('ph_color')} onChange={handleChange} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none focus:border-[var(--primary-dark)] transition-colors" />
                    <input id="gen-material" placeholder={t('ph_material')} onChange={handleChange} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none focus:border-[var(--primary-dark)] transition-colors" />
                    <select id="gen-condition" onChange={handleChange} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none focus:border-[var(--primary-dark)] transition-colors text-[var(--text-main)]">
                        <option value="">{t('ph_condition')}</option>
                        <option value={t('cond_new')}>{t('cond_new')}</option>
                        <option value={t('cond_vgood')}>{t('cond_vgood')}</option>
                        <option value={t('cond_good')}>{t('cond_good')}</option>
                        <option value={t('cond_fair')}>{t('cond_fair')}</option>
                    </select>
                    <input id="gen-vibe" placeholder={t('ph_vibe')} onChange={handleChange} className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none focus:border-[var(--primary-dark)] transition-colors" />
                </div>

                {/* Title Preview & Score */}
                <div className="mt-4 bg-[var(--background)] p-4 rounded-xl border border-dashed border-[var(--primary-dark)] relative">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{t('label_preview')}</label>
                        <span className="text-xs font-bold">Score SEO: {score}/100</span>
                    </div>

                    <div className="h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
                        <div
                            className="h-full transition-all duration-500 rounded-full"
                            style={{
                                width: `${score}%`,
                                backgroundColor: score < 40 ? '#ff6b6b' : score < 80 ? '#ffd93d' : '#6bff6b'
                            }}
                        />
                    </div>

                    <p className="font-bold text-lg text-[var(--text-main)] min-h-[1.75rem] break-words pr-16">{previewTitle}</p>

                    <div className="text-xs text-[var(--text-muted)] mt-2 italic">
                        {hints.length > 0 ? "Conseil : " + hints.join(", ") : t('seo_hint_perfect')}
                    </div>

                    <button onClick={() => copyText(previewTitle)} className="absolute top-9 right-3 text-[var(--primary-dark)] text-xs font-bold flex items-center gap-1 hover:bg-white/50 p-1 rounded">
                        <Copy size={14} /> {t('btn_copy')}
                    </button>
                </div>
            </div>

            {/* Description */}
            <div>
                 <h3 className="text-md font-bold mb-3 flex items-center gap-2">
                    {t('desc_magic')}
                </h3>
                <textarea
                    id="gen-details"
                    placeholder={t('ph_details')}
                    onChange={handleChange}
                    className="w-full p-3 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none focus:border-[var(--primary-dark)] transition-colors h-24 resize-none"
                />

                {/* Tags */}
                <div className="mt-4">
                    <label className="text-sm font-bold text-[var(--text-muted)] mb-2 block">{t('tags_title')}</label>

                    <div className="flex gap-2 mb-2">
                        <input
                            value={manualTag}
                            onChange={(e) => setManualTag(e.target.value)}
                            placeholder={t('ph_manual_tag')}
                            className="flex-1 p-2 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none text-sm"
                        />
                        <button onClick={addManual} className="bg-[var(--primary-dark)] text-white px-3 rounded-lg text-sm font-bold">
                            {t('btn_add')}
                        </button>
                    </div>

                    <select onChange={handlePackChange} className="w-full p-2 bg-[var(--background)] border border-[var(--accent)] rounded-lg outline-none text-sm mb-3">
                        <option value="">{t('pack_select')}</option>
                        {Object.keys(trendPacks).map(k => (
                            <option key={k} value={k}>#{k}</option>
                        ))}
                    </select>

                    <div className="flex flex-wrap gap-1.5 mb-3 max-h-20 overflow-y-auto">
                        {libraryTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => addTag(tag)}
                                className="px-2 py-1 border border-[var(--primary)] rounded-full text-xs text-[var(--text-muted)] bg-[var(--surface)] hover:bg-[var(--background)] hover:text-[var(--primary-dark)] transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 bg-[var(--background)] p-3 rounded-lg min-h-[40px]">
                        {selectedTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => removeTag(tag)}
                                className="bg-[var(--primary-dark)] text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
                            >
                                {tag} <X size={12} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desc Preview */}
                <div className="mt-4 bg-[var(--background)] p-4 rounded-xl border border-dashed border-[var(--primary-dark)] relative">
                    <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] block mb-2">{t('label_preview')}</label>
                    <div className="text-sm whitespace-pre-wrap text-[var(--text-main)] pr-10">{previewDesc}</div>
                    <button onClick={() => copyText(previewDesc)} className="absolute top-3 right-3 text-[var(--primary-dark)] text-xs font-bold flex items-center gap-1 hover:bg-white/50 p-1 rounded">
                        <Copy size={14} /> {t('btn_copy')}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
