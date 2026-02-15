// Stratégies de résolution de litiges basées sur "Aide Litiges Vinted pour Neuroatypiques.txt"

export interface LitigeStrategy {
  id: string;
  title: string;
  icon: string;
  description: string;
  context: string;
  tip: string;
  checklist: string[];
  chartData: number[]; // [Remboursement immédiat, Retour accepté, Litige gagné]
  chartLabels: string[];
  defaultTemplate: string;
}

export const strategies: Record<string, LitigeStrategy> = {
  snad: {
    id: 'snad',
    title: '"Non conforme"',
    icon: '🤔',
    description: 'Défaut, tache, trou, erreur de couleur...',
    context: "L'acheteur prétend que l'article ne correspond pas (Article L217-4). Sur Vinted, c'est à lui de prouver la non-conformité par des photos claires.",
    tip: "Conseil : Ne validez jamais le remboursement avant d'avoir vu les photos preuves ET d'avoir reçu l'article en retour.",
    checklist: [
      "Ne pas cliquer sur 'Rembourser' !",
      "Demander des photos du défaut sous la lumière du jour.",
      "Comparer avec mes photos originales.",
      "Si j'accepte le retour : attendre le numéro de suivi."
    ],
    chartData: [30, 50, 20],
    chartLabels: ["Remboursement immédiat (À éviter)", "Retour accepté", "Litige gagné"],
    defaultTemplate: "Bonjour. J'ai bien noté votre réclamation. L'article était conforme lors de l'envoi. Merci de fournir les photos prouvant la non-conformité."
  },
  mind: {
    id: 'mind',
    title: '"Ça ne va pas"',
    icon: '👕',
    description: 'Taille, avis, style...',
    context: "L'acheteur n'aime pas l'article ou la taille ne va pas. Ce n'est PAS un motif de litige valable si l'annonce était correcte.",
    tip: "Vinted ne force pas les retours pour 'Changement d'avis'. Vous êtes en position de force.",
    checklist: [
      "Vérifier que la taille indiquée est la bonne.",
      "Faire capture d'écran de ma description.",
      "Refuser poliment mais fermement le retour.",
      "Suggérer la remise en vente."
    ],
    chartData: [5, 15, 80],
    chartLabels: ["Remboursement forcé", "Accord amiable", "Gain de cause (Refus)"],
    defaultTemplate: "Bonjour. La taille indiquée dans l'annonce est conforme. Le motif 'taille ne va pas' ne permet pas d'ouvrir un litige. Je ne peux donc pas accepter le retour."
  },
  damage: {
    id: 'damage',
    title: '"Arrivé cassé"',
    icon: '📦',
    description: 'Colis abîmé transport.',
    context: "L'article est arrivé cassé. C'est un problème de transport. Votre responsabilité dépend de la qualité de votre emballage.",
    tip: "Ne vous blâmez pas. Si vous avez bien emballé, c'est au transporteur de payer.",
    checklist: [
      "Demander photo du carton extérieur.",
      "Demander photo du calage intérieur.",
      "Signaler à Vinted 'Avarie de transport'.",
      "Ne pas clore le litige."
    ],
    chartData: [60, 20, 20],
    chartLabels: ["Indemnisé transporteur", "Perte vendeur", "Remboursement acheteur"],
    defaultTemplate: "Bonjour. Il semble s'agir d'une avarie de transport. Merci de transmettre les photos de l'emballage et de l'objet pour la réclamation transporteur."
  },
  fake: {
    id: 'fake',
    title: '"Contrefaçon"',
    icon: '⚠️',
    description: "Accusation d'authenticité.",
    context: "Accusation de contrefaçon. DANGER : L'acheteur peut être remboursé SANS renvoyer l'article s'il prouve que c'est faux.",
    tip: "Agissez vite. Fournissez vos factures ou preuves d'achat immédiatement.",
    checklist: [
      "Retrouver facture ou preuve d'achat.",
      "Prendre en photo les détails d'authenticité.",
      "Transmettre au support.",
      "Rester très formel."
    ],
    chartData: [10, 40, 50],
    chartLabels: ["Perte sèche", "Retour autorisé", "Gain (Authenticité validée)"],
    defaultTemplate: "Bonjour. Je conteste formellement cette accusation. L'article est authentique. Je transmets les preuves d'authenticité au support Vinted immédiatement."
  },
  lost: {
    id: 'lost',
    title: '"Colis Perdu"',
    icon: '📪',
    description: "Suivi bloqué ou 'Livré' mais rien.",
    context: "Angoisse élevée due à l'incertitude. Délais longs (jusqu'à 21 jours pour enquête).",
    tip: "Ne paniquez pas. Si le colis est perdu par le transporteur, vous serez remboursé (jusqu'à 25€ sans assurance, plus avec).",
    checklist: [
      "Vérifier le suivi sur le site du transporteur (pas juste Vinted).",
      "Ouvrir une enquête transporteur.",
      "Prévenir l'acheteur qu'une enquête est en cours.",
      "Remplir le formulaire de perte Vinted."
    ],
    chartData: [80, 10, 10],
    chartLabels: ["Remboursé par Vinted", "Perte (si pas de preuve)", "Retrouvé"],
    defaultTemplate: "Bonjour. Je vois que le suivi est bloqué. J'ouvre immédiatement une enquête auprès du transporteur. Merci de patienter le temps de leur réponse."
  },
  scam: {
    id: 'scam',
    title: '"Arnaque"',
    icon: '🚫',
    description: "Demande email, PayPal, lien bizarre.",
    context: "Risque financier maximal. L'outil doit ordonner un arrêt immédiat de toute communication hors plateforme.",
    tip: "STOP ! Ne cliquez sur rien. Ne donnez jamais votre email ou numéro.",
    checklist: [
      "Ne PAS cliquer sur les liens.",
      "Ne PAS donner d'email.",
      "Signaler le profil à Vinted.",
      "Bloquer l'utilisateur."
    ],
    chartData: [100, 0, 0],
    chartLabels: ["Sécurité (si arrêt)", "Risque (si clic)", "-"],
    defaultTemplate: "Bonjour. Je ne communique que via la plateforme Vinted pour la sécurité de la transaction. Merci."
  }
};
