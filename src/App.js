import { useState } from "react";

const C = {
  bg: '#f8f9fb', surface: '#ffffff', border: '#e5e7eb', border2: '#d1d5db',
  text: '#111827', textSub: '#6b7280', textMuted: '#9ca3af', accent: '#111827',
  green: '#16a34a', greenBg: '#f0fdf4', red: '#dc2626', redBg: '#fef2f2',
  yellow: '#d97706', yellowBg: '#fffbeb',
};

const st = {
  page: { background: C.bg, minHeight: '100vh', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: C.text },
  header: { background: C.surface, borderBottom: `1px solid ${C.border}`, height: '60px', display: 'flex', alignItems: 'center', padding: '0 32px', gap: '12px', position: 'sticky', top: 0, zIndex: 100 },
  logo: { width: '28px', height: '28px', background: C.accent, borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: '700' },
  content: { maxWidth: '820px', margin: '0 auto', padding: '32px 32px 64px' },
  card: { background: C.surface, borderRadius: '10px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '22px 24px', marginBottom: '16px' },
  secTitle: { fontSize: '11px', fontWeight: '600', color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px', marginTop: '20px', paddingBottom: '8px', borderBottom: `1px solid ${C.border}` },
  g2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  g3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' },
  g4: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' },
  fg: { display: 'flex', flexDirection: 'column', gap: '5px' },
  lbl: { fontSize: '11px', fontWeight: '500', color: C.textMuted },
  inp: { background: C.surface, border: `1px solid ${C.border2}`, borderRadius: '7px', padding: '9px 12px', fontSize: '13px', color: C.text, outline: 'none', width: '100%', boxSizing: 'border-box' },
  sel: { background: C.surface, border: `1px solid ${C.border2}`, borderRadius: '7px', padding: '9px 12px', fontSize: '13px', color: C.text, outline: 'none', width: '100%', boxSizing: 'border-box' },
  badge: (type) => {
    const m = { applicant: { bg: C.accent, color: '#fff' }, guarantor: { bg: C.yellowBg, color: C.yellow } };
    const b = m[type] || m.applicant;
    return { display: 'inline-flex', alignItems: 'center', background: b.bg, color: b.color, borderRadius: '5px', padding: '2px 8px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' };
  },
  removeBtn: { background: C.redBg, color: C.red, border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' },
  addBtn: (bColor = C.border2, tColor = C.textSub) => ({ background: C.surface, border: `1px dashed ${bColor}`, borderRadius: '8px', padding: '12px 20px', fontSize: '13px', fontWeight: '500', color: tColor, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }),
  submitBtn: { background: C.accent, color: '#fff', border: 'none', borderRadius: '7px', padding: '10px 20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
};

const emptyPerson = () => ({
  id: Date.now() + Math.random(),
  prenom: '', nom: '', dateNaissance: '', nas: '', telephone: '', courriel: '',
  adresseActuelle: '', villeActuelle: '', codePostalActuel: '', periodeActuelleDebut: '', periodeActuelleFin: '',
  loyerActuel: '', chauffeActuel: false, eclaireActuel: false,
  proprio1Prenom: '', proprio1Nom: '', proprio1Tel: '',
  adressePrecedente: '', villePrecedente: '', codePostalPrecedent: '',
  periodePrecedenteDebut: '', periodePrecedenteFin: '', loyerPrecedent: '',
  chauffePrec: false, eclairePrec: false,
  proprio2Prenom: '', proprio2Nom: '', proprio2Tel: '',
  entreprise1: '', poste1: '', superieur1: '', tel1: '', posteNum1: '', revenu1: '', tauxHoraire1: '', statut1: '', depuis1: '', heures1: '',
  entreprise2: '', poste2: '', superieur2: '', tel2: '', posteNum2: '', revenu2: '', tauxHoraire2: '', statut2: '', depuis2: '', heures2: '',
  dettesEnergie: '',
});

// ─── PDF GENERATION : REPRODUIT FIDÈLEMENT LE FORMULAIRE CORPIQ ──────────────
// Coordonnées PDF : 1 point = 1/72 pouce. Letter = 612 x 792 pts.
// Les coordonnées ci-dessous sont extraites directement du PDF original.

async function loadJsPDF() {
  if (window.jspdf) return;
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

function generateCORPIQPage1(doc, data, membre = '') {
  // PDF coords: x from left, y from top (jsPDF uses top-left origin with y increasing down)
  // Original PDF: 612 x 792 pts. We work in pts directly.
  const { logement, person, joursSignature, depot } = data;
  const today = new Date().toLocaleDateString('fr-CA');

  // Helper: draw underline input field
  const line = (x0, y, x1) => {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(x0, y, x1, y);
  };

  const txt = (str, x, y, size = 9, bold = false) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(String(str || ''), x, y);
  };

  const smallTxt = (label, x, y) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(label, x, y);
  };

  const val = (str, x, y, size = 9) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 80);
    doc.text(String(str || ''), x, y);
  };

  const checkbox = (x, y, checked) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(x, y - 4, 5, 5);
    if (checked) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('X', x + 0.8, y);
    }
  };

  // ── TITLE ──
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Demande de location', 216, 43);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('[un formulaire par personne]', 233, 57);

  // Nom du membre / No
  doc.setFontSize(8);
  doc.text('Nom du membre :', 255, 100);
  val(membre, 330, 100, 8);
  doc.text('No :', 494, 98);
  line(334, 107, 490);
  line(500, 107, 577);

  // ── SECTION: LOGEMENT À LOUER ──
  // Section label with rect background
  doc.setFillColor(220, 220, 220);
  doc.rect(35, 96, 98, 16, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Logement à louer', 42, 107);

  // Adresse field
  smallTxt('Adresse', 50, 114);
  line(92, 128, 574);
  val(logement.adresse + (logement.appartement ? ', App. ' + logement.appartement : ''), 93, 126, 9);

  // Ville, N° app, Code postal, Loyer, Bail
  smallTxt('Ville', 49, 135);
  line(92, 148, 276);
  val(logement.ville, 93, 146, 9);

  smallTxt('N° appartement', 49, 157);
  line(92, 171, 135);

  smallTxt('Code postal', 232, 157);
  line(260, 171, 402);

  smallTxt('Loyer', 430, 157);
  smallTxt('$ par mois', 528, 157);
  line(457, 171, 526);

  smallTxt('Bail du', 50, 178);
  line(92, 192, 208);
  val(logement.bailDebut || '', 93, 190, 9);
  txt('au', 247, 192, 8);
  line(262, 192, 378);
  val(logement.bailFin || '', 263, 190, 9);

  smallTxt('Chauffé', 472, 178);
  checkbox(471, 190, false);
  smallTxt('Éclairé', 534, 178);
  checkbox(533, 190, false);

  // ── SECTION: CANDIDAT LOCATAIRE ──
  doc.setFillColor(220, 220, 220);
  doc.rect(36, 207, 98, 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Candidat locataire', 42, 219);

  // Prénom
  smallTxt('Prénom', 50, 229);
  line(120, 243, 575);
  val(person.prenom, 121, 241, 9);

  // Nom
  smallTxt('Nom', 50, 251);
  line(120, 265, 575);
  val(person.nom, 121, 263, 9);

  // Date de naissance, Téléphone
  smallTxt('Date de naissance', 50, 272);
  line(120, 286, 320);
  val(person.dateNaissance, 121, 284, 9);
  smallTxt('Téléphone', 347, 272);
  line(391, 286, 575);
  val(person.telephone, 392, 284, 9);

  // Courriel
  smallTxt('Courriel', 50, 294);
  line(120, 308, 575);
  val(person.courriel, 121, 306, 9);

  // NAS + renseignement supplémentaire
  smallTxt('Renseignement supplémentaire (optionnel) - Ce renseignement est', 51, 322);
  smallTxt('Renseignement nécessaire', 320, 326);
  smallTxt('Il ne constitue pas un motif de refus s\'il est manquant.', 51, 338);
  smallTxt('Devez-vous de l\'argent à un fournisseur d\'électricité, de gaz naturel,', 320, 336);
  smallTxt('NAS', 50, 351);
  line(79, 368, 236);
  val(person.nas || '', 80, 366, 9);
  smallTxt('de mazout ou de chauffe-eau en location ?', 320, 347);
  txt('Oui', 489, 362, 9);
  checkbox(482, 362, person.dettesEnergie === 'oui');
  txt('Non', 528, 362, 9);
  checkbox(521, 362, person.dettesEnergie === 'non');

  // ── ADRESSE ACTUELLE ──
  doc.setFillColor(220, 220, 220);
  doc.rect(65, 391, 97, 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Adresse actuelle', 76, 403);

  smallTxt('Adresse', 50, 409);
  line(121, 422, 560);
  val(person.adresseActuelle, 122, 420, 9);

  smallTxt('Ville', 50, 429);
  line(121, 443, 560);
  val(person.villeActuelle, 122, 441, 9);

  smallTxt('Code postal obligatoire', 56, 450);
  line(121, 463, 290);
  val(person.codePostalActuel, 122, 461, 9);
  smallTxt('Loyer', 291, 450);
  smallTxt('$ par mois', 389, 450);
  line(317, 463, 387);
  val(person.loyerActuel ? person.loyerActuel : '', 318, 461, 9);
  smallTxt('Chauffé', 472, 450);
  checkbox(471, 463, person.chauffeActuel);
  smallTxt('Éclairé', 534, 450);
  checkbox(533, 463, person.eclaireActuel);

  smallTxt('Période d\'occupation', 49, 472);
  txt('du', 176, 486, 8);
  line(195, 492, 320);
  val(person.periodeActuelleDebut, 196, 490, 8);
  txt('au', 346, 486, 8);
  line(370, 492, 495);
  val(person.periodeActuelleFin, 371, 490, 8);

  // Propriétaire actuel
  doc.setFillColor(220, 220, 220);
  doc.rect(65, 496, 96, 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Propriétaire actuel', 73, 507);

  smallTxt('Prénom, nom', 50, 519);
  line(121, 532, 560);
  val(`${person.proprio1Prenom} ${person.proprio1Nom}`.trim(), 122, 530, 9);

  smallTxt('Téléphone', 50, 539);
  line(121, 552, 560);
  val(person.proprio1Tel, 122, 550, 9);

  // ── ADRESSE PRÉCÉDENTE ──
  doc.setFillColor(220, 220, 220);
  doc.rect(65, 570, 109, 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Adresse précédente', 74, 581);

  smallTxt('Adresse', 51, 587);
  line(121, 601, 560);
  val(person.adressePrecedente, 122, 599, 9);

  smallTxt('Ville', 51, 607);
  line(121, 621, 560);
  val(person.villePrecedente, 122, 619, 9);

  smallTxt('Code postal obligatoire', 56, 628);
  line(121, 641, 291);
  val(person.codePostalPrecedent, 122, 639, 9);
  smallTxt('Loyer', 291, 628);
  smallTxt('$ par mois', 390, 628);
  line(318, 641, 388);
  val(person.loyerPrecedent ? person.loyerPrecedent : '', 319, 639, 9);
  smallTxt('Chauffé', 472, 628);
  checkbox(471, 641, person.chauffePrec);
  smallTxt('Éclairé', 534, 628);
  checkbox(533, 641, person.eclairePrec);

  smallTxt('Période d\'occupation', 49, 651);
  txt('du', 176, 665, 8);
  line(195, 672, 320);
  val(person.periodePrecedenteDebut, 196, 670, 8);
  txt('au', 346, 665, 8);
  line(370, 672, 495);
  val(person.periodePrecedenteFin, 371, 670, 8);

  // Propriétaire précédent
  doc.setFillColor(220, 220, 220);
  doc.rect(64, 679, 110, 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Propriétaire précédent', 68, 690);

  smallTxt('Prénom, nom', 50, 697);
  line(121, 712, 560);
  val(`${person.proprio2Prenom} ${person.proprio2Nom}`.trim(), 122, 710, 9);

  smallTxt('Téléphone', 49, 719);
  line(121, 732, 560);
  val(person.proprio2Tel, 122, 730, 9);

  // Page number + "Signature obligatoire en page suivante"
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text('Signature obligatoire en page suivante', 321, 750);
  doc.text('Page 1 de 2', 543, 762);

  // Vertical watermark "2016-04-28"
  doc.setFontSize(6);
  doc.setTextColor(150);
  doc.text('2016-04-28', 578, 745, { angle: 90 });
}

function generateCORPIQPage2(doc, data) {
  const { person, joursSignature, depot } = data;
  const today = new Date().toLocaleDateString('fr-CA');

  const line = (x0, y, x1) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(x0, y, x1, y);
  };
  const txt = (str, x, y, size = 9, bold = false) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(0);
    doc.text(String(str || ''), x, y);
  };
  const smallTxt = (label, x, y) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(label, x, y);
  };
  const val = (str, x, y, size = 9) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 80);
    doc.text(String(str || ''), x, y);
  };
  const checkbox = (x, y, checked) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(x, y - 4, 5, 5);
    if (checked) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('X', x + 0.8, y);
    }
  };

  // ── EMPLOYEUR 1 ──
  doc.setFillColor(220, 220, 220);
  doc.rect(64, 36, 71, 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Employeur 1', 71, 48);

  smallTxt('Entreprise', 49, 56);
  line(121, 70, 560);
  val(person.entreprise1, 122, 68, 9);

  smallTxt('Téléphone', 50, 78);
  line(121, 94, 345);
  val(person.tel1, 122, 92, 9);
  smallTxt('Poste', 349, 80);
  line(370, 94, 560);
  val(person.posteNum1, 371, 92, 9);

  smallTxt('Poste occupé', 49, 121);
  line(121, 135, 560);
  val(person.poste1, 122, 133, 9);

  smallTxt('Nom du supérieur', 49, 143);
  line(121, 157, 560);
  val(person.superieur1, 122, 155, 9);

  smallTxt('Revenu annuel', 49, 164);
  txt('$', 239, 165, 8);
  line(149, 179, 238);
  val(person.revenu1 ? person.revenu1 : '', 150, 177, 9);
  txt('ou taux horaire', 295, 165, 8);
  txt('$', 440, 165, 8);
  txt('de l\'heure', 448, 165, 8);
  line(375, 179, 437);
  val(person.tauxHoraire1 ? person.tauxHoraire1 : '', 376, 177, 9);

  smallTxt('Statut de l\'emploi', 49, 187);
  checkbox(182, 199, person.statut1 === 'temps plein');
  txt('temps plein', 189, 198, 8);
  checkbox(261, 199, person.statut1 === 'temps partiel');
  txt('temps partiel', 268, 198, 8);
  checkbox(388, 199, person.statut1 === 'permanent');
  txt('permanent', 395, 198, 8);
  checkbox(472, 199, person.statut1 === 'contractuel');
  txt('contractuel', 479, 199, 8);

  smallTxt('À l\'emploi depuis', 49, 207);
  line(149, 221, 291);
  val(person.depuis1, 150, 219, 8);

  smallTxt('Nombre d\'heures par semaine', 326, 207);
  line(476, 221, 504);
  val(person.heures1, 477, 219, 8);

  // Adresse (page 2 top section - from PDF data)
  smallTxt('Adresse', 50, 99);
  line(121, 113, 560);

  // ── EMPLOYEUR 2 ──
  doc.setFillColor(220, 220, 220);
  doc.rect(64, 247, 68, 15, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Employeur 2', 71, 258);

  smallTxt('Entreprise', 49, 272);
  line(121, 286, 560);
  val(person.entreprise2, 122, 284, 9);

  smallTxt('Téléphone', 49, 295);
  line(121, 309, 345);
  val(person.tel2, 122, 307, 9);
  smallTxt('Poste', 351, 294);
  line(373, 309, 560);
  val(person.posteNum2, 374, 307, 9);

  smallTxt('Poste occupé', 49, 337);
  line(121, 351, 560);
  val(person.poste2, 122, 349, 9);

  smallTxt('Nom du supérieur', 49, 359);
  line(121, 373, 560);
  val(person.superieur2, 122, 371, 9);

  smallTxt('Revenu annuel', 49, 380);
  txt('$', 239, 381, 8);
  line(149, 395, 238);
  val(person.revenu2 ? person.revenu2 : '', 150, 393, 9);
  txt('ou taux horaire', 295, 381, 8);
  txt('$', 440, 381, 8);
  txt('de l\'heure', 448, 381, 8);
  line(375, 395, 437);
  val(person.tauxHoraire2 ? person.tauxHoraire2 : '', 376, 393, 9);

  smallTxt('Statut de l\'emploi', 49, 402);
  checkbox(182, 415, person.statut2 === 'temps plein');
  txt('temps plein', 189, 414, 8);
  checkbox(261, 415, person.statut2 === 'temps partiel');
  txt('temps partiel', 268, 414, 8);
  checkbox(388, 415, person.statut2 === 'permanent');
  txt('permanent', 395, 414, 8);
  checkbox(472, 415, person.statut2 === 'contractuel');
  txt('contractuel', 479, 415, 8);

  smallTxt('À l\'emploi depuis', 49, 424);
  line(149, 437, 291);
  val(person.depuis2, 150, 435, 8);
  smallTxt('Nombre d\'heures par semaine', 329, 424);
  line(476, 437, 504);
  val(person.heures2, 477, 435, 8);

  smallTxt('Adresse', 51, 316);
  line(121, 330, 560);

  // ── CONSENTEMENT ──
  const consentLines = [
    "J'atteste que ces informations sont complètes et véridiques et que je n'ai en aucune façon travesti, falsifié ou omis des faits qui",
    "pourraient invalider ce formulaire ou influencer la décision du locateur. Je suis avisé qu'une fausse déclaration peut entraîner",
    "l'annulation du bail et constituer une fraude en vertu du Code criminel. J'autorise le locateur et ses représentants à obtenir ou",
    "échanger des renseignements personnels avec tout agent de renseignements personnels, institutions financières, employeurs,",
    "propriétaires ou autres institutions et personnes ci-haut mentionnés aux fins d'établir ma solvabilité et ma capacité à respecter les",
    "obligations du bail. J'autorise la CORPIQ, à titre d'agent de renseignements personnels, à recueillir et à communiquer au locateur",
    "ou à son représentant tout renseignement personnel, incluant ceux qu'elle détiendrait déjà sur moi en vertu d'un consentement",
    "antérieur. Ce présent consentement à la cueillette et à la communication de renseignements personnels est valide durant 14 jours",
    "civils à compter de la date de signature. Si un bail est signé, le consentement demeure valide jusqu'à trois ans après l'échéance",
    "de ce bail uniquement aux fins de recouvrement d'un loyer ou, si un jugement a été rendu par le tribunal, pour recouvrer toute",
    "autre créance relative au bail.",
  ];

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  let cy = 465;
  for (const l of consentLines) {
    doc.text(l, 36, cy);
    cy += 12;
  }

  // Je m'engage ligne
  const joursVal = joursSignature || '_____';
  doc.setFontSize(8.5);
  doc.text(`Je m'engage à signer un bail au plus tard le ${joursVal}e jour après avoir été informé(e) que ma demande de location a été acceptée.`, 36, cy + 15);
  cy += 15;

  // Dépôt ligne
  const depotVal = depot || '__________';
  cy += 25;
  doc.text(`Un dépôt de ${depotVal}$ servant à couvrir les frais d'enquête a été remis et sera conservé par le locateur uniquement si je`, 36, cy);
  cy += 12;
  doc.text("refuse de signer un bail après avoir été informé(e) que ma demande est acceptée. Le locateur se réserve ses recours pour tout", 36, cy);
  cy += 12;
  doc.text("autre dommage subi advenant mon refus de signer un bail.", 36, cy);

  cy += 25;
  doc.text("Le candidat locataire et sa caution doivent montrer une pièce d'identité fiable avec photo.", 36, cy);

  // Signature section
  cy = 737;
  doc.setFontSize(8.5);
  doc.text('Signature en qualité de', 37, cy);
  doc.setFontSize(8);
  doc.text('(ne cochez qu\'une seule case) :', 143, cy + 1);
  txt('Candidat locataire', 289, cy, 8.5);
  checkbox(280, cy, false);
  txt('Caution', 403, cy, 8.5);
  checkbox(394, cy, false);
  txt('Date', 480, cy, 8.5);

  // Signature lines
  line(36, 731, 253);
  val(today, 37, 728, 8);
  line(482, 731, 557);
  val(today, 483, 728, 8);

  // Page 2 de 2
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  doc.text('Page 2 de 2', 539, 759);

  // Vertical watermark
  doc.setFontSize(6);
  doc.setTextColor(150);
  doc.text('2016-04-28', 578, 745, { angle: 90 });
}

async function generatePDF(logement, applicants, guarantors, joursSignature, depot) {
  await loadJsPDF();
  const { jsPDF } = window.jspdf;

  // One 2-page PDF per applicant/guarantor (as per CORPIQ: "un formulaire par personne")
  // We generate all persons in one multi-page PDF for convenience
  const allPersons = [
    ...applicants.map(p => ({ ...p, role: 'Candidat locataire' })),
    ...guarantors.map(p => ({ ...p, role: 'Caution' })),
  ];

  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });

  allPersons.forEach((person, idx) => {
    if (idx > 0) doc.addPage();
    const data = { logement, person, joursSignature, depot };
    generateCORPIQPage1(doc, data);
    doc.addPage();
    generateCORPIQPage2(doc, data);
  });

  const today = new Date().toLocaleDateString('fr-CA').replace(/\//g, '-');
  const name = (allPersons[0]?.nom || 'candidat').toLowerCase().replace(/\s+/g, '_');
  doc.save(`demande_location_CORPIQ_${name}_${today}.pdf`);
}

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────

