'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BarChart2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InfographicPage() {
  const router = useRouter();
  const t = useTranslations('Infographic');

  // Dynamic Data Construction for Translation
  const weeklyData = [
    { day: t.raw('days')[0], score: 45, color: 'bg-red-200' },
    { day: t.raw('days')[1], score: 50, color: 'bg-orange-200' },
    { day: t.raw('days')[2], score: 65, color: 'bg-yellow-200' },
    { day: t.raw('days')[3], score: 60, color: 'bg-yellow-200' },
    { day: t.raw('days')[4], score: 70, color: 'bg-green-200' },
    { day: t.raw('days')[5], score: 85, color: 'bg-green-300' },
    { day: t.raw('days')[6], score: 98, color: 'bg-green-500' },
  ];

  const trafficData = [
    { month: t.raw('months')[0], val: 80, color: 'bg-[var(--color-primary-dark)]' },
    { month: t.raw('months')[1], val: 70, color: 'bg-[var(--color-primary)]' },
    { month: t.raw('months')[2], val: 75, color: 'bg-[var(--color-primary)]' },
    { month: t.raw('months')[3], val: 80, color: 'bg-[var(--color-primary)]' },
    { month: t.raw('months')[4], val: 85, color: 'bg-[#ff5f84]' },
    { month: t.raw('months')[5], val: 75, color: 'bg-[#ff5f84]' },
    { month: t.raw('months')[6], val: 50, color: 'bg-gray-300' }, // Low
    { month: t.raw('months')[7], val: 65, color: 'bg-[var(--color-secondary)]' },
    { month: t.raw('months')[8], val: 90, color: 'bg-[var(--color-primary-dark)]' },
    { month: t.raw('months')[9], val: 85, color: 'bg-[var(--color-primary-dark)]' },
    { month: t.raw('months')[10], val: 95, color: 'bg-[#ff5f84]' }, // Peak
    { month: t.raw('months')[11], val: 80, color: 'bg-[var(--color-primary-dark)]' },
  ];

  const calendarData = [
      { m: t.raw('full_months')[0], t: t('cal_jan_t'), color: 'border-blue-500', items: t.raw('cal_jan_i') },
      { m: t.raw('full_months')[1], t: t('cal_feb_t'), color: 'border-blue-500', items: t.raw('cal_feb_i') },
      { m: t.raw('full_months')[2], t: t('cal_mar_t'), color: 'border-teal-400', items: t.raw('cal_mar_i') },
      { m: t.raw('full_months')[3], t: t('cal_apr_t'), color: 'border-teal-500', items: t.raw('cal_apr_i') },
      { m: t.raw('full_months')[4], t: t('cal_may_t'), color: 'border-red-400', items: t.raw('cal_may_i') },
      { m: t.raw('full_months')[5], t: t('cal_jun_t'), color: 'border-red-500', items: t.raw('cal_jun_i') },
      { m: t.raw('full_months')[6], t: t('cal_jul_t'), color: 'border-yellow-500', items: t.raw('cal_jul_i') },
      { m: t.raw('full_months')[7], t: t('cal_aug_t'), color: 'border-indigo-500', items: t.raw('cal_aug_i') },
      { m: t.raw('full_months')[8], t: t('cal_sep_t'), color: 'border-indigo-600', items: t.raw('cal_sep_i') },
      { m: t.raw('full_months')[9], t: t('cal_oct_t'), color: 'border-blue-700', items: t.raw('cal_oct_i') },
      { m: t.raw('full_months')[10], t: t('cal_nov_t'), color: 'border-gray-800', items: t.raw('cal_nov_i') },
      { m: t.raw('full_months')[11], t: t('cal_dec_t'), color: 'border-yellow-400', items: t.raw('cal_dec_i') },
  ];

  return (
    <div className="animate-fade-in pb-20">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-bg)] transition-colors shadow-sm"
        >
          <ArrowLeft size={24} className="text-[var(--color-text-main)]" />
        </button>
        <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary-dark)]">
                {t('title')}
            </h1>
            <p className="text-[var(--color-text-muted)]">
                {t('subtitle')}
            </p>
        </div>
      </div>

      <div className="grid gap-8">

        {/* SECTION 1: TIMING */}
        <section className="bg-[var(--color-surface)] rounded-[25px] p-6 shadow-md border-t-4 border-[#ff5f84]">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-[#ff5f84]" size={28} />
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">{t('sec1_title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <p className="text-[var(--color-text-muted)] leading-relaxed" dangerouslySetInnerHTML={{__html: t.raw('sec1_desc')}} />

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-[var(--color-primary-dark)]">
                    <h4 className="font-bold text-[var(--color-primary-dark)] mb-1">{t('prime_title')}</h4>
                    <p className="text-sm">{t('prime_desc')}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-l-4 border-[#ff5f84]">
                    <h4 className="font-bold text-[#ff5f84] mb-1">{t('avoid_title')}</h4>
                    <p className="text-sm">{t('avoid_desc')}</p>
                </div>
            </div>

            {/* Simple Bar Chart for Week */}
            <div className="flex flex-col justify-between h-64 gap-2">
                {weeklyData.map((d) => (
                    <div key={d.day} className="flex items-center gap-2">
                        <span className="w-20 text-xs font-bold text-right truncate">{d.day}</span>
                        <div className="flex-1 h-6 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden relative">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${d.score}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full ${d.color} opacity-80`}
                            />
                        </div>
                        <span className="w-8 text-xs font-bold">{d.score}</span>
                    </div>
                ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: VOLUME TRAFIC */}
        <section className="bg-[var(--color-surface)] rounded-[25px] p-6 shadow-md border-t-4 border-[var(--color-primary-dark)]">
           <div className="flex items-center gap-3 mb-6">
            <BarChart2 className="text-[var(--color-primary-dark)]" size={28} />
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">{t('sec2_title')}</h2>
          </div>
          <p className="text-[var(--color-text-muted)] mb-6">
            {t('sec2_desc')}
          </p>

          <div className="flex justify-between h-64 gap-2 px-2">
             {trafficData.map((d) => (
                 <div key={d.month} className="flex flex-col items-center flex-1 gap-2 group h-full">
                     <div className="w-full bg-gray-200 dark:bg-white/10 rounded-t-lg relative flex-1 flex items-end overflow-hidden">
                         <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${d.val}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className={`w-full ${d.color} opacity-80 group-hover:opacity-100 transition-opacity rounded-t-md`}
                         />
                     </div>
                     <span className="text-[10px] font-bold uppercase">{d.month}</span>
                 </div>
             ))}
          </div>
        </section>

        {/* SECTION 3: CALENDRIER */}
        <section className="bg-[var(--color-surface)] rounded-[25px] p-6 shadow-md border-t-4 border-[var(--color-secondary)]">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-[var(--color-secondary)]" size={28} />
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">{t('sec3_title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {calendarData.map((month) => (
                 <div key={month.m} className={`bg-[var(--color-bg)] p-4 rounded-[15px] border-l-4 ${month.color} hover:shadow-md transition-shadow`}>
                     <div className="flex justify-between items-center mb-2">
                         <h4 className="font-bold text-lg">{month.m}</h4>
                         <span className="text-[10px] font-bold px-2 py-1 bg-[var(--color-surface)] rounded uppercase tracking-wider opacity-70">{month.t}</span>
                     </div>
                     <ul className="text-sm space-y-1 opacity-80">
                         {month.items.map((i: string) => (
                             <li key={i}>• {i}</li>
                         ))}
                     </ul>
                 </div>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
}
