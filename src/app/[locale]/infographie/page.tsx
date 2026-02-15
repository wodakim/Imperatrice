'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, TrendingUp, BarChart2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InfographicPage() {
  const router = useRouter();
  const t = useTranslations('Dashboard'); // Reuse some keys or just hardcode for this specific content

  const weeklyData = [
    { day: 'Lundi', score: 45, color: 'bg-red-200' },
    { day: 'Mardi', score: 50, color: 'bg-orange-200' },
    { day: 'Mercredi', score: 65, color: 'bg-yellow-200' },
    { day: 'Jeudi', score: 60, color: 'bg-yellow-200' },
    { day: 'Vendredi', score: 70, color: 'bg-green-200' },
    { day: 'Samedi', score: 85, color: 'bg-green-300' },
    { day: 'Dimanche', score: 98, color: 'bg-green-500' },
  ];

  const trafficData = [
    { month: 'Jan', val: 80, color: 'bg-[var(--color-primary-dark)]' },
    { month: 'Fév', val: 70, color: 'bg-[var(--color-primary)]' },
    { month: 'Mar', val: 75, color: 'bg-[var(--color-primary)]' },
    { month: 'Avr', val: 80, color: 'bg-[var(--color-primary)]' },
    { month: 'Mai', val: 85, color: 'bg-[#FF6B6B]' },
    { month: 'Juin', val: 75, color: 'bg-[#FF6B6B]' },
    { month: 'Juil', val: 50, color: 'bg-gray-300' }, // Low
    { month: 'Août', val: 65, color: 'bg-[var(--color-secondary)]' },
    { month: 'Sep', val: 90, color: 'bg-[var(--color-primary-dark)]' },
    { month: 'Oct', val: 85, color: 'bg-[var(--color-primary-dark)]' },
    { month: 'Nov', val: 95, color: 'bg-[#FF6B6B]' }, // Peak
    { month: 'Déc', val: 80, color: 'bg-[var(--color-primary-dark)]' },
  ];

  return (
    <div className="animate-fade-in pb-20">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-bg)] transition-colors"
        >
          <ArrowLeft size={24} className="text-[var(--color-text-main)]" />
        </button>
        <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary-dark)]">
            Guide Stratégique 2026
            </h1>
            <p className="text-[var(--color-text-muted)]">
            Comprendre l'algorithme et la saisonnalité pour mieux vendre.
            </p>
        </div>
      </div>

      <div className="grid gap-8">

        {/* SECTION 1: TIMING */}
        <section className="bg-[var(--color-surface)] rounded-[25px] p-6 shadow-md border-t-4 border-[#FF6B6B]">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-[#FF6B6B]" size={28} />
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">1. La Semaine Type : Quand Poster ?</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                    L'algorithme favorise la nouveauté. Postez quand les acheteurs sont connectés.
                    Le <strong>Dimanche Soir (18h-22h)</strong> est le moment roi.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-[var(--color-primary-dark)]">
                    <h4 className="font-bold text-[var(--color-primary-dark)] mb-1">🔥 Le Prime Time</h4>
                    <p className="text-sm">Dimanche 18h - 22h. C'est là que tout se joue.</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-l-4 border-[#FF6B6B]">
                    <h4 className="font-bold text-[#FF6B6B] mb-1">⚠️ À Éviter</h4>
                    <p className="text-sm">Lundi matin et les après-midis en semaine.</p>
                </div>
            </div>

            {/* Simple Bar Chart for Week */}
            <div className="flex flex-col justify-between h-64 gap-2">
                {weeklyData.map((d) => (
                    <div key={d.day} className="flex items-center gap-2">
                        <span className="w-20 text-xs font-bold text-right">{d.day}</span>
                        <div className="flex-1 h-6 bg-[var(--color-bg)] rounded-full overflow-hidden relative">
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
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">2. Les Pics de Trafic 2026</h2>
          </div>
          <p className="text-[var(--color-text-muted)] mb-6">
            Optimisez vos boosts ! Ne boostez pas en Juillet (creux), gardez votre budget pour Novembre (pic).
          </p>

          <div className="flex items-end justify-between h-48 gap-2 px-2">
             {trafficData.map((d) => (
                 <div key={d.month} className="flex flex-col items-center flex-1 gap-2 group">
                     <div className="w-full bg-[var(--color-bg)] rounded-t-lg relative flex-1 flex items-end overflow-hidden">
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
            <h2 className="text-xl font-bold text-[var(--color-text-main)]">3. Calendrier Stratégique</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {[
                 { m: 'Janvier', t: 'Grand Froid', color: 'border-blue-500', items: ['Manteaux lourds', 'Ski', 'Cadeaux reçus'] },
                 { m: 'Février', t: 'Fin Hiver', color: 'border-blue-500', items: ['Gros pulls', 'Bottes fourrées', 'St Valentin'] },
                 { m: 'Mars', t: 'Renouveau', color: 'border-teal-400', items: ['Trenchs', 'Sneakers', 'Blouses'] },
                 { m: 'Avril', t: 'Pré-Été', color: 'border-teal-500', items: ['Robes printemps', 'T-shirts', 'Mariage'] },
                 { m: 'Mai', t: 'Plein Soleil', color: 'border-red-400', items: ['Maillots', 'Sandales', 'Shorts'] },
                 { m: 'Juin', t: 'Festivals', color: 'border-red-500', items: ['Lunettes', 'Robes Maxi', 'Camping'] },
                 { m: 'Juillet', t: 'Soldes / Creux', color: 'border-yellow-500', items: ['Lots petits prix', 'Vide-Dressing'] },
                 { m: 'Août', t: 'Rentrée', color: 'border-indigo-500', items: ['Cartables', 'Jeans', 'Baskets'] },
                 { m: 'Septembre', t: 'Automne', color: 'border-indigo-600', items: ['Blazers', 'Bottines', 'Pulls légers'] },
                 { m: 'Octobre', t: 'Cozy Season', color: 'border-blue-700', items: ['Laine', 'Parkas', 'Halloween'] },
                 { m: 'Novembre', t: 'Black Friday', color: 'border-gray-800', items: ['Luxe / Marque', 'Jouets', 'Coffrets'] },
                 { m: 'Décembre', t: 'Fêtes', color: 'border-yellow-400', items: ['Paillettes', 'Accessoires', 'Cadeaux'] },
             ].map((month) => (
                 <div key={month.m} className={`bg-[var(--color-bg)] p-4 rounded-[15px] border-l-4 ${month.color} hover:shadow-md transition-shadow`}>
                     <div className="flex justify-between items-center mb-2">
                         <h4 className="font-bold text-lg">{month.m}</h4>
                         <span className="text-[10px] font-bold px-2 py-1 bg-[var(--color-surface)] rounded uppercase tracking-wider opacity-70">{month.t}</span>
                     </div>
                     <ul className="text-sm space-y-1 opacity-80">
                         {month.items.map(i => (
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