function Field({ label, required, children, style }) {
  return (
    <div style={{ ...st.fg, ...style }}>
      <label style={st.lbl}>{label}{required && <span style={{ color: C.red }}> *</span>}</label>
      {children}
    </div>
  );
}

function PersonSection({ person, onChange, onRemove, type, index }) {
  const up = (k, v) => onChange({ ...person, [k]: v });
  const [collapsed, setCollapsed] = useState(false);
  const roleLabel = type === 'guarantor' ? 'Garant / Caution' : 'Appliquant';
  const displayName = `${person.prenom} ${person.nom}`.trim() || `${roleLabel} ${index + 1}`;

  return (
    <div style={st.card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: collapsed ? 0 : '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
          <span style={st.badge(type)}>{roleLabel}</span>
          <span>{displayName}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ ...st.removeBtn, background: C.bg, color: C.textSub }} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '▼ Ouvrir' : '▲ Réduire'}
          </button>
          {onRemove && <button style={st.removeBtn} onClick={onRemove}>✕</button>}
        </div>
      </div>

      {!collapsed && <>
        <div style={st.secTitle}>Informations personnelles</div>
        <div style={{ ...st.g2, marginBottom: '14px' }}>
          <Field label="Prénom" required><input style={st.inp} value={person.prenom} onChange={e => up('prenom', e.target.value)} /></Field>
          <Field label="Nom" required><input style={st.inp} value={person.nom} onChange={e => up('nom', e.target.value)} /></Field>
        </div>
        <div style={{ ...st.g3, marginBottom: '14px' }}>
          <Field label="Date de naissance" required><input style={st.inp} type="date" value={person.dateNaissance} onChange={e => up('dateNaissance', e.target.value)} /></Field>
          <Field label="NAS (optionnel)"><input style={st.inp} value={person.nas} onChange={e => up('nas', e.target.value)} placeholder="000-000-000" /></Field>
          <Field label="Téléphone" required><input style={st.inp} value={person.telephone} onChange={e => up('telephone', e.target.value)} placeholder="(514) 000-0000" /></Field>
        </div>
        <Field label="Courriel" required style={{ marginBottom: '14px' }}>
          <input style={st.inp} type="email" value={person.courriel} onChange={e => up('courriel', e.target.value)} placeholder="prenom@exemple.com" />
        </Field>

        <div style={st.secTitle}>Adresse actuelle</div>
        <Field label="Adresse" required style={{ marginBottom: '14px' }}>
          <input style={st.inp} value={person.adresseActuelle} onChange={e => up('adresseActuelle', e.target.value)} placeholder="123 Rue Exemple, App. 4" />
        </Field>
        <div style={{ ...st.g3, marginBottom: '14px' }}>
          <Field label="Ville" required><input style={st.inp} value={person.villeActuelle} onChange={e => up('villeActuelle', e.target.value)} /></Field>
          <Field label="Code postal obligatoire" required><input style={st.inp} value={person.codePostalActuel} onChange={e => up('codePostalActuel', e.target.value)} placeholder="H1A 1A1" /></Field>
          <Field label="Loyer mensuel ($)"><input style={st.inp} type="number" value={person.loyerActuel} onChange={e => up('loyerActuel', e.target.value)} /></Field>
        </div>
        <div style={{ ...st.g2, marginBottom: '14px' }}>
          <Field label="Période d'occupation — début"><input style={st.inp} type="date" value={person.periodeActuelleDebut} onChange={e => up('periodeActuelleDebut', e.target.value)} /></Field>
          <Field label="Période d'occupation — fin"><input style={st.inp} type="date" value={person.periodeActuelleFin} onChange={e => up('periodeActuelleFin', e.target.value)} /></Field>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={person.chauffeActuel} onChange={e => up('chauffeActuel', e.target.checked)} /> Chauffé
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={person.eclaireActuel} onChange={e => up('eclaireActuel', e.target.checked)} /> Éclairé
          </label>
        </div>

        <div style={st.secTitle}>Propriétaire actuel</div>
        <div style={{ ...st.g3, marginBottom: '20px' }}>
          <Field label="Prénom"><input style={st.inp} value={person.proprio1Prenom} onChange={e => up('proprio1Prenom', e.target.value)} /></Field>
          <Field label="Nom"><input style={st.inp} value={person.proprio1Nom} onChange={e => up('proprio1Nom', e.target.value)} /></Field>
          <Field label="Téléphone"><input style={st.inp} value={person.proprio1Tel} onChange={e => up('proprio1Tel', e.target.value)} /></Field>
        </div>

        <div style={st.secTitle}>Adresse précédente</div>
        <Field label="Adresse" style={{ marginBottom: '14px' }}>
          <input style={st.inp} value={person.adressePrecedente} onChange={e => up('adressePrecedente', e.target.value)} />
        </Field>
        <div style={{ ...st.g3, marginBottom: '14px' }}>
          <Field label="Ville"><input style={st.inp} value={person.villePrecedente} onChange={e => up('villePrecedente', e.target.value)} /></Field>
          <Field label="Code postal obligatoire"><input style={st.inp} value={person.codePostalPrecedent} onChange={e => up('codePostalPrecedent', e.target.value)} /></Field>
          <Field label="Loyer mensuel ($)"><input style={st.inp} type="number" value={person.loyerPrecedent} onChange={e => up('loyerPrecedent', e.target.value)} /></Field>
        </div>
        <div style={{ ...st.g2, marginBottom: '14px' }}>
          <Field label="Période — début"><input style={st.inp} type="date" value={person.periodePrecedenteDebut} onChange={e => up('periodePrecedenteDebut', e.target.value)} /></Field>
          <Field label="Période — fin"><input style={st.inp} type="date" value={person.periodePrecedenteFin} onChange={e => up('periodePrecedenteFin', e.target.value)} /></Field>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={person.chauffePrec} onChange={e => up('chauffePrec', e.target.checked)} /> Chauffé
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={person.eclairePrec} onChange={e => up('eclairePrec', e.target.checked)} /> Éclairé
          </label>
        </div>

        <div style={st.secTitle}>Propriétaire précédent</div>
        <div style={{ ...st.g3, marginBottom: '20px' }}>
          <Field label="Prénom"><input style={st.inp} value={person.proprio2Prenom} onChange={e => up('proprio2Prenom', e.target.value)} /></Field>
          <Field label="Nom"><input style={st.inp} value={person.proprio2Nom} onChange={e => up('proprio2Nom', e.target.value)} /></Field>
          <Field label="Téléphone"><input style={st.inp} value={person.proprio2Tel} onChange={e => up('proprio2Tel', e.target.value)} /></Field>
        </div>

        <div style={st.secTitle}>Emploi — Employeur 1</div>
        <div style={{ ...st.g2, marginBottom: '14px' }}>
          <Field label="Entreprise" required><input style={st.inp} value={person.entreprise1} onChange={e => up('entreprise1', e.target.value)} /></Field>
          <Field label="Poste occupé"><input style={st.inp} value={person.poste1} onChange={e => up('poste1', e.target.value)} /></Field>
        </div>
        <div style={{ ...st.g3, marginBottom: '14px' }}>
          <Field label="Téléphone employeur"><input style={st.inp} value={person.tel1} onChange={e => up('tel1', e.target.value)} /></Field>
          <Field label="Poste (numéro)"><input style={st.inp} value={person.posteNum1} onChange={e => up('posteNum1', e.target.value)} /></Field>
          <Field label="Nom du supérieur"><input style={st.inp} value={person.superieur1} onChange={e => up('superieur1', e.target.value)} /></Field>
        </div>
        <div style={{ ...st.g4, marginBottom: '14px' }}>
          <Field label="Revenu annuel ($)" required><input style={st.inp} type="number" value={person.revenu1} onChange={e => up('revenu1', e.target.value)} /></Field>
          <Field label="Taux horaire ($)"><input style={st.inp} type="number" value={person.tauxHoraire1} onChange={e => up('tauxHoraire1', e.target.value)} /></Field>
          <Field label="À l'emploi depuis"><input style={st.inp} type="date" value={person.depuis1} onChange={e => up('depuis1', e.target.value)} /></Field>
          <Field label="Heures / semaine"><input style={st.inp} type="number" value={person.heures1} onChange={e => up('heures1', e.target.value)} /></Field>
        </div>
        <Field label="Statut de l'emploi" style={{ marginBottom: '20px' }}>
          <select style={st.sel} value={person.statut1} onChange={e => up('statut1', e.target.value)}>
            <option value="">Sélectionner...</option>
            <option value="temps plein">Temps plein</option>
            <option value="temps partiel">Temps partiel</option>
            <option value="permanent">Permanent</option>
            <option value="contractuel">Contractuel</option>
          </select>
        </Field>

        <div style={st.secTitle}>Emploi — Employeur 2 (optionnel)</div>
        <div style={{ ...st.g2, marginBottom: '14px' }}>
          <Field label="Entreprise"><input style={st.inp} value={person.entreprise2} onChange={e => up('entreprise2', e.target.value)} /></Field>
          <Field label="Poste occupé"><input style={st.inp} value={person.poste2} onChange={e => up('poste2', e.target.value)} /></Field>
        </div>
        <div style={{ ...st.g3, marginBottom: '14px' }}>
          <Field label="Téléphone employeur"><input style={st.inp} value={person.tel2} onChange={e => up('tel2', e.target.value)} /></Field>
          <Field label="Poste (numéro)"><input style={st.inp} value={person.posteNum2} onChange={e => up('posteNum2', e.target.value)} /></Field>
          <Field label="Nom du supérieur"><input style={st.inp} value={person.superieur2} onChange={e => up('superieur2', e.target.value)} /></Field>
        </div>
        <div style={{ ...st.g4, marginBottom: '14px' }}>
          <Field label="Revenu annuel ($)"><input style={st.inp} type="number" value={person.revenu2} onChange={e => up('revenu2', e.target.value)} /></Field>
          <Field label="Taux horaire ($)"><input style={st.inp} type="number" value={person.tauxHoraire2} onChange={e => up('tauxHoraire2', e.target.value)} /></Field>
          <Field label="À l'emploi depuis"><input style={st.inp} type="date" value={person.depuis2} onChange={e => up('depuis2', e.target.value)} /></Field>
          <Field label="Heures / semaine"><input style={st.inp} type="number" value={person.heures2} onChange={e => up('heures2', e.target.value)} /></Field>
        </div>
        <Field label="Statut de l'emploi" style={{ marginBottom: '20px' }}>
          <select style={st.sel} value={person.statut2} onChange={e => up('statut2', e.target.value)}>
            <option value="">Sélectionner...</option>
            <option value="temps plein">Temps plein</option>
            <option value="temps partiel">Temps partiel</option>
            <option value="permanent">Permanent</option>
            <option value="contractuel">Contractuel</option>
          </select>
        </Field>

        <div style={st.secTitle}>Renseignements supplémentaires</div>
        <Field label="Devez-vous de l'argent à un fournisseur d'électricité, gaz naturel, mazout ou chauffe-eau en location?" required>
          <select style={st.sel} value={person.dettesEnergie} onChange={e => up('dettesEnergie', e.target.value)}>
            <option value="">Sélectionner...</option>
            <option value="non">Non</option>
            <option value="oui">Oui</option>
          </select>
        </Field>

        <div style={st.secTitle}>Documents à joindre</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '4px' }}>
          {["Pièce d'identité *", "Preuve de revenus *", "Formulaire CORPIQ signé *"].map(docLabel => (
            <label key={docLabel} style={{ border: `1px dashed ${C.border2}`, borderRadius: '8px', padding: '14px', textAlign: 'center', cursor: 'pointer', background: C.bg, display: 'block' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>📎</div>
              <div style={{ fontSize: '11px', color: C.textSub, fontWeight: '500' }}>{docLabel}</div>
              <div style={{ fontSize: '10px', color: C.textMuted, marginTop: '3px' }}>PDF · JPG · PNG</div>
              <input type="file" style={{ display: 'none' }} accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          ))}
        </div>
      </>}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function ApplicationLocative() {
  const [logement, setLogement] = useState({ adresse: '', ville: '', appartement: '', bailDebut: '', bailFin: '', dateDisponible: '' });
  const [applicants, setApplicants] = useState([emptyPerson()]);
  const [guarantors, setGuarantors] = useState([]);
  const [consent, setConsent] = useState(false);
  const [joursSignature, setJoursSignature] = useState('');
  const [depot, setDepot] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);

  const addApplicant = () => setApplicants(p => [...p, emptyPerson()]);
  const removeApplicant = id => setApplicants(p => p.filter(a => a.id !== id));
  const updateApplicant = (id, data) => setApplicants(p => p.map(a => a.id === id ? data : a));
  const addGuarantor = () => setGuarantors(p => [...p, emptyPerson()]);
  const removeGuarantor = id => setGuarantors(p => p.filter(g => g.id !== id));
  const updateGuarantor = (id, data) => setGuarantors(p => p.map(g => g.id === id ? data : g));

  const handleSubmit = async () => {
    const errs = [];
    if (!logement.adresse) errs.push("L'adresse du logement est requise.");
    applicants.forEach((a, i) => {
      if (!a.prenom || !a.nom) errs.push(`Appliquant ${i + 1} : prénom et nom requis.`);
      if (!a.courriel) errs.push(`Appliquant ${i + 1} : courriel requis.`);
      if (!a.entreprise1) errs.push(`Appliquant ${i + 1} : entreprise (Employeur 1) requise.`);
      if (!a.dettesEnergie) errs.push(`Appliquant ${i + 1} : réponse dettes énergie requise.`);
    });
    if (!consent) errs.push("Vous devez accepter les conditions.");
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setGenerating(true);
    try {
      await generatePDF(logement, applicants, guarantors, joursSignature, depot);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setErrors(['Erreur lors de la génération du PDF. Veuillez réessayer.']);
    }
    setGenerating(false);
  };

  const resetForm = () => {
    setSubmitted(false);
    setApplicants([emptyPerson()]);
    setGuarantors([]);
    setLogement({ adresse: '', ville: '', appartement: '', bailDebut: '', bailFin: '', dateDisponible: '' });
    setConsent(false); setJoursSignature(''); setDepot(''); setErrors([]);
  };

  if (submitted) {
    return (
      <div style={{ ...st.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '48px 40px', maxWidth: '460px', width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ width: '56px', height: '56px', background: C.greenBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>✅</div>
          <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '8px' }}>Formulaire CORPIQ généré!</div>
          <div style={{ fontSize: '13px', color: C.textSub, lineHeight: '1.7', marginBottom: '24px' }}>
            Le PDF au format officiel CORPIQ a été téléchargé. Il reproduit fidèlement la mise en page du formulaire original (2 pages par personne).
          </div>
          <div style={{ background: C.bg, borderRadius: '8px', padding: '14px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: C.textMuted, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>Résumé</div>
            <div style={{ fontSize: '13px', marginBottom: '4px' }}><strong>Logement :</strong> {logement.adresse}{logement.appartement ? `, App. ${logement.appartement}` : ''}, {logement.ville}</div>
            <div style={{ fontSize: '13px', marginBottom: '4px' }}><strong>Appliquants :</strong> {applicants.map(a => `${a.prenom} ${a.nom}`.trim()).join(', ')}</div>
            {guarantors.length > 0 && <div style={{ fontSize: '13px' }}><strong>Cautions :</strong> {guarantors.map(g => `${g.prenom} ${g.nom}`.trim()).join(', ')}</div>}
            <div style={{ fontSize: '11px', color: C.textMuted, marginTop: '8px' }}>
              {(applicants.length + guarantors.length) * 2} pages générées ({applicants.length + guarantors.length} formulaire{applicants.length + guarantors.length > 1 ? 's' : ''} × 2 pages)
            </div>
          </div>
          <button style={{ ...st.submitBtn, width: '100%', justifyContent: 'center' }} onClick={resetForm}>+ Nouvelle demande</button>
        </div>
      </div>
    );
  }

  return (
    <div style={st.page}>
      <header style={st.header}>
        <div style={st.logo}>M</div>
        <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.01em' }}>Mondev</span>
        <span style={{ color: C.border2, margin: '0 4px' }}>/</span>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>Demande de location</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.green }}></div>
          <span style={{ fontSize: '11px', color: C.textMuted }}>Formulaire actif</span>
        </div>
      </header>

      <div style={st.content}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', margin: '0 0 6px' }}>Demande de location</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: C.blueBg || '#eff6ff', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', color: '#2563eb' }}>
            📄 Génère le formulaire CORPIQ officiel (format identique, 2 pages par personne)
          </div>
        </div>

        {/* Logement */}
        <div style={st.card}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '18px' }}>🏠 Logement à louer</div>
          <div style={{ ...st.g3, marginBottom: '14px' }}>
            <Field label="Adresse" required><input style={st.inp} value={logement.adresse} onChange={e => setLogement({ ...logement, adresse: e.target.value })} placeholder="123 Rue Exemple" /></Field>
            <Field label="N° appartement"><input style={st.inp} value={logement.appartement} onChange={e => setLogement({ ...logement, appartement: e.target.value })} placeholder="4B" /></Field>
            <Field label="Ville" required><input style={st.inp} value={logement.ville} onChange={e => setLogement({ ...logement, ville: e.target.value })} placeholder="Montréal" /></Field>
          </div>
          <div style={st.g2}>
            <Field label="Bail — début"><input style={st.inp} type="date" value={logement.bailDebut} onChange={e => setLogement({ ...logement, bailDebut: e.target.value })} /></Field>
            <Field label="Bail — fin"><input style={st.inp} type="date" value={logement.bailFin} onChange={e => setLogement({ ...logement, bailFin: e.target.value })} /></Field>
          </div>
        </div>

        {/* Appliquants */}
        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={st.badge('applicant')}>Appliquants</span>
          <span style={{ color: C.textSub }}>{applicants.length} personne{applicants.length > 1 ? 's' : ''}</span>
        </div>
        {applicants.map((a, i) => (
          <PersonSection key={a.id} person={a} type="applicant" index={i}
            onChange={data => updateApplicant(a.id, data)}
            onRemove={applicants.length > 1 ? () => removeApplicant(a.id) : null} />
        ))}
        <button style={st.addBtn()} onClick={addApplicant}>+ Ajouter un appliquant</button>

        {/* Garants */}
        {guarantors.length > 0 && (
          <>
            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={st.badge('guarantor')}>Cautions / Garants</span>
              <span style={{ color: C.textSub }}>{guarantors.length} personne{guarantors.length > 1 ? 's' : ''}</span>
            </div>
            {guarantors.map((g, i) => (
              <PersonSection key={g.id} person={g} type="guarantor" index={i}
                onChange={data => updateGuarantor(g.id, data)}
                onRemove={() => removeGuarantor(g.id)} />
            ))}
          </>
        )}
        <button style={st.addBtn(C.yellow, C.yellow)} onClick={addGuarantor}>+ Ajouter une caution / co-signataire</button>

        {/* Errors */}
        {errors.length > 0 && (
          <div style={{ background: C.redBg, border: `1px solid ${C.red}`, borderRadius: '8px', padding: '14px 16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: C.red, marginBottom: '8px' }}>Veuillez corriger les erreurs suivantes :</div>
            {errors.map((e, i) => <div key={i} style={{ fontSize: '12px', color: C.red, marginBottom: '4px' }}>• {e}</div>)}
          </div>
        )}

        {/* Submit */}
        <div style={{ ...st.card, marginTop: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>Conditions et signature</div>
          <div style={{ ...st.g2, marginBottom: '16px' }}>
            <Field label="Délai de signature (jours)"><input style={st.inp} type="number" value={joursSignature} onChange={e => setJoursSignature(e.target.value)} placeholder="ex: 3" /></Field>
            <Field label="Dépôt pour frais d'enquête ($)"><input style={st.inp} type="number" value={depot} onChange={e => setDepot(e.target.value)} placeholder="ex: 50" /></Field>
          </div>
          <div style={{ background: C.bg, borderRadius: '8px', padding: '14px', marginBottom: '16px', fontSize: '12px', color: C.textSub, lineHeight: '1.7' }}>
            J'atteste que ces informations sont complètes et véridiques. J'autorise le locateur et ses représentants à obtenir ou échanger des renseignements personnels avec tout agent, institutions financières, employeurs et propriétaires aux fins d'établir ma solvabilité. J'autorise la CORPIQ à recueillir et communiquer au locateur tout renseignement personnel. Ce consentement est valide durant 14 jours civils à compter de la date de signature.
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px', cursor: 'pointer' }}>
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: '2px' }} />
            <span style={{ fontSize: '12px', color: C.textSub, lineHeight: '1.6' }}>
              J'ai lu et j'accepte les conditions. Toutes les informations sont véridiques et complètes. <span style={{ color: C.red }}>*</span>
            </span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '11px', color: C.textMuted, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📄</span> PDF format CORPIQ officiel — 2 pages par personne
            </div>
            <button style={{ ...st.submitBtn, opacity: generating ? 0.7 : 1 }} onClick={handleSubmit} disabled={generating}>
              {generating ? '⏳ Génération...' : '📥 Soumettre & télécharger PDF CORPIQ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
