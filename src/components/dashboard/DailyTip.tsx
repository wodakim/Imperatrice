export default function DailyTip() {
  const tips = [
    "Ne baisse jamais le prix de plus de 10% d'un coup.",
    "Un emballage soigné (papier de soie) fidélise à 100%.",
    "Réponds toujours, même pour dire non.",
    "Poste tes articles par grappes de 3 ou 5.",
    "Reliste tes articles invendus depuis 3 semaines.",
    "La politesse est ton arme fatale.",
    "Utilise la lumière naturelle, toujours.",
    "L'algorithme adore la régularité.",
    "Tes photos sont ta vitrine."
  ];

  const day = new Date().getDate();
  const tip = tips[day % tips.length];

  return (
    <div className="relative transform -rotate-1 hover:rotate-0 transition-transform duration-300 max-w-sm mx-auto mt-6">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ff6b6b] shadow-md z-10 border border-white/20"></div>
      <div className="bg-[#fff740] p-6 pt-8 shadow-lg rounded-sm text-[#333] font-caveat text-xl leading-relaxed relative">
        <h3 className="font-bold border-b-2 border-[#d4a017] border-dashed pb-2 mb-4 text-[#d4a017] text-2xl">
          ✨ Conseil du Jour
        </h3>
        <p>"{tip}"</p>
      </div>
    </div>
  );
}
