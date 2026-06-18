import { useState, useEffect, useRef } from "react";

// ─── GLOBAL RESPONSIVE STYLES ─────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { margin: 0; -webkit-text-size-adjust: 100%; }
      input, select, textarea, button { font-family: inherit; }
      @media (max-width: 768px) {
        .se-grid-2, .se-grid-3 { grid-template-columns: 1fr !important; }
        .se-card { padding: 16px !important; }
        .se-hide-mobile { display: none !important; }
        .se-header-title { font-size: 12px !important; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      }
      @media (max-width: 480px) {
        .se-card { padding: 12px !important; }
      }
    `}</style>
  );
}

// ─── COLOUR TOKENS ───────────────────────────────────────────────────────────
const T = {
  navy: "#1B3A6B", navyLt: "#E8EDF5",
  teal: "#1D7A8A", tealLt: "#E3F4F6",
  blue: "#2563EB", blueLt: "#EFF6FF",
  green: "#166534", greenLt: "#F0FDF4",
  red: "#991B1B",  redLt: "#FEF2F2",
  amber: "#92400E",amberLt: "#FFFBEB",
  purple:"#5B21B6",purpleLt:"#F5F3FF",
  orange:"#C2410C",orangeLt:"#FFF7ED",
  slate: "#334155", slateLt: "#F8FAFC",
  grey:  "#64748B", greyLt: "#F1F5F9",
  white: "#FFFFFF", border: "#E2E8F0",
};


// ─── INITIAL STATE ────────────────────────────────────────────────────────────
const INITIAL = {
  // Auth
  currentUser: null,
  users: [
    { id: "tech1", name: "Sarah Mitchell", role: "technician", password: "tech123", title: "EEG Technician" },
    { id: "doc1",  name: "Dr. Aisha Al-Farsi", role: "clinician", password: "doc123", title: "Consultant Paediatric Neurologist" },
    { id: "doc2",  name: "Dr. James Okonkwo", role: "clinician", password: "doc456", title: "Paediatric Epileptologist" },
  ],
  reports: [],
};

// ─── EEG WAVE SVG LOGO ───────────────────────────────────────────────────────
function EEGLogo({ size = 40 }) {
  const w = size * 6.25, h = size * 1;
  return (
    <svg width={w} height={h} viewBox="0 0 300 48">
      {/* Channel separators */}
      <line x1="0" y1="13.5" x2="300" y2="13.5" stroke="#E2E8F0" strokeWidth="0.5" />
      <line x1="0" y1="24.5" x2="300" y2="24.5" stroke="#E2E8F0" strokeWidth="0.5" />
      <line x1="0" y1="35.5" x2="300" y2="35.5" stroke="#E2E8F0" strokeWidth="0.5" />
      {/* Ch1 Fp1-F3: frontal theta + spike-wave bursts (navy) */}
      <path d="M0,9 Q4,5 8,9 T16,9 L20,9 L22,2 L24,16 L26,9 L40,9 Q44,5 48,9 T56,9 Q60,4 64,9 T72,9 L76,9 L78,2 L80,16 L82,9 L96,9 Q100,5 104,9 T112,9 L116,9 L118,2 L120,16 L122,9 L136,9 Q140,5 144,9 T152,9 L160,9 Q164,5 168,9 T176,9 L180,9 L182,2 L184,16 L186,9 L200,9 Q204,5 208,9 T216,9 Q220,4 224,9 T232,9 L240,9 Q244,5 248,9 T256,9 L260,9 L262,2 L264,16 L266,9 L280,9 Q284,5 288,9 T296,9 L300,9"
        fill="none" stroke="#1B3A6B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Ch2 T3-T5: temporal theta + spike discharges (teal) */}
      <path d="M0,20 Q6,16 12,20 T24,20 L36,20 L38,13 L40,27 L42,20 L54,20 Q60,16 66,20 T78,20 Q84,15 90,20 T102,20 L114,20 L116,13 L118,27 L120,20 L132,20 Q138,16 144,20 T156,20 L168,20 Q174,16 180,20 T192,20 L204,20 L206,13 L208,27 L210,20 L222,20 Q228,16 234,20 T246,20 Q252,15 258,20 T270,20 L282,20 L284,13 L286,27 L288,20 L300,20"
        fill="none" stroke="#1D7A8A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Ch3 C3-C4: central beta + vertex sharps (blue) */}
      <path d="M0,31 Q2,28 4,31 T8,31 Q10,28 12,31 T16,31 Q18,28 20,31 T24,31 L28,31 L30,24 L32,38 L34,31 L48,31 Q50,28 52,31 T56,31 Q58,28 60,31 T64,31 Q66,28 68,31 T72,31 Q74,28 76,31 T80,31 L92,31 L94,24 L96,38 L98,31 L112,31 Q114,28 116,31 T120,31 Q122,28 124,31 T128,31 Q130,28 132,31 T136,31 L148,31 L150,24 L152,38 L154,31 L168,31 Q170,28 172,31 T176,31 Q178,28 180,31 T184,31 Q186,28 188,31 T192,31 Q194,28 196,31 T200,31 L212,31 L214,24 L216,38 L218,31 L232,31 Q234,28 236,31 T240,31 Q242,28 244,31 T248,31 L260,31 L262,24 L264,38 L266,31 L280,31 Q282,28 284,31 T288,31 Q290,28 292,31 T296,31 L300,31"
        fill="none" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Ch4 O1-O2: regular sinusoidal alpha (teal) */}
      <path d="M0,42 Q7.5,36 15,42 T30,42 T45,42 T60,42 T75,42 T90,42 T105,42 T120,42 T135,42 T150,42 T165,42 T180,42 T195,42 T210,42 T225,42 T240,42 T255,42 T270,42 T285,42 T300,42"
        fill="none" stroke="#1D7A8A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── AGE UTILITIES ────────────────────────────────────────────────────────────
function isNeonatal(dob, ga) {
  if (!dob) return false;
  const ageWeeks = Math.floor((Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 7));
  const gaWeeks = parseInt(ga) || 40;
  const pma = gaWeeks + ageWeeks;
  return pma <= 44;
}

function getPMA(dob, ga) {
  if (!dob || !ga) return null;
  const ageWeeks = Math.floor((Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 7));
  return parseInt(ga) + ageWeeks;
}

function getAgeDisplay(dob) {
  if (!dob) return "";
  const ms = Date.now() - new Date(dob);
  const days = Math.floor(ms / 86400000);
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30.44);
  if (months < 24) return `${months} months`;
  const years = Math.floor(days / 365.25);
  const rem = Math.floor((days % 365.25) / 30.44);
  return rem > 0 ? `${years} yrs ${rem} mths` : `${years} years`;
}

function getPDRReference(dob) {
  if (!dob) return null;
  const months = Math.floor((Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 30.44));
  if (months < 3) return null;
  if (months < 6)  return { range: "3–4 Hz", min: 3, note: "Forerunner of alpha rhythm" };
  if (months < 12) return { range: "4–5 Hz", min: 4, note: "Occipital predominance establishing" };
  if (months < 18) return { range: "5–6 Hz", min: 5, note: "High interindividual variability" };
  if (months < 24) return { range: "6–7 Hz", min: 6, note: "Alpha range approaching" };
  if (months < 36) return { range: "7–8 Hz", min: 7, note: "8 Hz now within range for some" };
  if (months < 60) return { range: "≥8 Hz",  min: 8, note: "Adult lower limit reached" };
  if (months < 96) return { range: "8–9 Hz", min: 8, note: "PSWY may be prominent" };
  if (months < 144) return { range: "≥9 Hz", min: 9, note: "PSWY decreasing" };
  return { range: "9–11 Hz", min: 9, note: "Adult-like; stable ~10 Hz" };
}

// ─── TEMPLATE CONFIG ──────────────────────────────────────────────────────────
function getActiveModules(eegType, isNeo) {
  const base = ["patient","clinical","technical","background","ieds","ictal","conclusion","signoff"];
  const map = {
    "Routine Outpatient EEG":             base,
    "Inpatient Standard EEG":             base,
    "Video-EEG Telemetry — Diagnostic":   base,
    "Video-EEG Telemetry — Pre-surgical": ["patient","clinical","technical","background","ieds","ictal","presurgical","conclusion","signoff"],
    "Paediatric ICU / Continuous EEG":    ["patient","clinical","technical","background","ieds","ictal","rpp","icu","conclusion","signoff"],
    "Neonatal EEG — Standard Outpatient": base,
    "Neonatal EEG — Standard Inpatient":  base,
    "Neonatal cEEG — Standard":           ["patient","clinical","technical","background","ieds","ictal","rpp","conclusion","signoff"],
    "Neonatal cEEG — Prolonged":          ["patient","clinical","technical","background","ieds","ictal","rpp","icu","conclusion","signoff"],
    "Suspected Brain Death Evaluation":   ["patient","clinical","technical","braindeath","conclusion","signoff"],
  };
  return map[eegType] || base;
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function ModuleBanner({ color, label, icon }) {
  return (
    <div style={{ background: color, borderRadius: 10, padding: "12px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>{label}</span>
    </div>
  );
}

function Field({ label, required, hint, children, accent = T.slate }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: accent, marginBottom: 4 }}>
        {label}{required && <span style={{ color: T.red, marginLeft: 3 }}>*</span>}
        {hint && <span style={{ fontWeight: 400, color: T.grey, fontSize: 12, marginLeft: 6 }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder = "Select...", disabled }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      style={{ width: "100%", padding: "8px 10px", border: `1.5px solid ${T.border}`, borderRadius: 7,
        fontSize: 13, color: value ? T.slate : T.grey, background: disabled ? T.greyLt : T.white,
        outline: "none", cursor: disabled ? "not-allowed" : "pointer" }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function TextArea({ value, onChange, placeholder, rows = 3, disabled }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      rows={rows} disabled={disabled}
      style={{ width: "100%", padding: "8px 10px", border: `1.5px solid ${T.border}`, borderRadius: 7,
        fontSize: 13, color: T.slate, resize: "vertical", fontFamily: "inherit",
        background: disabled ? T.greyLt : T.white, outline: "none", boxSizing: "border-box" }} />
  );
}

function Input({ value, onChange, placeholder, type = "text", disabled }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      disabled={disabled}
      style={{ width: "100%", padding: "8px 10px", border: `1.5px solid ${T.border}`, borderRadius: 7,
        fontSize: 13, color: T.slate, background: disabled ? T.greyLt : T.white,
        outline: "none", boxSizing: "border-box" }} />
  );
}

function MultiSelect({ options, selected, onChange }) {
  const toggle = (o) => onChange(selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map(o => (
        <button key={o} onClick={() => toggle(o)}
          style={{ padding: "5px 10px", borderRadius: 20, border: `1.5px solid ${selected.includes(o) ? T.teal : T.border}`,
            background: selected.includes(o) ? T.tealLt : T.white, color: selected.includes(o) ? T.teal : T.slate,
            fontSize: 12, fontWeight: selected.includes(o) ? 600 : 400, cursor: "pointer", transition: "all 0.15s" }}>
          {selected.includes(o) ? "✓ " : ""}{o}
        </button>
      ))}
    </div>
  );
}

function NoteBox({ text, color = T.teal }) {
  return (
    <div style={{ background: `${color}10`, borderLeft: `3px solid ${color}`, borderRadius: "0 6px 6px 0",
      padding: "8px 12px", marginBottom: 14, fontSize: 12, color: T.slate, lineHeight: 1.5 }}>
      {text}
    </div>
  );
}

function WarnBox({ text }) {
  return (
    <div style={{ background: T.redLt, borderLeft: `3px solid ${T.red}`, borderRadius: "0 6px 6px 0",
      padding: "8px 12px", marginBottom: 14, fontSize: 12, color: T.red, fontWeight: 600 }}>
      ⚠️ {text}
    </div>
  );
}

function TwoCol({ children }) {
  return <div className="se-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>;
}

function ThreeCol({ children }) {
  return <div className="se-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>{children}</div>;
}

function Card({ children, style = {} }) {
  return (
    <div className="se-card" style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`,
      padding: 24, marginBottom: 20, ...style }}>
      {children}
    </div>
  );
}

function Btn({ label, onClick, color = T.navy, textColor = "#fff", icon, small, disabled, outline }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "6px 14px" : "10px 20px",
        background: disabled ? T.greyLt : (outline ? "transparent" : color),
        color: disabled ? T.grey : (outline ? color : textColor),
        border: `2px solid ${disabled ? T.border : color}`,
        borderRadius: 8, fontWeight: 600, fontSize: small ? 12 : 14, cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.15s", opacity: disabled ? 0.6 : 1 }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );
}

// ─── FORM DATA STRUCTURE ──────────────────────────────────────────────────────
function emptyReport() {
  return {
    id: Date.now().toString(),
    status: "draft", // draft | signed | amended
    createdAt: new Date().toISOString(),
    signedAt: null,
    signedBy: null,
    amendments: [],
    // Module 1 — Patient
    patientName: "", dob: "", hospitalId: "", sex: "",
    ga: "", pma: "", chronologicalAge: "",
    referrer: "", referrerSpec: "",
    recordingDate: "", recordingStart: "", recordingDuration: "",
    eegType: "", recordingLocation: "",
    // Module 2 — Clinical context (clinician)
    clinicalState: "", stateComment: "",
    sedation: "", sedationDrug: "", sedationTime: "", sedationEffect: "",
    meds: "", otherMeds: "", medHistory: "",
    clinicalHistory: "", referralQuestion: "", previousEEG: "", previousEEGSummary: "",
    primaryDiagnosis: "", hypothermia: "", temp: "", nmba: "", neonatalContext: "",
    // Module 3 — Technical (technician)
    electrodeSystem: "", channelCount: "", electrodeType: "", impedances: "",
    skullDefects: "",
    ecg: "", emg: "", eog: "", resp: "", video: "", ancillaryNotes: "",
    lff: "", hff: "", notch: "", sensitivity: "", speed: "", samplingRate: "",
    totalDuration: "", interpretableDuration: "",
    hv: "", hvResponse: "", ips: "", ipsResponse: "", sleepAchieved: "", activatingNotes: "",
    techQuality: "", artefacts: [], artefactImpact: "",
    techNotes: "", techCompletedBy: "", techCompletedAt: "",
    // Module 4A — Background non-neonatal
    pdr: "", pdrFreq: "", pdrFreqRange: "", pdrAssessment: "", pdrReactivity: "", pdrModulation: "", pdrFreeText: "",
    bgFreq: "", bgOrg: "", thetaDelta: "", beta: "", bgFreqFreeText: "",
    continuity: "", suppressionPct: "", continuityFreeText: "",
    bsContent: "", bsBurstDuration: "", bsIBI: "", bsLocalisation: "", bsSharpness: "", identicalBursts: "", bsBurstDesc: "",
    symmetry: "", asymmetrySide: "", voltageDiff: "", freqDiff: "", breachEffect: "", symmetryFreeText: "",
    bgVoltage: "", bgVoltageRange: "", voltageNotes: "",
    reactivity: "", stimType: [], reactivityDesc: "",
    stateChanges: "", spindles: "", spindleAbnorm: "", kComplex: "", vertexWaves: "",
    hypnagogicHyp: "", pswy: "", cape: "", capeDesc: "", sleepFreeText: "",
    apGradient: "",
    bgClassification: "", bgNarrative: "",
    // Module 4B — Neonatal background
    continuityNeo: "", ibiDuration: "", ibiRange: "", ibiVoltage: "", continuityAssessNeo: "", continuityFreeTextNeo: "",
    symmetryNeo: "", asymmetrySideNeo: "", synchronyNeo: "", pctSynchronous: "", symmetryFreeTextNeo: "",
    voltageNeo: "", burstVoltageNeo: "",
    variability: "", reactivityNeo: "", reactivityDescNeo: "",
    statesNeo: [], sleepCyclingNeo: "", sleepCyclingNotesNeo: "",
    monorhythmicDelta: "", deltaBrushes: "", rhythmicTempTheta: "", anteriorDysrhythmia: "", encocheFrontales: "",
    graphoFreeText: "",
    eegMaturity: "", eegAge: "", dysmaturityNotes: "",
    bgGradeNeo: "", bgNarrativeNeo: "",
    // Module 5 — IEDs
    iedPresence: "",
    iedMorphology: "", iedSharpness: "", iedDuration: "", iedSlowWave: "", iedSlowWaveDuration: "",
    iedSlowWaveAmplitude: "", iedPolarity: "", iedAmplitude: "", iedAmplitudeValue: "", iedConsistency: "",
    iedMorphologyFreeText: "",
    iedLateralisation: "", iedGeneralisedSubtype: "", iedLateralisationNotes: "",
    iedRegion: "", iedPhaseReversal: "", iedField: "", iedApLag: "", iedLocalisationFreeText: "",
    iedPrevalence: "", iedRate: "", iedPer10s: "", iedState: "", iedPrevalenceFreeText: "",
    hypsarrhythmia: "", electrodecrement: "", csws: "", swi: "", centrotemporalSpikes: "",
    occipitalParoxysms: "", syndromeFreeText: "",
    negSharpWaves: "", posSharpWaves: "", negAbundance: "", posAbundance: "", neoTransientFreeText: "",
    iedSummary: "",
    iedHvResponse: "", iedIpsResponse: "", iedSleepResponse: "", iedFixationResponse: "", iedActivationFreeText: "",
    // Module 6 — RPP
    rppPresent: "",
    rppLocalisation: "", rppGSubtype: "", rppLSubtype: "", rppSide: "", rppLobes: [],
    rppAsynchronyLag: "", rppLocNotes: "",
    rppType: "", rppTypeNotes: "",
    rppPrevalence: "", rppDuration: "", rppLongestEpisode: "",
    rppFreq: "", rppFreqMeasured: "", rppFreqRange: "",
    rppPhases: "", rppSharpness: "", rppAmplitudeAbs: "", rppAmplitudeValue: "",
    rppAmplitudeRel: "", rppPolarity: "", rppEvolution: "",
    rppPlusModifier: "", rppEDB: "", rppTriphasic: "", rppOnset: "", rppStimulus: "",
    rppModifierFreeText: "",
    iicAssessment: "", iicFreeText: "",
    // Module 7 — Ictal
    ictalType: [], seizureCount: "",
    ictalHvResponse: "", ictalIpsResponse: "", ictalSleepResponse: "", ictalOtherProvocation: "", ictalActivationFreeText: "",
    onsetPattern: "", onsetFreq: "", peakFreq: "", onsetLateralisation: "", onsetLocalisation: "",
    onsetCharacter: "", ictalEvolution: "", evolutionDesc: "", maxSpread: "",
    seizureDuration: "", seizureDurationMeasured: "", seizureLongest: "",
    ictalOffset: "", postIctal: "", postIctalDuration: "",
    awareness: "", motorFeatures: [], nonMotorFeatures: [], phenoFreeText: "",
    seCriteria: "", seType: "",
    neoSeizureClass: "", neoSpread: "", neoOnsetRegion: "",
    seizureBurdenTotal: "", maxHourlyBurden: "", dailyBurden: "",
    firstSeizureTime: "", seizureResolutionTime: "", seizureBurdenFreeText: "",
    birdsPresent: "", birdsFreeText: "",
    ictalNarrative: "",
    // Module 8.1 — Presurgical
    habitualSeizures: "", seizuresCapturedCount: "",
    interictialZone: "", ictalOnsetZone: "", propagation: "",
    mriConcordance: "", multimodalConcordance: "",
    ictalSemiology: "", localisingEvidence: "", furtherInvestigation: "",
    // Module 8.2 — Brain death
    bd16ch: "", bdFullComplement: "", bdInterelDist: "", bdImpedance: "",
    bdSensitivity: "", bdDuration: "", bdTemp: "", bdTempValue: "",
    bdNoSedatives: "", bdNoMetabolic: "", bdIntegrity: "", bdNoReactivity: "", bdVideo: "",
    bdTechNotes: "", bdResult: "", bdReactivityResult: "",
    bdStatement: "", bdCaveats: "", bdResidualActivity: "",
    // Module 8.3 — ICU monitoring
    icuIndication: "", icuReportType: "", icuBgTrend: "", icuSeizureTrend: "",
    icuTreatmentResponse: "", icuSummary: "",
    // Module 8.4 — Syndrome
    syndrome: "", eegSupportsSyndrome: "", syndromeCommentary: "",
    // Module 9 — Impression
    overallClassification: "", degreeAbnormality: "",
    bgStatement: "", bgImpressionFreeText: "",
    iedStatement: "", iedImpressionFreeText: "",
    ictalStatement: "", ictalImpressionFreeText: "",
    comparisonStatement: "", comparisonFreeText: "",
    syndromeImpressionFreeText: "", ilaeClassification: "",
    finalImpression: "",
    recommendations: [], recommendationsFreeText: "",
  };
}

// ─── PDF GENERATION ───────────────────────────────────────────────────────────
async function generatePDF(report, user, allUsers) {
  const signer = allUsers.find(u => u.id === report.signedBy);
  const blob = await buildPDFBlob(report, signer);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `SmartEEG_${report.patientName?.replace(/\s/g,"_")}_${report.id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

async function buildPDFBlob(report, signer) {
  // Build HTML → print to PDF via window.print / jsPDF via CDN
  const html = buildReportHTML(report, signer);
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  setTimeout(() => { w.print(); }, 600);
  // Return a placeholder blob for the download link fallback
  return new Blob([html], { type: "text/html" });
}

function buildReportHTML(r, signer) {
  const date = new Date(r.signedAt || r.createdAt).toLocaleDateString("en-GB", { day:"2-digit",month:"long",year:"numeric" });
  const isNeo = isNeonatal(r.dob, r.ga);
  const pdr = getPDRReference(r.dob);

  const section = (title, color, content) => `
    <div style="margin-bottom:20px;">
      <div style="background:${color};color:#fff;padding:8px 14px;border-radius:6px;font-weight:700;font-size:13px;margin-bottom:10px;">${title}</div>
      ${content}
    </div>`;

  const row = (label, value) => value ? `
    <div style="display:flex;gap:8px;margin-bottom:5px;font-size:12px;">
      <div style="color:#64748B;min-width:180px;font-weight:600;">${label}:</div>
      <div style="color:#1e293b;">${value}</div>
    </div>` : "";

  const freeText = (label, value) => value ? `
    <div style="margin-bottom:8px;">
      <div style="font-size:11px;font-weight:700;color:#475569;margin-bottom:2px;">${label}:</div>
      <div style="font-size:12px;color:#1e293b;background:#f8fafc;border-left:3px solid #1D7A8A;padding:6px 10px;border-radius:0 4px 4px 0;">${value}</div>
    </div>` : "";

  const amendments = r.amendments?.length ? r.amendments.map(a => `
    <div style="background:#FFF7ED;border-left:3px solid #C2410C;padding:8px 12px;border-radius:0 4px 4px 0;margin-bottom:8px;font-size:12px;">
      <strong>Addendum — ${new Date(a.at).toLocaleString("en-GB")} by ${a.by}:</strong><br/>${a.text}
    </div>`).join("") : "";

  return `<!DOCTYPE html>
<html>
<head>
<title>SmartEEG Report — ${r.patientName}</title>
<style>
  @page { size: A4; margin: 18mm 15mm; }
  body { font-family: Arial, sans-serif; color: #1e293b; font-size: 12px; line-height: 1.5; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1D7A8A; padding-bottom: 10px; margin-bottom: 18px; }
  .logo-text { font-size: 20px; font-weight: 800; color: #1B3A6B; }
  .logo-sub { font-size: 10px; color: #64748B; }
  .report-meta { text-align: right; font-size: 11px; color: #475569; }
  h2 { font-size: 13px; margin: 16px 0 6px; }
  .impression-box { background: #E8EDF5; border: 2px solid #1B3A6B; border-radius: 8px; padding: 14px; margin: 12px 0; }
  .impression-box .title { font-weight: 700; color: #1B3A6B; font-size: 13px; margin-bottom: 8px; }
  .impression-box .text { font-size: 13px; line-height: 1.7; }
  .sign-box { border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 12px; margin-top: 16px; display: flex; justify-content: space-between; }
  .footer { border-top: 1px solid #E2E8F0; padding-top: 6px; margin-top: 20px; font-size: 10px; color: #94a3b8; text-align: center; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo-text">Smart<span style="color:#1D7A8A">EEG</span></div>
    <svg width="200" height="32" viewBox="0 0 300 48">
      <line x1="0" y1="13.5" x2="300" y2="13.5" stroke="#E2E8F0" stroke-width="0.5"/>
      <line x1="0" y1="24.5" x2="300" y2="24.5" stroke="#E2E8F0" stroke-width="0.5"/>
      <line x1="0" y1="35.5" x2="300" y2="35.5" stroke="#E2E8F0" stroke-width="0.5"/>
      <path d="M0,9 Q4,5 8,9 T16,9 L20,9 L22,2 L24,16 L26,9 L40,9 Q44,5 48,9 T56,9 Q60,4 64,9 T72,9 L76,9 L78,2 L80,16 L82,9 L96,9 Q100,5 104,9 T112,9 L116,9 L118,2 L120,16 L122,9 L136,9 Q140,5 144,9 T152,9 L160,9 Q164,5 168,9 T176,9 L180,9 L182,2 L184,16 L186,9 L200,9 Q204,5 208,9 T216,9 Q220,4 224,9 T232,9 L240,9 Q244,5 248,9 T256,9 L260,9 L262,2 L264,16 L266,9 L280,9 Q284,5 288,9 T296,9 L300,9" fill="none" stroke="#1B3A6B" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M0,20 Q6,16 12,20 T24,20 L36,20 L38,13 L40,27 L42,20 L54,20 Q60,16 66,20 T78,20 Q84,15 90,20 T102,20 L114,20 L116,13 L118,27 L120,20 L132,20 Q138,16 144,20 T156,20 L168,20 Q174,16 180,20 T192,20 L204,20 L206,13 L208,27 L210,20 L222,20 Q228,16 234,20 T246,20 Q252,15 258,20 T270,20 L282,20 L284,13 L286,27 L288,20 L300,20" fill="none" stroke="#1D7A8A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M0,31 Q2,28 4,31 T8,31 Q10,28 12,31 T16,31 Q18,28 20,31 T24,31 L28,31 L30,24 L32,38 L34,31 L48,31 Q50,28 52,31 T56,31 Q58,28 60,31 T64,31 Q66,28 68,31 T72,31 Q74,28 76,31 T80,31 L92,31 L94,24 L96,38 L98,31 L112,31 Q114,28 116,31 T120,31 Q122,28 124,31 T128,31 Q130,28 132,31 T136,31 L148,31 L150,24 L152,38 L154,31 L168,31 Q170,28 172,31 T176,31 Q178,28 180,31 T184,31 Q186,28 188,31 T192,31 Q194,28 196,31 T200,31 L212,31 L214,24 L216,38 L218,31 L232,31 Q234,28 236,31 T240,31 Q242,28 244,31 T248,31 L260,31 L262,24 L264,38 L266,31 L280,31 Q282,28 284,31 T288,31 Q290,28 292,31 T296,31 L300,31" fill="none" stroke="#2563EB" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M0,42 Q7.5,36 15,42 T30,42 T45,42 T60,42 T75,42 T90,42 T105,42 T120,42 T135,42 T150,42 T165,42 T180,42 T195,42 T210,42 T225,42 T240,42 T255,42 T270,42 T285,42 T300,42" fill="none" stroke="#1D7A8A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <div class="logo-sub"><strong>Standardised Paediatric EEG Reporting System</strong></div>
  </div>
  <div class="report-meta">
    <strong>EEG REPORT</strong><br/>
    Report ID: ${r.id}<br/>
    Date: ${date}<br/>
    Status: <strong>${r.status.toUpperCase()}</strong>
  </div>
</div>

${section("PATIENT INFORMATION", "#1B3A6B", `
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
    <div>${row("Patient Name", r.patientName)}</div>
    <div>${row("Date of Birth", r.dob ? new Date(r.dob).toLocaleDateString("en-GB") : "")}</div>
    <div>${row("Hospital ID", r.hospitalId)}</div>
    <div>${row("Age", getAgeDisplay(r.dob))}</div>
    <div>${row("Sex", r.sex)}</div>
    <div>${row("Referring Clinician", `${r.referrer}${r.referrerSpec ? " — " + r.referrerSpec : ""}`)}</div>
    ${isNeo ? `<div>${row("Gestational Age", r.ga ? r.ga + " weeks" : "")}</div>` : ""}
    ${isNeo ? `<div>${row("PMA", r.pma ? r.pma + " weeks" : "")}</div>` : ""}
  </div>
  ${row("EEG Type", r.eegType)}
  ${row("Recording Date", r.recordingDate)}
  ${row("Recording Duration", r.recordingDuration ? r.recordingDuration + " minutes" : "")}
`)}

${r.clinicalHistory ? section("CLINICAL CONTEXT", "#2563EB", `
  ${freeText("Clinical History", r.clinicalHistory)}
  ${freeText("Referral Question", r.referralQuestion)}
  ${row("Clinical State During Recording", r.clinicalState)}
  ${r.sedation === "Yes" ? row("Sedation", `${r.sedationDrug || ""} (${r.sedationTime || ""} min prior)`) : row("Sedation", "None")}
  ${r.meds ? freeText("Current Medications", r.meds) : ""}
`) : ""}

${section("TECHNICAL DESCRIPTION", "#1D7A8A", `
  ${row("Electrode System", r.electrodeSystem)}
  ${row("Number of Channels", r.channelCount)}
  ${row("LFF / HFF / Notch", [r.lff && r.lff+"Hz LFF", r.hff && r.hff+"Hz HFF", r.notch && r.notch+" Notch"].filter(Boolean).join(" | "))}
  ${row("Sensitivity", r.sensitivity ? r.sensitivity + " µV/mm" : "")}
  ${row("Display Speed", r.speed ? r.speed + " mm/s" : "")}
  ${row("Technical Quality", r.techQuality)}
  ${r.artefacts?.length ? row("Artefacts", r.artefacts.join(", ")) : ""}
  ${r.artefactImpact ? freeText("Artefact Impact", r.artefactImpact) : ""}
  ${row("Activating Procedures — HV", r.hv)}
  ${r.hvResponse ? row("HV Response", r.hvResponse) : ""}
  ${row("IPS", r.ips)}
  ${r.ipsResponse ? row("IPS Response", r.ipsResponse) : ""}
  ${r.techNotes ? freeText("Technical Notes", r.techNotes) : ""}
  <div style="font-size:10px;color:#64748B;margin-top:6px;">Recorded by: ${r.techCompletedBy || "—"} on ${r.techCompletedAt || "—"}</div>
`)}

${!isNeo ? section("EEG BACKGROUND", "#166534", `
  ${row("Posterior Dominant Rhythm", r.pdr)}
  ${r.pdrFreq ? row("PDR Frequency", r.pdrFreq + " Hz" + (r.pdrFreqRange ? " (range: " + r.pdrFreqRange + " Hz)" : "")) : ""}
  ${r.pdrAssessment ? row("PDR Assessment vs Age", r.pdrAssessment) : ""}
  ${r.pdrReactivity ? row("PDR Reactivity", r.pdrReactivity) : ""}
  ${r.bgFreq ? row("Predominant Background Frequency", r.bgFreq) : ""}
  ${r.bgOrg ? row("Organisation", r.bgOrg) : ""}
  ${r.continuity ? row("Continuity", r.continuity) : ""}
  ${r.symmetry ? row("Symmetry", r.symmetry) : ""}
  ${r.bgVoltage ? row("Voltage", r.bgVoltage) : ""}
  ${r.reactivity ? row("Reactivity", r.reactivity) : ""}
  ${r.stateChanges ? row("State Changes", r.stateChanges) : ""}
  ${r.apGradient ? row("AP Gradient", r.apGradient) : ""}
  ${r.bgClassification ? row("Overall Background", r.bgClassification) : ""}
  ${freeText("Background Description", r.bgNarrative)}
`) : section("NEONATAL EEG BACKGROUND", "#C2410C", `
  ${row("Continuity Pattern", r.continuityNeo)}
  ${r.ibiDuration ? row("Typical IBI Duration", r.ibiDuration + " sec" + (r.ibiRange ? " (range: " + r.ibiRange + " sec)" : "")) : ""}
  ${r.ibiVoltage ? row("IBI Voltage", r.ibiVoltage) : ""}
  ${r.continuityAssessNeo ? row("Continuity Assessment vs PMA", r.continuityAssessNeo) : ""}
  ${r.symmetryNeo ? row("Symmetry", r.symmetryNeo) : ""}
  ${r.synchronyNeo ? row("Synchrony", r.synchronyNeo) : ""}
  ${r.voltageNeo ? row("Voltage", r.voltageNeo) : ""}
  ${r.variability ? row("Variability", r.variability) : ""}
  ${r.reactivityNeo ? row("Reactivity", r.reactivityNeo) : ""}
  ${r.eegMaturity ? row("EEG Maturity", r.eegMaturity) : ""}
  ${r.bgGradeNeo ? row("Overall Background Grade", r.bgGradeNeo) : ""}
  ${freeText("Background Description", r.bgNarrativeNeo)}
`)}

${r.iedPresence !== "Absent" && r.iedPresence ? section("INTERICTAL EPILEPTIFORM DISCHARGES", "#991B1B", `
  ${row("IED Presence", r.iedPresence)}
  ${r.iedMorphology ? row("Primary Morphology", r.iedMorphology) : ""}
  ${r.iedSharpness ? row("Sharpness", r.iedSharpness) : ""}
  ${r.iedDuration ? row("Duration", r.iedDuration + " ms") : ""}
  ${r.iedPolarity ? row("Polarity", r.iedPolarity) : ""}
  ${r.iedAmplitude ? row("Amplitude", r.iedAmplitude + (r.iedAmplitudeValue ? " (~" + r.iedAmplitudeValue + " µV)" : "")) : ""}
  ${r.iedLateralisation ? row("Lateralisation", r.iedLateralisation) : ""}
  ${r.iedRegion ? row("Region", r.iedRegion) : ""}
  ${r.iedPhaseReversal ? row("Phase Reversal", r.iedPhaseReversal) : ""}
  ${r.iedField ? row("Field of Spread", r.iedField) : ""}
  ${r.iedPrevalence ? row("Prevalence", r.iedPrevalence) : ""}
  ${r.iedRate ? row("Estimated Rate", r.iedRate) : ""}
  ${r.iedState ? row("State Relationship", r.iedState) : ""}
  ${freeText("IED Description", r.iedSummary || r.iedLocalisationFreeText)}
`) : ""}

${r.rppPresent === "Yes" ? section("RHYTHMIC & PERIODIC PATTERNS", "#5B21B6", `
  ${row("Localisation", r.rppLocalisation)}
  ${r.rppSide ? row("Side/Hemisphere", r.rppSide) : ""}
  ${row("Pattern Type", r.rppType)}
  ${r.rppPrevalence ? row("Prevalence", r.rppPrevalence) : ""}
  ${r.rppFreqMeasured ? row("Frequency", r.rppFreqMeasured + " Hz" + (r.rppFreqRange ? " (range: " + r.rppFreqRange + " Hz)" : "")) : ""}
  ${r.rppEvolution ? row("Evolution", r.rppEvolution) : ""}
  ${r.rppPlusModifier && r.rppPlusModifier !== "None" ? row("Plus Modifier", r.rppPlusModifier) : ""}
  ${r.iicAssessment ? row("IIC Assessment", r.iicAssessment) : ""}
  ${freeText("RPP Description", r.rppModifierFreeText || r.iicFreeText)}
`) : ""}

${r.ictalType?.length ? section("ICTAL EPISODES", "#991B1B", `
  ${row("Ictal Events", r.ictalType?.join("; "))}
  ${r.seizureCount ? row("Total Seizures", r.seizureCount) : ""}
  ${r.onsetPattern ? row("EEG Onset Pattern", r.onsetPattern) : ""}
  ${r.onsetFreq ? row("Onset Frequency", r.onsetFreq + " Hz") : ""}
  ${r.onsetLateralisation ? row("Onset Lateralisation", r.onsetLateralisation) : ""}
  ${r.onsetLocalisation ? row("Onset Localisation", r.onsetLocalisation) : ""}
  ${r.maxSpread ? row("Maximum Spread", r.maxSpread) : ""}
  ${r.seizureDurationMeasured ? row("Typical Duration", r.seizureDurationMeasured + " sec") : ""}
  ${r.seCriteria && r.seCriteria !== "No — does not meet SE criteria" ? row("Status Epilepticus", r.seCriteria) : ""}
  ${r.motorFeatures?.length ? row("Motor Features", r.motorFeatures.join(", ")) : ""}
  ${freeText("Ictal Narrative", r.ictalNarrative || r.phenoFreeText)}
`) : ""}

${section("9  CONCLUSION", "#1B3A6B", `
  <div style="background:#E8EDF5;border:2px solid #1B3A6B;border-radius:8px;padding:14px;margin-bottom:14px;">
    <div style="font-weight:700;color:#1B3A6B;font-size:13px;margin-bottom:8px;">Clinical Impression</div>
    <div style="font-size:13px;line-height:1.7;color:#1e293b;">${(r.finalImpression || "").replace(/\n/g, "<br/>")}</div>
  </div>
  ${r.recommendations?.length ? `<div style="font-weight:700;font-size:12px;color:#1D7A8A;margin-bottom:6px;">Recommendations</div><ul style="margin:0;padding-left:18px;margin-bottom:8px;">${r.recommendations.map(rec => `<li style="font-size:12px;margin-bottom:4px;">${rec}</li>`).join("")}</ul>` : ""}
  ${r.recommendationsFreeText ? freeText("Recommendations Notes", r.recommendationsFreeText) : ""}
`)}

${amendments ? `<div style="margin-top:16px;"><strong style="color:#C2410C;font-size:12px;">AMENDMENTS / ADDENDA</strong><div style="margin-top:6px;">${amendments}</div></div>` : ""}

<div class="sign-box">
  <div>
    <div style="font-size:11px;color:#64748B;margin-bottom:3px;">Report prepared and signed by:</div>
    <div style="font-weight:700;font-size:13px;">${signer?.name || "—"}</div>
    <div style="font-size:11px;color:#64748B;">${signer?.title || ""}</div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:11px;color:#64748B;">Date & Time Signed:</div>
    <div style="font-weight:600;font-size:12px;">${r.signedAt ? new Date(r.signedAt).toLocaleString("en-GB") : "—"}</div>
    <div style="font-size:11px;color:#64748B;margin-top:4px;">Report ID: ${r.id}</div>
  </div>
</div>

<div class="footer">SmartEEG Report System v2.0 &nbsp;|&nbsp; This report is for clinical use only and must be interpreted in the full clinical context. &nbsp;|&nbsp; Printed: ${new Date().toLocaleString("en-GB")}</div>
</body></html>`;
}

// ─── MODULES ──────────────────────────────────────────────────────────────────

function ModulePatient({ r, set, readOnly }) {
  const ageDisplay = getAgeDisplay(r.dob);
  const pmaVal = getPMA(r.dob, r.ga);
  const neo = isNeonatal(r.dob, r.ga);

  return (
    <div>
      <ModuleBanner color={T.navy} label="MODULE 1 — PATIENT & STUDY IDENTIFICATION" icon="👤" />
      <Card>
        <TwoCol>
          <Field label="Patient Name" required><Input value={r.patientName} onChange={v=>set("patientName",v)} disabled={readOnly} placeholder="Last, First" /></Field>
          <Field label="Hospital ID / MRN" required><Input value={r.hospitalId} onChange={v=>set("hospitalId",v)} disabled={readOnly} /></Field>
          <Field label="Date of Birth" required>
            <Input type="date" value={r.dob} onChange={v=>set("dob",v)} disabled={readOnly} />
            {ageDisplay && <div style={{fontSize:11,color:T.teal,marginTop:3}}>Age: <strong>{ageDisplay}</strong></div>}
          </Field>
          <Field label="Sex">
            <Select value={r.sex} onChange={v=>set("sex",v)} options={["Male","Female","Other"]} disabled={readOnly} />
          </Field>
          <Field label="Referring Clinician" required><Input value={r.referrer} onChange={v=>set("referrer",v)} disabled={readOnly} /></Field>
          <Field label="Referring Specialty"><Input value={r.referrerSpec} onChange={v=>set("referrerSpec",v)} disabled={readOnly} /></Field>
          <Field label="Recording Date"><Input type="date" value={r.recordingDate} onChange={v=>set("recordingDate",v)} disabled={readOnly} /></Field>
          <Field label="Recording Duration (minutes)"><Input type="number" value={r.recordingDuration} onChange={v=>set("recordingDuration",v)} disabled={readOnly} /></Field>
        </TwoCol>
      </Card>

      <Card>
        <Field label="EEG Study Type" required hint="This determines which modules are shown">
          <Select value={r.eegType} onChange={v=>set("eegType",v)} disabled={readOnly}
            options={["Routine Outpatient EEG","Inpatient Standard EEG","Video-EEG Telemetry — Diagnostic","Video-EEG Telemetry — Pre-surgical","Paediatric ICU / Continuous EEG","Neonatal EEG — Standard Outpatient","Neonatal EEG — Standard Inpatient","Neonatal cEEG — Standard","Neonatal cEEG — Prolonged","Suspected Brain Death Evaluation"]} />
        </Field>
        <Field label="Recording Location">
          <Select value={r.recordingLocation} onChange={v=>set("recordingLocation",v)} disabled={readOnly}
            options={["Outpatient Clinic / EEG Laboratory","Inpatient Ward","Paediatric ICU","Neonatal ICU","Video-EEG Telemetry Suite","Home / Ambulatory"]} />
        </Field>
      </Card>

      {neo && (
        <Card style={{borderColor: T.orange}}>
          <div style={{color:T.orange,fontWeight:700,fontSize:13,marginBottom:12}}>🟠 NEONATAL FIELDS</div>
          <TwoCol>
            <Field label="Gestational Age at Birth (weeks)" required>
              <Input type="number" value={r.ga} onChange={v=>set("ga",v)} disabled={readOnly} placeholder="e.g. 37" />
            </Field>
            <Field label="Postmenstrual Age (PMA)" hint="auto-calculated">
              <div style={{padding:"8px 10px",background:T.orangeLt,borderRadius:7,fontSize:13,color:T.orange,fontWeight:600}}>
                {pmaVal ? `${pmaVal} weeks PMA` : "Enter DOB and GA to calculate"}
              </div>
            </Field>
            <Field label="Hypothermia">
              <Select value={r.hypothermia} onChange={v=>set("hypothermia",v)} disabled={readOnly}
                options={["Not applicable","Cooling ongoing at time of recording","Rewarming phase","Completed prior to recording"]} />
            </Field>
            <Field label="Temperature at Recording (°C)">
              <Input type="number" value={r.temp} onChange={v=>set("temp",v)} disabled={readOnly} placeholder="36.5" />
            </Field>
          </TwoCol>
          <Field label="Primary Clinical Diagnosis">
            <Select value={r.primaryDiagnosis} onChange={v=>set("primaryDiagnosis",v)} disabled={readOnly}
              options={["Hypoxic-Ischaemic Encephalopathy (HIE)","Neonatal seizures — cause under investigation","Prematurity with neurological concern","Sepsis / Meningitis / Encephalitis","Intracerebral haemorrhage","Arterial ischaemic stroke","Metabolic / genetic encephalopathy","Post-cardiac surgery (CPB)","Other"]} />
          </Field>
          <Field label="Additional Neonatal Clinical Context">
            <TextArea value={r.neonatalContext} onChange={v=>set("neonatalContext",v)} disabled={readOnly}
              placeholder="Birth history, Apgar scores, cord pH, imaging, treatments..." />
          </Field>
        </Card>
      )}
    </div>
  );
}

function ModuleTechnical({ r, set, readOnly, userRole }) {
  const techDone = !!r.techCompletedBy;
  return (
    <div>
      <ModuleBanner color={T.blue} label="MODULE 3 — TECHNICAL DESCRIPTION" icon="🔧" />
      {userRole === "clinician" && !techDone && (
        <WarnBox text="Technical section has not yet been completed by the EEG technician. Awaiting technician input." />
      )}
      {userRole === "technician" && (
        <NoteBox text="Complete all technical fields before the reporting clinician reviews this EEG." color={T.blue} />
      )}
      <Card>
        <TwoCol>
          <Field label="Electrode System" required>
            <Select value={r.electrodeSystem} onChange={v=>set("electrodeSystem",v)} disabled={readOnly}
              options={["International 10-20 System (standard, ≥19 electrodes)","Extended 10-10 System (≥32 electrodes)","Reduced Neonatal Montage — ACNS 9-electrode","Modified montage (skull defect / surgical site)"]} />
          </Field>
          <Field label="Number of EEG Channels">
            <Input type="number" value={r.channelCount} onChange={v=>set("channelCount",v)} disabled={readOnly} />
          </Field>
          <Field label="Electrode Type">
            <Select value={r.electrodeType} onChange={v=>set("electrodeType",v)} disabled={readOnly}
              options={["Standard cup / disc electrodes (collodion or paste)","Collodion-applied (long-term monitoring)","Corkscrew / subdermal needle (ICU)","Disposable adhesive electrodes"]} />
          </Field>
          <Field label="Electrode Impedances">
            <Select value={r.impedances} onChange={v=>set("impedances",v)} disabled={readOnly}
              options={["All electrodes within acceptable range (<5 kΩ)","Majority within range; minor deviations","Multiple electrodes outside acceptable range"]} />
          </Field>
        </TwoCol>
        <Field label="Skull Defects / Modified Electrode Placement">
          <Input value={r.skullDefects} onChange={v=>set("skullDefects",v)} disabled={readOnly} placeholder="None / describe location and modification if applicable" />
        </Field>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.blue,marginBottom:12}}>Recording Parameters</div>
        <ThreeCol>
          <Field label="LFF (Hz)"><Input type="number" value={r.lff} onChange={v=>set("lff",v)} disabled={readOnly} placeholder="0.5–1" /></Field>
          <Field label="HFF (Hz)"><Input type="number" value={r.hff} onChange={v=>set("hff",v)} disabled={readOnly} placeholder="70" /></Field>
          <Field label="Notch Filter"><Select value={r.notch} onChange={v=>set("notch",v)} disabled={readOnly} options={["50 Hz","60 Hz","Off"]} /></Field>
          <Field label="Sensitivity (µV/mm)"><Input type="number" value={r.sensitivity} onChange={v=>set("sensitivity",v)} disabled={readOnly} placeholder="7–10" /></Field>
          <Field label="Display Speed (mm/s)"><Input type="number" value={r.speed} onChange={v=>set("speed",v)} disabled={readOnly} placeholder="30" /></Field>
          <Field label="Sampling Rate (Hz)"><Input type="number" value={r.samplingRate} onChange={v=>set("samplingRate",v)} disabled={readOnly} placeholder="256" /></Field>
        </ThreeCol>
        <TwoCol>
          <Field label="Total Recording Duration (min)"><Input type="number" value={r.totalDuration} onChange={v=>set("totalDuration",v)} disabled={readOnly} /></Field>
          <Field label="Interpretable Duration (min)"><Input type="number" value={r.interpretableDuration} onChange={v=>set("interpretableDuration",v)} disabled={readOnly} /></Field>
        </TwoCol>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.blue,marginBottom:12}}>Ancillary Channels</div>
        <TwoCol>
          <Field label="Single-Channel ECG"><Select value={r.ecg} onChange={v=>set("ecg",v)} disabled={readOnly} options={["Present (standard)","Absent — document reason"]} /></Field>
          <Field label="Video Recording"><Select value={r.video} onChange={v=>set("video",v)} disabled={readOnly} options={["Present — continuous, time-locked","Present — partial","Absent"]} /></Field>
        </TwoCol>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.blue,marginBottom:12}}>Activating Procedures</div>
        <TwoCol>
          <Field label="Hyperventilation (HV)">
            <Select value={r.hv} onChange={v=>set("hv",v)} disabled={readOnly}
              options={["Performed — adequate effort","Performed — poor effort","Not performed — medical contraindication","Not performed — refused/unable","Not applicable — age <3 years"]} />
          </Field>
          <Field label="HV Response">
            <Select value={r.hvResponse} onChange={v=>set("hvResponse",v)} disabled={readOnly}
              options={["No significant change","Symmetrical build-up (normal)","Augmentation of epileptiform discharges","Absence seizure triggered","Focal slowing accentuated","Asymmetric response (abnormal)"]} />
          </Field>
          <Field label="Intermittent Photic Stimulation">
            <Select value={r.ips} onChange={v=>set("ips",v)} disabled={readOnly}
              options={["Performed — standard frequencies (1–60 Hz)","Not performed — age <6 months","Not performed — other reason"]} />
          </Field>
          <Field label="IPS Response">
            <Select value={r.ipsResponse} onChange={v=>set("ipsResponse",v)} disabled={readOnly}
              options={["No photoparoxysmal response","Photic driving only (normal)","Photoparoxysmal response — occipital","Photoparoxysmal response — generalised","Self-sustaining photoparoxysmal response"]} />
          </Field>
        </TwoCol>
        <Field label="Sleep Achieved">
          <Select value={r.sleepAchieved} onChange={v=>set("sleepAchieved",v)} disabled={readOnly}
            options={["Natural spontaneous sleep","Post-sedation sleep","Drowsiness only","No sleep achieved"]} />
        </Field>
        <Field label="Activating Procedure Notes">
          <TextArea value={r.activatingNotes} onChange={v=>set("activatingNotes",v)} disabled={readOnly} placeholder="IPS frequencies that elicited response; quality of HV effort; sleep stages attained..." />
        </Field>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.blue,marginBottom:12}}>Technical Quality & Artefact</div>
        <Field label="Overall Technical Quality" required>
          <Select value={r.techQuality} onChange={v=>set("techQuality",v)} disabled={readOnly}
            options={["Good — minimal artefact throughout","Acceptable — intermittent artefact, interpretation not affected","Limited — significant artefact affecting portions of record","Poor — extensive artefact limiting interpretation"]} />
        </Field>
        <Field label="Predominant Artefact Types (select all present)">
          <MultiSelect options={["Muscle/EMG","Movement","ECG/Pulse","Electrode pop","Eye movement/blink","Ventilator/equipment","50/60 Hz interference","Sweat","Phototherapy","IV pump"]}
            selected={r.artefacts} onChange={v=>set("artefacts",v)} />
        </Field>
        <Field label="Artefact Impact on Interpretation">
          <TextArea value={r.artefactImpact} onChange={v=>set("artefactImpact",v)} disabled={readOnly} rows={2}
            placeholder="Specify channels affected, time periods, and whether any features are uninterpretable..." />
        </Field>
        <Field label="Additional Technical Notes">
          <TextArea value={r.techNotes} onChange={v=>set("techNotes",v)} disabled={readOnly} rows={2} />
        </Field>
      </Card>
    </div>
  );
}

function ModuleBackground({ r, set, readOnly }) {
  const neo = isNeonatal(r.dob, r.ga);
  const pdr = getPDRReference(r.dob);
  const pma = getPMA(r.dob, r.ga);

  if (neo) return (
    <div>
      <ModuleBanner color={T.orange} label="MODULE 4B — EEG BACKGROUND (NEONATAL)" icon="🧠" />
      {pma && (
        <NoteBox color={T.orange} text={`PMA: ${pma} weeks. Normal IBI maximum for this PMA: ${pma < 30 ? "≤35 s" : pma < 33 ? "≤20 s" : pma < 37 ? "≤10 s" : pma <= 40 ? "≤6 s" : "≤4 s"}. IBI voltage <5 µV pp = burst suppression criterion.`} />
      )}
      <Card>
        <Field label="Continuity Pattern" required>
          <Select value={r.continuityNeo} onChange={v=>set("continuityNeo",v)} disabled={readOnly}
            options={["Continuous (IBI <2 s, normal term)","Activité moyenne (normal waking/active sleep, term)","Tracé alternant (normal quiet sleep, 34–46 wks)","Tracé discontinu (normal for PMA)","Excessive discontinuity (IBI prolonged for PMA)","Burst suppression (IBI <5 µV pp, invariant, unreactive)","Low voltage suppressed (<10 µV pp)","Electrocerebral inactivity"]} />
        </Field>
        <TwoCol>
          <Field label="Typical IBI Duration (seconds)"><Input type="number" value={r.ibiDuration} onChange={v=>set("ibiDuration",v)} disabled={readOnly} /></Field>
          <Field label="IBI Duration Range (sec)"><Input value={r.ibiRange} onChange={v=>set("ibiRange",v)} disabled={readOnly} placeholder="e.g. 4–8" /></Field>
        </TwoCol>
        <Field label="IBI Voltage">
          <Select value={r.ibiVoltage} onChange={v=>set("ibiVoltage",v)} disabled={readOnly}
            options={["≥25 µV pp (normal at term)","10–25 µV pp (borderline)","<10 µV pp (suppressed)","<5 µV pp (burst suppression criterion)"]} />
        </Field>
        <Field label="Continuity Assessment vs PMA" required>
          <Select value={r.continuityAssessNeo} onChange={v=>set("continuityAssessNeo",v)} disabled={readOnly}
            options={["Normal for stated PMA and state","Mildly abnormal — IBI marginally prolonged","Moderately abnormal — IBI clearly prolonged","Severely abnormal — markedly prolonged or burst suppression","Cannot assess reliably"]} />
        </Field>
        <Field label="Continuity Free Text">
          <TextArea value={r.continuityFreeTextNeo} onChange={v=>set("continuityFreeTextNeo",v)} disabled={readOnly}
            placeholder="Describe burst content, variability across states, burst duration, IBI character..." />
        </Field>
      </Card>

      <Card>
        <TwoCol>
          <Field label="Interhemispheric Symmetry" required>
            <Select value={r.symmetryNeo} onChange={v=>set("symmetryNeo",v)} disabled={readOnly}
              options={["Symmetric","Mild asymmetry — <2:1 voltage (uncertain significance)","Marked asymmetry — ≥2:1 voltage (abnormal)","Asymmetry in frequency / graphoelement pattern"]} />
          </Field>
          <Field label="Side of Asymmetry">
            <Select value={r.asymmetrySideNeo} onChange={v=>set("asymmetrySideNeo",v)} disabled={readOnly}
              options={["Not applicable","Left hemisphere lower","Right hemisphere lower","Variable"]} />
          </Field>
          <Field label="Interhemispheric Synchrony" required>
            <Select value={r.synchronyNeo} onChange={v=>set("synchronyNeo",v)} disabled={readOnly}
              options={["Normal synchrony for PMA (>90% at term)","Normal physiological asynchrony for PMA (29–37 wks)","Abnormal asynchrony — excessive for PMA"]} />
          </Field>
          <Field label="Estimated % Synchronous Bursts"><Input type="number" value={r.pctSynchronous} onChange={v=>set("pctSynchronous",v)} disabled={readOnly} placeholder="e.g. 85" /></Field>
        </TwoCol>
        <Field label="Symmetry & Synchrony Free Text">
          <TextArea value={r.symmetryFreeTextNeo} onChange={v=>set("symmetryFreeTextNeo",v)} disabled={readOnly} rows={2} />
        </Field>
      </Card>

      <Card>
        <TwoCol>
          <Field label="Background Voltage" required>
            <Select value={r.voltageNeo} onChange={v=>set("voltageNeo",v)} disabled={readOnly}
              options={["Normal — ≥25 µV pp in all states","Borderline low — 10–25 µV pp, normal features present","Abnormally low — <10 µV pp, no normal features","Burst suppression voltage (<5 µV IBI)","Electrocerebral inactivity"]} />
          </Field>
          <Field label="Burst Voltage Range (µV pp)"><Input value={r.burstVoltageNeo} onChange={v=>set("burstVoltageNeo",v)} disabled={readOnly} placeholder="e.g. 50–200" /></Field>
          <Field label="Variability" required>
            <Select value={r.variability} onChange={v=>set("variability",v)} disabled={readOnly}
              options={["Yes — normal variability (EEG changes with state transitions)","No — invariant pattern (abnormal)","Unclear"]} />
          </Field>
          <Field label="Reactivity" required>
            <Select value={r.reactivityNeo} onChange={v=>set("reactivityNeo",v)} disabled={readOnly}
              options={["Yes — clear reactivity to stimulation","No — unreactive","Unclear"]} />
          </Field>
        </TwoCol>
        <Field label="Reactivity Description">
          <TextArea value={r.reactivityDescNeo} onChange={v=>set("reactivityDescNeo",v)} disabled={readOnly} rows={2}
            placeholder="Stimulus type used; nature of EEG response..." />
        </Field>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.orange,marginBottom:12}}>Behavioural States</div>
        <Field label="States Identified">
          <MultiSelect options={["Awake","Active sleep (REM)","Quiet sleep (non-REM)","Transitional sleep","Indeterminate sleep","Cannot define states"]}
            selected={r.statesNeo} onChange={v=>set("statesNeo",v)} />
        </Field>
        <Field label="Sleep-Wake Cycling" required>
          <Select value={r.sleepCyclingNeo} onChange={v=>set("sleepCyclingNeo",v)} disabled={readOnly}
            options={["Present and age-appropriate","Present but abnormal (specify below)","Absent","Unclear / not assessable"]} />
        </Field>
        <Field label="Cycling Notes">
          <TextArea value={r.sleepCyclingNotesNeo} onChange={v=>set("sleepCyclingNotesNeo",v)} disabled={readOnly} rows={2} />
        </Field>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.orange,marginBottom:8}}>Normal Graphoelements</div>
        {pma && <NoteBox color={T.orange} text={`Expected at ${pma} wks PMA: ${pma < 30 ? "Monorhythmic delta, delta brushes, rhythmic temporal theta" : pma < 34 ? "Delta brushes (peak), rhythmic temporal theta, anterior dysrhythmia" : pma < 37 ? "Anterior dysrhythmia, encoches frontales, diminishing delta brushes" : "Encoches frontales, anterior dysrhythmia (diminishing)"}`} />}
        {[
          ["Monorhythmic Delta Activity (24–34 wks)", "monorhythmicDelta", ["Present and normal","Present but atypical (specify)","Absent — expected at this PMA","Not expected at this PMA"]],
          ["Delta Brushes / Beta-Delta Complexes (24–36 wks; peak 32–34 wks)", "deltaBrushes", ["Present and normal","Present but excessive (consider NMDAR encephalitis at term)","Absent — expected at this PMA","Not expected at this PMA"]],
          ["Rhythmic Temporal Theta (24–34 wks)", "rhythmicTempTheta", ["Present and normal","Present but atypical","Absent","Not expected at this PMA"]],
          ["Anterior Dysrhythmia (32–44 wks)", "anteriorDysrhythmia", ["Present and normal","Absent","Not expected at this PMA"]],
          ["Encoches Frontales (34–44 wks)", "encocheFrontales", ["Present and normal (synchronous, bifrontal)","Present but asymmetric (abnormal)","Absent — expected at this PMA","Not expected at this PMA"]],
        ].map(([label, key, opts]) => (
          <Field key={key} label={label}>
            <Select value={r[key]} onChange={v=>set(key,v)} disabled={readOnly} options={opts} />
          </Field>
        ))}
        <Field label="Graphoelement Free Text">
          <TextArea value={r.graphoFreeText} onChange={v=>set("graphoFreeText",v)} disabled={readOnly} rows={2}
            placeholder="Describe unexpected absences, asymmetries, or abnormal features of graphoelements..." />
        </Field>
      </Card>

      <Card>
        <TwoCol>
          <Field label="EEG Maturity Assessment vs PMA" required>
            <Select value={r.eegMaturity} onChange={v=>set("eegMaturity",v)} disabled={readOnly}
              options={["Normal maturity for stated PMA","Mildly dysmature (~1–2 weeks behind PMA)","Significantly dysmature (>2 weeks behind PMA — abnormal)","Cannot assess reliably"]} />
          </Field>
          <Field label="Estimated EEG Age (weeks PMA, if dysmature)">
            <Input type="number" value={r.eegAge} onChange={v=>set("eegAge",v)} disabled={readOnly} />
          </Field>
        </TwoCol>
        <Field label="Overall Neonatal Background Grade" required>
          <Select value={r.bgGradeNeo} onChange={v=>set("bgGradeNeo",v)} disabled={readOnly}
            options={["Normal for PMA and state","Mildly abnormal","Moderately abnormal","Severely abnormal","Burst suppression","Low voltage suppressed","Electrocerebral inactivity"]} />
        </Field>
        <Field label="Neonatal Background Narrative" required accent={T.green}>
          <TextArea value={r.bgNarrativeNeo} onChange={v=>set("bgNarrativeNeo",v)} disabled={readOnly} rows={5}
            placeholder="REQUIRED: Full descriptive paragraph integrating all background features for this PMA and state. Describe continuity, symmetry, synchrony, graphoelements, and overall grade." />
        </Field>
      </Card>
    </div>
  );

  return (
    <div>
      <ModuleBanner color={T.green} label="MODULE 4A — EEG BACKGROUND" icon="🧠" />
      {pdr && (
        <NoteBox color={T.green} text={`PDR REFERENCE for this age: Expected ${pdr.range}. Abnormal if <${pdr.min} Hz. ${pdr.note}.`} />
      )}
      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.green,marginBottom:12}}>Posterior Dominant Rhythm (PDR)</div>
        <TwoCol>
          <Field label="PDR Present" required>
            <Select value={r.pdr} onChange={v=>set("pdr",v)} disabled={readOnly}
              options={["Present","Absent","Unclear / not assessable"]} />
          </Field>
          <Field label="PDR Assessment vs Age">
            <Select value={r.pdrAssessment} onChange={v=>set("pdrAssessment",v)} disabled={readOnly}
              options={["Normal for age","Marginally slow (<0.5–1 Hz below expected)","Clearly slow (>1 Hz below expected)","Absent (abnormal)","Not assessable"]} />
          </Field>
          <Field label="PDR Frequency — Typical (Hz)">
            <Input type="number" value={r.pdrFreq} onChange={v=>set("pdrFreq",v)} disabled={readOnly} placeholder={pdr ? `Expected: ${pdr.range}` : ""} />
          </Field>
          <Field label="PDR Frequency Range (Hz)">
            <Input value={r.pdrFreqRange} onChange={v=>set("pdrFreqRange",v)} disabled={readOnly} placeholder="e.g. 8.5–10" />
          </Field>
          <Field label="PDR Reactivity">
            <Select value={r.pdrReactivity} onChange={v=>set("pdrReactivity",v)} disabled={readOnly}
              options={["Present — complete and symmetric attenuation","Present — partial attenuation","Present — asymmetric attenuation (abnormal)","Absent","Not tested"]} />
          </Field>
          <Field label="PDR Modulation">
            <Select value={r.pdrModulation} onChange={v=>set("pdrModulation",v)} disabled={readOnly}
              options={["Well modulated — consistent frequency and amplitude","Poorly modulated","Absent / cannot assess"]} />
          </Field>
        </TwoCol>
        <Field label="PDR Free Text">
          <TextArea value={r.pdrFreeText} onChange={v=>set("pdrFreeText",v)} disabled={readOnly} rows={2}
            placeholder="Describe amplitude, symmetry, persistence, associated posterior slow waves, asymmetry in reactivity..." />
        </Field>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.green,marginBottom:12}}>Background Frequency & Organisation</div>
        <TwoCol>
          <Field label="Predominant Background Frequency" required>
            <Select value={r.bgFreq} onChange={v=>set("bgFreq",v)} disabled={readOnly}
              options={["Beta (>13 Hz)","Alpha (8–13 Hz)","Theta (4–8 Hz)","Delta (<4 Hz)","Mixed (describe in free text)"]} />
          </Field>
          <Field label="Background Organisation">
            <Select value={r.bgOrg} onChange={v=>set("bgOrg",v)} disabled={readOnly}
              options={["Well organised for age","Mildly disorganised","Moderately disorganised","Severely disorganised"]} />
          </Field>
          <Field label="Theta/Delta Slowing Distribution">
            <Select value={r.thetaDelta} onChange={v=>set("thetaDelta",v)} disabled={readOnly}
              options={["Not present","Generalised (diffuse), symmetric","Generalised, frontally predominant","Focal (specify region in free text)","Lateralised (specify side in free text)","FIRDA","OIRDA","TIRDA"]} />
          </Field>
          <Field label="Beta Activity">
            <Select value={r.beta} onChange={v=>set("beta",v)} disabled={readOnly}
              options={["Normal","Excess generalised beta — medication effect likely","Excess frontal beta","Asymmetric — reduced left","Asymmetric — reduced right"]} />
          </Field>
        </TwoCol>
        <Field label="Background Frequency Free Text">
          <TextArea value={r.bgFreqFreeText} onChange={v=>set("bgFreqFreeText",v)} disabled={readOnly} rows={3}
            placeholder="Describe dominant frequencies, amplitude, symmetry, admixed frequencies, focal features. e.g., 'Continuous theta-delta 4–6 Hz, 30–60 µV, symmetric, with irregular delta admixed...'" />
        </Field>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.green,marginBottom:12}}>Continuity</div>
        <NoteBox text="ACNS 2021: Suppression = all activity <10 µV. Attenuation = ≥10 µV but <50% of background voltage." color={T.green} />
        <Field label="Continuity Classification" required>
          <Select value={r.continuity} onChange={v=>set("continuity",v)} disabled={readOnly}
            options={["Continuous — <1% of record suppressed or attenuated","Nearly continuous — 1–9% suppressed or attenuated","Discontinuous — 10–49% suppressed or attenuated","Burst suppression — 50–99% suppressed (<10 µV IBI)","Burst attenuation — 50–99% attenuated (≥10 µV IBI)","Suppression — >99% of record <10 µV","Attenuation — >99% attenuated but >10 µV"]} />
        </Field>
        {(r.continuity?.includes("Burst") || r.continuity?.includes("Discontinuous")) && (
          <TwoCol>
            <Field label="Suppression/Attenuation Percent (%)">
              <Input type="number" value={r.suppressionPct} onChange={v=>set("suppressionPct",v)} disabled={readOnly} />
            </Field>
            <Field label="Typical Burst Duration (sec)">
              <Input value={r.bsBurstDuration} onChange={v=>set("bsBurstDuration",v)} disabled={readOnly} placeholder="e.g. 1–3 sec" />
            </Field>
            <Field label="Typical Interburst Interval (sec)">
              <Input value={r.bsIBI} onChange={v=>set("bsIBI",v)} disabled={readOnly} placeholder="e.g. 5–12 sec" />
            </Field>
            <Field label="Burst Content — Sharpness">
              <Select value={r.bsSharpness} onChange={v=>set("bsSharpness",v)} disabled={readOnly}
                options={["Blunt / sinusoidal","Sharply contoured delta","Epileptiform (sharp waves within bursts)","Highly epileptiform bursts (≥2 spikes per burst at ≥1 Hz in >50% of bursts)"]} />
            </Field>
            <Field label="Identical Bursts">
              <Select value={r.identicalBursts} onChange={v=>set("identicalBursts",v)} disabled={readOnly}
                options={["Present — first 0.5s visually similar in >90% of bursts","Absent — variable morphology"]} />
            </Field>
          </TwoCol>
        )}
        <Field label="Continuity Free Text">
          <TextArea value={r.continuityFreeText} onChange={v=>set("continuityFreeText",v)} disabled={readOnly} rows={2}
            placeholder="Describe burst composition, any evolving features, typical burst/IBI durations..." />
        </Field>
      </Card>

      <Card>
        <TwoCol>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:T.green,marginBottom:12}}>Symmetry</div>
            <Field label="Interhemispheric Symmetry" required>
              <Select value={r.symmetry} onChange={v=>set("symmetry",v)} disabled={readOnly}
                options={["Symmetric","Mild asymmetry — voltage <50% or frequency 0.5–1 Hz difference","Marked asymmetry — voltage ≥50% or frequency >1 Hz difference"]} />
            </Field>
            <Field label="Side of Asymmetry">
              <Select value={r.asymmetrySide} onChange={v=>set("asymmetrySide",v)} disabled={readOnly}
                options={["Not applicable","Left hemisphere lower/slower","Right hemisphere lower/slower","Variable"]} />
            </Field>
            <TwoCol>
              <Field label="Voltage Difference (%)"><Input type="number" value={r.voltageDiff} onChange={v=>set("voltageDiff",v)} disabled={readOnly} /></Field>
              <Field label="Frequency Difference (Hz)"><Input type="number" value={r.freqDiff} onChange={v=>set("freqDiff",v)} disabled={readOnly} /></Field>
            </TwoCol>
            <Field label="Breach Effect">
              <Select value={r.breachEffect} onChange={v=>set("breachEffect",v)} disabled={readOnly}
                options={["Absent","Present (specify location in notes)","Unclear"]} />
            </Field>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:T.green,marginBottom:12}}>Voltage & AP Gradient</div>
            <Field label="Background Voltage" required>
              <Select value={r.bgVoltage} onChange={v=>set("bgVoltage",v)} disabled={readOnly}
                options={["High (≥150 µV)","Normal (20–150 µV)","Low (10 to <20 µV)","Suppressed (<10 µV)"]} />
            </Field>
            <Field label="Estimated Voltage Range (µV)">
              <Input value={r.bgVoltageRange} onChange={v=>set("bgVoltageRange",v)} disabled={readOnly} placeholder="e.g. 40–80" />
            </Field>
            <Field label="AP Gradient" required>
              <Select value={r.apGradient} onChange={v=>set("apGradient",v)} disabled={readOnly}
                options={["Present (normal)","Absent","Reversed (abnormal)"]} />
            </Field>
          </div>
        </TwoCol>
        <Field label="Symmetry & Voltage Free Text">
          <TextArea value={r.symmetryFreeText} onChange={v=>set("symmetryFreeText",v)} disabled={readOnly} rows={2}
            placeholder="Specify electrode pairs showing asymmetry, character (voltage vs frequency), voltage notes..." />
        </Field>
      </Card>

      <Card>
        <TwoCol>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:T.green,marginBottom:12}}>Reactivity</div>
            <Field label="Reactivity to Stimulation" required>
              <Select value={r.reactivity} onChange={v=>set("reactivity",v)} disabled={readOnly}
                options={["Reactive — clear change with stimulation","SIRPIDs only","Unreactive","Unclear","Unknown / not tested"]} />
            </Field>
            <Field label="Stimulus Types Used">
              <MultiSelect options={["Auditory","Light tactile","Noxious — sternal rub","Noxious — nailbed","Airway suction","Patient care","Not tested"]}
                selected={r.stimType || []} onChange={v=>set("stimType",v)} />
            </Field>
            <Field label="Reactivity Description">
              <TextArea value={r.reactivityDesc} onChange={v=>set("reactivityDesc",v)} disabled={readOnly} rows={2}
                placeholder="Nature of reactivity: which band changed, duration of response, any asymmetry..." />
            </Field>
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:T.green,marginBottom:12}}>State Changes & Sleep</div>
            <Field label="State Changes" required>
              <Select value={r.stateChanges} onChange={v=>set("stateChanges",v)} disabled={readOnly}
                options={["Present — with normal N2 sleep transients (spindles + K-complexes)","Present — with abnormal N2 transients","Present — without N2 transients","Absent"]} />
            </Field>
            <Field label="Sleep Spindles">
              <Select value={r.spindles} onChange={v=>set("spindles",v)} disabled={readOnly}
                options={["Present and normal (symmetric, 12–14 Hz, central)","Present but asymmetric (abnormal)","Present but abnormal frequency/morphology","Absent"]} />
            </Field>
            <Field label="K-Complexes">
              <Select value={r.kComplex} onChange={v=>set("kComplex",v)} disabled={readOnly}
                options={["Present and normal","Present but abnormal","Absent"]} />
            </Field>
            <Field label="Posterior Slow Waves of Youth (PSWY)">
              <Select value={r.pswy} onChange={v=>set("pswy",v)} disabled={readOnly}
                options={["Present — normal for age (6–16 yrs)","Excessive for age","Absent","Not applicable"]} />
            </Field>
            <Field label="Hypnagogic Hypersynchrony">
              <Select value={r.hypnagogicHyp} onChange={v=>set("hypnagogicHyp",v)} disabled={readOnly}
                options={["Present — normal for age (<3–4 yrs)","Absent","Not applicable (age >4 yrs)"]} />
            </Field>
          </div>
        </TwoCol>
        <Field label="Sleep Architecture Free Text">
          <TextArea value={r.sleepFreeText} onChange={v=>set("sleepFreeText",v)} disabled={readOnly} rows={2}
            placeholder="Describe sleep stages attained, quality of transitions, CAPE if present..." />
        </Field>
      </Card>

      <Card style={{borderColor:T.green}}>
        <Field label="Overall Background Classification" required accent={T.green}>
          <Select value={r.bgClassification} onChange={v=>set("bgClassification",v)} disabled={readOnly}
            options={["Normal for age and state","Mildly abnormal — mild diffuse cerebral dysfunction","Moderately abnormal — moderate diffuse cerebral dysfunction","Severely abnormal — severe diffuse cerebral dysfunction","Abnormal — focal dysfunction (specify in narrative)","Abnormal — lateralised asymmetry (specify in narrative)","Burst suppression — pharmacological","Burst suppression — non-pharmacological","Suppression / Electrocerebral inactivity","Indeterminate"]} />
        </Field>
        <Field label="Background Narrative" required accent={T.green}>
          <TextArea value={r.bgNarrative} onChange={v=>set("bgNarrative",v)} disabled={readOnly} rows={6}
            placeholder="REQUIRED: Full descriptive paragraph. Example: 'The background EEG during wakefulness shows a posterior dominant rhythm at 8 Hz, normal for age. There is an anterior-posterior gradient. Continuity is continuous. Background is symmetric. Reactivity to eye opening is present and symmetric. Sleep spindles and K-complexes are present and normal. Overall background is normal for age and state.'" />
        </Field>
      </Card>
    </div>
  );
}

function ModuleIEDs({ r, set, readOnly }) {
  return (
    <div>
      <ModuleBanner color={T.red} label="MODULE 5 — INTERICTAL EPILEPTIFORM DISCHARGES" icon="⚡" />
      <NoteBox color={T.red} text="IEDs defined per IFCN (Kane 2017): transient EEG activity clearly distinguishable from background, with ≥4 of 6 IFCN criteria: (1) Sharp/spiky morphology 20–200 ms; (2) Duration differs from background; (3) Waveform asymmetry (steep ascending slope); (4) After-going slow wave; (5) Background disruption; (6) Physiological field distribution." />
      <Card>
        <Field label="Interictal Epileptiform Discharges" required>
          <Select value={r.iedPresence} onChange={v=>set("iedPresence",v)} disabled={readOnly}
            options={["Absent — no epileptiform discharges identified","Present — complete Sections below","Uncertain / borderline — sharply contoured but not clearly epileptiform"]} />
        </Field>
      </Card>

      {r.iedPresence?.startsWith("Present") && (
        <>
          <Card>
            <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:12}}>Morphology</div>
            <Field label="Primary IED Morphology Type" required>
              <Select value={r.iedMorphology} onChange={v=>set("iedMorphology",v)} disabled={readOnly}
                options={["Spike (20–70 ms, apiculate, clearly distinct from background)","Sharp wave (70–200 ms, pointed peak, asymmetric waveform)","Polyspike (2+ spikes in rapid succession, <500 ms)","Spike-and-slow-wave complex (spike + coupled aftergoing slow wave)","Sharp-and-slow-wave complex (sharp wave + coupled slow wave)","Polyspike-and-slow-wave complex","Slow spike-wave (<2.5 Hz — Lennox-Gastaut spectrum)","Generalised spike-wave at 3 Hz (absence epilepsy pattern)","Generalised spike-wave at other frequency (specify below)"]} />
            </Field>
            <TwoCol>
              <Field label="Sharpness of Spike/Sharp Component">
                <Select value={r.iedSharpness} onChange={v=>set("iedSharpness",v)} disabled={readOnly}
                  options={["Spiky — duration at baseline <70 ms","Sharp — 70–200 ms","Sharply contoured — steep slope, duration >200 ms","Mixed / variable (describe in free text)"]} />
              </Field>
              <Field label="Spike/Sharp Component Duration (ms)">
                <Input type="number" value={r.iedDuration} onChange={v=>set("iedDuration",v)} disabled={readOnly} placeholder="e.g. 80" />
              </Field>
              <Field label="Aftergoing Slow Wave">
                <Select value={r.iedSlowWave} onChange={v=>set("iedSlowWave",v)} disabled={readOnly}
                  options={["Present and prominent","Present but subtle","Absent"]} />
              </Field>
              <Field label="Slow Wave Duration (ms)">
                <Input type="number" value={r.iedSlowWaveDuration} onChange={v=>set("iedSlowWaveDuration",v)} disabled={readOnly} placeholder="e.g. 300" />
              </Field>
              <Field label="Slow Wave Amplitude vs Spike">
                <Select value={r.iedSlowWaveAmplitude} onChange={v=>set("iedSlowWaveAmplitude",v)} disabled={readOnly}
                  options={["Greater than spike amplitude","Similar to spike amplitude","Less than spike amplitude","Not applicable — no slow wave"]} />
              </Field>
              <Field label="Polarity (referential montage at maximum)">
                <Select value={r.iedPolarity} onChange={v=>set("iedPolarity",v)} disabled={readOnly}
                  options={["Surface-negative (typical)","Surface-positive (e.g., positive Rolandic sharp waves)","Dipolar / tangential","Unclear"]} />
              </Field>
              <Field label="Amplitude Category">
                <Select value={r.iedAmplitude} onChange={v=>set("iedAmplitude",v)} disabled={readOnly}
                  options={["Very low — <20 µV","Low — 20–49 µV","Medium — 50–149 µV","High — ≥150 µV"]} />
              </Field>
              <Field label="Estimated Amplitude (µV)">
                <Input type="number" value={r.iedAmplitudeValue} onChange={v=>set("iedAmplitudeValue",v)} disabled={readOnly} placeholder="peak-to-peak at maximum" />
              </Field>
            </TwoCol>
            <Field label="Waveform Consistency">
              <Select value={r.iedConsistency} onChange={v=>set("iedConsistency",v)} disabled={readOnly}
                options={["Stereotyped — highly consistent morphology","Relatively consistent with minor variations","Variable morphology"]} />
            </Field>
            <Field label="Morphology Free Text" required accent={T.red}>
              <TextArea value={r.iedMorphologyFreeText} onChange={v=>set("iedMorphologyFreeText",v)} disabled={readOnly} rows={4}
                placeholder="REQUIRED: Precise description. e.g., 'Negative sharp waves of 100–150 ms at baseline with prominent aftergoing slow wave of 300–400 ms. Amplitude 80–120 µV at maximum (C4). Steeply ascending and more gradually descending slope. Stereotyped morphology. Consistent horizontal dipole. Classic epileptiform sharp wave.'" />
            </Field>
          </Card>

          <Card>
            <TwoCol>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:12}}>Lateralisation</div>
                <Field label="Lateralisation" required>
                  <Select value={r.iedLateralisation} onChange={v=>set("iedLateralisation",v)} disabled={readOnly}
                    options={["Generalised — bilaterally synchronous, diffuse field","Left-lateralised — maximum on left","Right-lateralised — maximum on right","Bilateral independent — simultaneous independent each hemisphere","Midline — maximum at Fz/Cz/Pz","Multifocal — ≥3 independent foci"]} />
                </Field>
                {r.iedLateralisation?.startsWith("Generalised") && (
                  <Field label="Spatial Predominance">
                    <Select value={r.iedGeneralisedSubtype} onChange={v=>set("iedGeneralisedSubtype",v)} disabled={readOnly}
                      options={["Frontally predominant","Occipitally predominant","Midline predominant","Symmetric (NOS)"]} />
                  </Field>
                )}
                <Field label="Lateralisation Notes">
                  <TextArea value={r.iedLateralisationNotes} onChange={v=>set("iedLateralisationNotes",v)} disabled={readOnly} rows={2}
                    placeholder="Exceptions, variable lateralisation, bilateral patterns..." />
                </Field>
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:12}}>Localisation</div>
                <Field label="Region of Maximum Involvement" required>
                  <Select value={r.iedRegion} onChange={v=>set("iedRegion",v)} disabled={readOnly}
                    options={["Frontal (F) — bilateral / left / right","Frontal polar (Fp)","Fronto-central (F-C) — bilateral / left / right","Central / Rolandic (C) — bilateral / left / right","Centro-temporal (C-T) — bilateral / left / right","Temporal anterior — bilateral / left / right","Temporal mid (T7/T8) — bilateral / left / right","Temporal posterior (P7/P8) — bilateral / left / right","Parietal (P) — bilateral / left / right","Occipital (O) — bilateral / left / right","Parieto-occipital — bilateral / left / right","Vertex / Midline (Fz/Cz/Pz)","Hemispheric — left / right","Multifocal — describe in free text"]} />
                </Field>
                <Field label="Phase Reversal Electrode">
                  <Select value={r.iedPhaseReversal} onChange={v=>set("iedPhaseReversal",v)} disabled={readOnly}
                    options={["Fp1 or Fp2","F3 or F4","F7 or F8","C3 or C4","T3/T7 or T4/T8","T5/P7 or T6/P8","P3 or P4","O1 or O2","Fz","Cz","Pz","Multiple (specify in free text)","Generalised — no phase reversal"]} />
                </Field>
                <Field label="Field of Spread">
                  <Select value={r.iedField} onChange={v=>set("iedField",v)} disabled={readOnly}
                    options={["Restricted — 1–2 electrode pair(s)","Regional — one lobe","Extensive regional — adjacent lobes","Hemispheric","Bilateral (secondary spread)","Generalised / Diffuse"]} />
                </Field>
                <Field label="AP Lag (bilateral discharges)">
                  <Select value={r.iedApLag} onChange={v=>set("iedApLag",v)} disabled={readOnly}
                    options={["None — bilaterally synchronous","Anterior-to-posterior lag (A→P)","Posterior-to-anterior lag (P→A)","Not applicable"]} />
                </Field>
              </div>
            </TwoCol>
            <Field label="Localisation Free Text" required accent={T.red}>
              <TextArea value={r.iedLocalisationFreeText} onChange={v=>set("iedLocalisationFreeText",v)} disabled={readOnly} rows={3}
                placeholder="REQUIRED: Precise localisation. e.g., 'Phase reversal at C4-T4. Regional field involving right central and posterior temporal electrodes (C4, T4, P4). Brief secondary spread to F4 in some discharges. No contralateral spread.'" />
            </Field>
          </Card>

          <Card>
            <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:12}}>Prevalence & State Relationship</div>
            <TwoCol>
              <Field label="Prevalence" required>
                <Select value={r.iedPrevalence} onChange={v=>set("iedPrevalence",v)} disabled={readOnly}
                  options={["Rare — <1% / <1 per hour","Occasional — ≥1/hour, <1/minute","Frequent — ≥1/minute, <1/10 seconds","Abundant — ≥1/10 seconds (not periodic)","Continuous / Persistent (see Module 6)"]} />
              </Field>
              <Field label="Estimated Rate">
                <Input value={r.iedRate} onChange={v=>set("iedRate",v)} disabled={readOnly} placeholder="e.g. ~3–5 per minute" />
              </Field>
              <Field label="Avg per 10-sec epoch (if abundant)">
                <Input type="number" value={r.iedPer10s} onChange={v=>set("iedPer10s",v)} disabled={readOnly} placeholder="ACNS 2021 recommendation" />
              </Field>
              <Field label="State Relationship">
                <Select value={r.iedState} onChange={v=>set("iedState",v)} disabled={readOnly}
                  options={["Wakefulness only","Sleep only (NREM)","All sleep stages","Both wake and sleep","Significantly increased in sleep","Increased in drowsiness","Suppressed in sleep","Activated by HV","Activated by IPS","Not assessable"]} />
              </Field>
            </TwoCol>
            <Field label="Prevalence & State Free Text">
              <TextArea value={r.iedPrevalenceFreeText} onChange={v=>set("iedPrevalenceFreeText",v)} disabled={readOnly} rows={2}
                placeholder="Quantify more precisely if possible. e.g., 'Rare in wakefulness (~1–2/min); frequent in NREM sleep (~5–6/min). Not in REM.'" />
            </Field>
          </Card>

          <Card>
            <div style={{fontWeight:700,fontSize:13,color:T.purple,marginBottom:12}}>Paediatric Syndrome-Specific Patterns</div>
            <TwoCol>
              <Field label="Hypsarrhythmia">
                <Select value={r.hypsarrhythmia} onChange={v=>set("hypsarrhythmia",v)} disabled={readOnly}
                  options={["Not present","Classic hypsarrhythmia","Modified hypsarrhythmia (with synchronous episodes)","Asymmetric hypsarrhythmia","Hypsarrhythmia in wakefulness only"]} />
              </Field>
              <Field label="Electrodecrement with Spasms">
                <Select value={r.electrodecrement} onChange={v=>set("electrodecrement",v)} disabled={readOnly}
                  options={["Present — time-locked to clinical spasms","Absent","Not applicable"]} />
              </Field>
              <Field label="CSWS / ESES">
                <Select value={r.csws} onChange={v=>set("csws",v)} disabled={readOnly}
                  options={["Not applicable","SWI ≥85% in NREM sleep (meets ESES criterion)","SWI 50–85% in NREM (borderline)","SWI <50% in NREM","Not formally calculated"]} />
              </Field>
              <Field label="Spike-Wave Index (%)"><Input type="number" value={r.swi} onChange={v=>set("swi",v)} disabled={readOnly} /></Field>
              <Field label="Centrotemporal Spikes (SeLECTS spectrum)">
                <Select value={r.centrotemporalSpikes} onChange={v=>set("centrotemporalSpikes",v)} disabled={readOnly}
                  options={["Present — typical (horizontal dipole, C-T region, sleep-activated, blunt morphology)","Present but atypical","Absent","Not applicable"]} />
              </Field>
              <Field label="Occipital Paroxysms">
                <Select value={r.occipitalParoxysms} onChange={v=>set("occipitalParoxysms",v)} disabled={readOnly}
                  options={["Present — fixation-off sensitive","Present — not fixation-off sensitive","Absent","Not applicable"]} />
              </Field>
            </TwoCol>
            <Field label="Syndrome Pattern Free Text">
              <TextArea value={r.syndromeFreeText} onChange={v=>set("syndromeFreeText",v)} disabled={readOnly} rows={2}
                placeholder="Features supporting or refuting a specific syndromic IED pattern..." />
            </Field>
          </Card>

          <Card style={{borderColor:T.red}}>
            <Field label="IED Comprehensive Summary" required accent={T.red}>
              <TextArea value={r.iedSummary} onChange={v=>set("iedSummary",v)} disabled={readOnly} rows={6}
                placeholder="REQUIRED: Integrate all IED findings. e.g., 'Frequent left centrotemporal spike-and-slow-wave discharges at ~5/min in wakefulness, increasing to ~10/min in NREM sleep. Phase reversal at C3-T3. Regional field (left central and anterior temporal). Blunt sharp wave component ~120 ms followed by prominent slow wave ~350 ms. Amplitude 80–130 µV at maximum. Horizontal dipole. No AP lag. Morphology typical for centrotemporal spike of SeLECTS.'" />
            </Field>
          </Card>

          <Card style={{borderColor: T.blue}}>
            <div style={{fontWeight:700,fontSize:13,color:T.blue,marginBottom:8}}>Response to Activation Procedures</div>
            <NoteBox color={T.blue} text="Document whether IEDs were provoked, augmented, or suppressed by each procedure. Complete only the procedures that were performed." />
            <TwoCol>
              <Field label="Response to Hyperventilation (HV)">
                <Select value={r.iedHvResponse} onChange={v=>set("iedHvResponse",v)} disabled={readOnly}
                  options={["Not performed / not applicable","No change in IED rate or distribution","IEDs increased in frequency during HV","IEDs markedly increased — HV highly activating","Absence seizure provoked by HV","IEDs suppressed during HV","New IED focus emerged during HV"]} />
              </Field>
              <Field label="Response to Intermittent Photic Stimulation (IPS)">
                <Select value={r.iedIpsResponse} onChange={v=>set("iedIpsResponse",v)} disabled={readOnly}
                  options={["Not performed / not applicable","No photoparoxysmal response","Occipital photoparoxysmal response (at/near stimulus frequency)","Generalised photoparoxysmal response (spreading beyond occipital)","Self-sustaining response (outlasts stimulus train)","IEDs suppressed during IPS"]} />
              </Field>
              <Field label="Response to Sleep / Drowsiness">
                <Select value={r.iedSleepResponse} onChange={v=>set("iedSleepResponse",v)} disabled={readOnly}
                  options={["Not assessable — no sleep recorded","No significant change with sleep","IEDs activated in drowsiness","IEDs activated in NREM sleep","IEDs activated in drowsiness and NREM sleep","IEDs suppressed in sleep","IEDs present in sleep only (not in wakefulness)","CSWS — continuous spike-wave in slow sleep (see syndrome fields)"]} />
              </Field>
              <Field label="Response to Eye Closure / Fixation Removal">
                <Select value={r.iedFixationResponse} onChange={v=>set("iedFixationResponse",v)} disabled={readOnly}
                  options={["Not tested","No change with eye closure or fixation removal","Fixation-off sensitive — IEDs appear or increase with fixation removal","IEDs suppressed by eye closure"]} />
              </Field>
            </TwoCol>
            <Field label="Activation Response Free Text">
              <TextArea value={r.iedActivationFreeText} onChange={v=>set("iedActivationFreeText",v)} disabled={readOnly} rows={2}
                placeholder="e.g., '3 Hz spike-wave bursts provoked within 15 sec of HV, resolving within 5 sec of stopping. No clinical correlate. IPS at 15 Hz evoked brief occipital photoparoxysmal response only.'" />
            </Field>
          </Card>
        </>
      )}
    </div>
  );
}

function ModuleRPP({ r, set, readOnly }) {
  return (
    <div>
      <ModuleBanner color={T.purple} label="MODULE 6 — RHYTHMIC & PERIODIC PATTERNS (RPPs) — ICU / Critical Care" icon="〰️" />
      <NoteBox color={T.purple} text="ACNS 2021: RPPs are named Main Term 1 (localisation) + Main Term 2 (pattern type) + Modifiers. Pattern must persist ≥6 consecutive cycles. Frequency >2.5 Hz with ≥10 s duration = ESz, not RPP. No RPP can be >4 Hz." />
      <Card>
        <Field label="Rhythmic or Periodic Patterns Present" required>
          <Select value={r.rppPresent} onChange={v=>set("rppPresent",v)} disabled={readOnly}
            options={["No RPPs identified","Yes — complete fields below"]} />
        </Field>
      </Card>
      {r.rppPresent === "Yes — complete fields below" && (
        <>
          <Card>
            <TwoCol>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:T.purple,marginBottom:12}}>Main Term 1: Localisation</div>
                <Field label="RPP Localisation" required>
                  <Select value={r.rppLocalisation} onChange={v=>set("rppLocalisation",v)} disabled={readOnly}
                    options={["G — Generalised (bilaterally synchronous and symmetric)","L — Lateralised (unilateral, bilateral-asymmetric, or bilateral-asynchronous)","BI — Bilateral Independent (simultaneous, independent, one each hemisphere)","UI — Unilateral Independent (two simultaneous independent patterns, same hemisphere)","Mf — Multifocal (≥3 simultaneous independent patterns)"]} />
                </Field>
                {r.rppLocalisation?.startsWith("G") && (
                  <Field label="Generalised Subtype">
                    <Select value={r.rppGSubtype} onChange={v=>set("rppGSubtype",v)} disabled={readOnly}
                      options={["Frontally predominant (anterior ≥50% greater than posterior)","Occipitally predominant","Midline predominant","Generalised NOS (symmetric)"]} />
                  </Field>
                )}
                {r.rppLocalisation?.startsWith("L") && (
                  <Field label="Lateralised Subtype">
                    <Select value={r.rppLSubtype} onChange={v=>set("rppLSubtype",v)} disabled={readOnly}
                      options={["Unilateral — confined to one hemisphere","Bilateral asymmetric — bilateral but consistently >80% amplitude on one side","Bilateral asynchronous — bilateral but consistently earlier on one side"]} />
                  </Field>
                )}
                <Field label="Side / Hemisphere of Predominance">
                  <Select value={r.rppSide} onChange={v=>set("rppSide",v)} disabled={readOnly}
                    options={["Left","Right","Not applicable (generalised/symmetric)"]} />
                </Field>
                <Field label="Lobes Most Involved">
                  <MultiSelect options={["Frontal","Temporal","Parietal","Occipital","Hemispheric"]}
                    selected={r.rppLobes || []} onChange={v=>set("rppLobes",v)} />
                </Field>
                {r.rppLSubtype?.includes("asynchronous") && (
                  <Field label="Bilateral Asynchrony Lag (ms)">
                    <Input type="number" value={r.rppAsynchronyLag} onChange={v=>set("rppAsynchronyLag",v)} disabled={readOnly} />
                  </Field>
                )}
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:T.purple,marginBottom:12}}>Main Term 2: Pattern Type</div>
                <Field label="RPP Pattern Type" required>
                  <Select value={r.rppType} onChange={v=>set("rppType",v)} disabled={readOnly}
                    options={["PD — Periodic Discharges (uniform morphology, CLEAR interdischarge interval, nearly regular)","RDA — Rhythmic Delta Activity (uniform morphology, NO interval, 0.5–4 Hz)","SW — Spike-and-wave or Sharp-and-wave (spike + slow wave, repeating, NO interval between complexes)"]} />
                </Field>
                <Field label="Pattern Type Notes">
                  <TextArea value={r.rppTypeNotes} onChange={v=>set("rppTypeNotes",v)} disabled={readOnly} rows={2}
                    placeholder="If PD+RDA simultaneously with equal prominence, code as PD+R. Note any ambiguity..." />
                </Field>
              </div>
            </TwoCol>
          </Card>

          <Card>
            <div style={{fontWeight:700,fontSize:13,color:T.purple,marginBottom:12}}>Modifiers (ACNS 2021)</div>
            <ThreeCol>
              <Field label="Prevalence" required>
                <Select value={r.rppPrevalence} onChange={v=>set("rppPrevalence",v)} disabled={readOnly}
                  options={["Continuous (≥90%)","Abundant (50–89%)","Frequent (10–49%)","Occasional (1–9%)","Rare (<1%)"]} />
              </Field>
              <Field label="Typical Episode Duration">
                <Select value={r.rppDuration} onChange={v=>set("rppDuration",v)} disabled={readOnly}
                  options={["Very brief (<10 s)","Brief (10–59 s)","Intermediate (1–9.9 min)","Long (10–59 min)","Very long (≥1 hour)"]} />
              </Field>
              <Field label="Longest Continuous Episode">
                <Input value={r.rppLongestEpisode} onChange={v=>set("rppLongestEpisode",v)} disabled={readOnly} placeholder="e.g. 4 min" />
              </Field>
              <Field label="Typical Frequency (dropdown)">
                <Select value={r.rppFreq} onChange={v=>set("rppFreq",v)} disabled={readOnly}
                  options={["<0.5 Hz","0.5 Hz","1.0 Hz","1.5 Hz","2.0 Hz","2.5 Hz","3.0 Hz (very brief only)","3.5 Hz (very brief only)","4.0 Hz (very brief only)"]} />
              </Field>
              <Field label="Measured Frequency (Hz)">
                <Input type="number" value={r.rppFreqMeasured} onChange={v=>set("rppFreqMeasured",v)} disabled={readOnly} placeholder="e.g. 1.2" />
              </Field>
              <Field label="Frequency Range (Hz)">
                <Input value={r.rppFreqRange} onChange={v=>set("rppFreqRange",v)} disabled={readOnly} placeholder="e.g. 0.8–1.5" />
              </Field>
              <Field label="Number of Phases (PD/SW only)">
                <Select value={r.rppPhases} onChange={v=>set("rppPhases",v)} disabled={readOnly}
                  options={["1 (monophasic)","2 (diphasic)","3 (triphasic)","≥4 (polyphasic)","Not applicable (RDA)"]} />
              </Field>
              <Field label="Sharpness (predominant phase)">
                <Select value={r.rppSharpness} onChange={v=>set("rppSharpness",v)} disabled={readOnly}
                  options={["Spiky (<70 ms)","Sharp (70–200 ms)","Sharply contoured (>200 ms, steep slope)","Blunt / sinusoidal"]} />
              </Field>
              <Field label="Amplitude">
                <Select value={r.rppAmplitudeAbs} onChange={v=>set("rppAmplitudeAbs",v)} disabled={readOnly}
                  options={["Very low (<20 µV)","Low (20–49 µV)","Medium (50–149 µV)","High (≥150 µV)"]} />
              </Field>
              <Field label="Estimated Amplitude (µV)">
                <Input type="number" value={r.rppAmplitudeValue} onChange={v=>set("rppAmplitudeValue",v)} disabled={readOnly} />
              </Field>
              <Field label="Relative Amplitude (PD only)">
                <Select value={r.rppAmplitudeRel} onChange={v=>set("rppAmplitudeRel",v)} disabled={readOnly}
                  options={[">2 (discharge stands out clearly from background)","≤2 (blends with background)","Not applicable"]} />
              </Field>
              <Field label="Polarity (PD and SW only)">
                <Select value={r.rppPolarity} onChange={v=>set("rppPolarity",v)} disabled={readOnly}
                  options={["Negative (surface-negative)","Positive (surface-positive)","Dipolar / tangential","Unclear"]} />
              </Field>
            </ThreeCol>
            <TwoCol>
              <Field label="Evolution">
                <Select value={r.rppEvolution} onChange={v=>set("rppEvolution",v)} disabled={readOnly}
                  options={["Static — no change in frequency, morphology, or location","Fluctuating — ≥3 changes within 1 min, not qualifying as evolving","Evolving — ≥2 sequential unidirectional changes (≤4 Hz and <10 s only)","Cannot assess"]} />
              </Field>
              <Field label="Plus (+) Modifier">
                <Select value={r.rppPlusModifier} onChange={v=>set("rppPlusModifier",v)} disabled={readOnly}
                  options={["None","+F — superimposed fast activity (theta or faster, not in background when RPP absent)","+R — superimposed rhythmic delta (PD only)","+S — superimposed sharp waves/spikes (RDA only)","+FR (PD only)","+FS (RDA only)"]} />
              </Field>
              <Field label="Extreme Delta Brush (EDB)">
                <Select value={r.rppEDB} onChange={v=>set("rppEDB",v)} disabled={readOnly}
                  options={["Not present","Definite EDB (abundant/continuous, stereotyped fast-delta relationship)","Possible EDB","Not applicable"]} />
              </Field>
              <Field label="Triphasic Morphology">
                <Select value={r.rppTriphasic} onChange={v=>set("rppTriphasic",v)} disabled={readOnly}
                  options={["No","Yes — negative-positive-negative; each phase longer; 2nd (positive) highest voltage; AP lag ≥100 ms"]} />
              </Field>
              <Field label="Onset Character">
                <Select value={r.rppOnset} onChange={v=>set("rppOnset",v)} disabled={readOnly}
                  options={["Sudden (<3 s to well-developed)","Gradual (>3 s)"]} />
              </Field>
              <Field label="Stimulus Relationship">
                <Select value={r.rppStimulus} onChange={v=>set("rppStimulus",v)} disabled={readOnly}
                  options={["Spontaneous only","Stimulus-Induced (SI-) — reproducibly brought about by alerting stimulus","Stimulus-Terminated (ST-) — reproducibly terminated by stimulus","Unknown / not tested"]} />
              </Field>
            </TwoCol>
            <Field label="RPP Free Text (use ACNS 2021 full notation)">
              <TextArea value={r.rppModifierFreeText} onChange={v=>set("rppModifierFreeText",v)} disabled={readOnly} rows={3}
                placeholder="e.g., 'Left temporal LPDs at 1.5 Hz (range 1.2–1.8 Hz), medium amplitude (~80 µV), sharp (120 ms), 3 phases, surface-negative, +F modifier (superimposed theta), abundant, fluctuating. AP lag absent. Consistent with IIC criterion A.'" />
            </Field>
          </Card>

          <Card style={{borderColor:T.red}}>
            <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:8}}>Ictal-Interictal Continuum (IIC) — ACNS 2021</div>
            <NoteBox color={T.red} text="IIC: patterns that do not qualify as ESz but may contribute to impaired alertness or neuronal injury. Synonymous with 'possible ESz'. Always requires clinical correlation." />
            <Field label="IIC Assessment" required>
              <Select value={r.iicAssessment} onChange={v=>set("iicAssessment",v)} disabled={readOnly}
                options={["Not on IIC — pattern does not meet any IIC criterion","IIC Criterion A: PD or SW >1.0 Hz and ≤2.5 Hz over 10 s (>10 and ≤25 discharges/10 s)","IIC Criterion B: PD or SW ≥0.5 Hz and ≤1.0 Hz over 10 s AND plus modifier or fluctuation","IIC Criterion C: Lateralised RDA >1 Hz for ≥10 s AND plus modifier or fluctuation","Possible ECSE: IIC pattern ≥10 continuous min or >20% of 60 min, EEG but not clinical improvement after ASM","Uncertain — borderline, requires clinical correlation","Not applicable — pattern already qualifies as ESz/ESE"]} />
            </Field>
            <Field label="IIC Free Text">
              <TextArea value={r.iicFreeText} onChange={v=>set("iicFreeText",v)} disabled={readOnly} rows={2}
                placeholder="Which criterion is met, typical frequency, prevalence, clinical context, ASM response..." />
            </Field>
          </Card>
        </>
      )}
    </div>
  );
}

function ModuleIctal({ r, set, readOnly }) {
  return (
    <div>
      <ModuleBanner color={T.red} label="MODULE 7 — ICTAL EPISODES" icon="🌩️" />
      <NoteBox color={T.red} text="ESz: EDs >2.5 Hz for ≥10 s, OR definite evolution lasting ≥10 s. ECSz: any EEG pattern with time-locked clinical correlate (any duration), OR EEG+clinical improvement after parenteral ASM. ESE: ESz ≥10 min or >20% of any 60-min period. Neonatal seizure: repetitive evolving pattern, ≥2 µV, ≥10 s." />
      <Card>
        <Field label="Type of Ictal Events Recorded" required>
          <MultiSelect
            options={["None recorded","Electrographic Seizure(s) only (ESz) — no clinical correlate","Electroclinical Seizure(s) (ECSz) — with clinical correlate","Both ESz and ECSz","Electrographic Status Epilepticus (ESE)","Electroclinical Status Epilepticus (ECSE)","Convulsive ECSE (bilateral tonic-clonic ≥5 min)","Possible ECSE (IIC meeting SE duration, EEG but no clinical response)","Epileptic spasms with electrodecrement","Neonatal electrographic seizures"]}
            selected={r.ictalType || []} onChange={v=>set("ictalType",v)} />
        </Field>
        <Field label="Total Seizures Recorded">
          <Input type="number" value={r.seizureCount} onChange={v=>set("seizureCount",v)} disabled={readOnly} />
        </Field>
      </Card>

      <Card style={{borderColor: T.blue}}>
        <div style={{fontWeight:700,fontSize:13,color:T.blue,marginBottom:8}}>Response to Activation Procedures</div>
        <NoteBox color={T.blue} text="Document whether ictal events were provoked, triggered, or modified by activation procedures or clinical circumstances during this recording. Complete only the procedures performed." />
        <TwoCol>
          <Field label="Seizures Provoked by Hyperventilation">
            <Select value={r.ictalHvResponse} onChange={v=>set("ictalHvResponse",v)} disabled={readOnly}
              options={["Not performed / not applicable","No seizures provoked by HV","Typical absence seizure(s) provoked by HV","Focal seizure provoked by HV","Generalised seizure provoked by HV","Seizure threshold lowered (increased ictal activity after HV)"]} />
          </Field>
          <Field label="Seizures Provoked by Photic Stimulation (IPS)">
            <Select value={r.ictalIpsResponse} onChange={v=>set("ictalIpsResponse",v)} disabled={readOnly}
              options={["Not performed / not applicable","No seizures provoked by IPS","Self-sustaining photoparoxysmal seizure provoked","Myoclonic seizure provoked by IPS","Generalised tonic-clonic seizure provoked by IPS","Focal occipital seizure provoked by IPS"]} />
          </Field>
          <Field label="Seizures During Sleep">
            <Select value={r.ictalSleepResponse} onChange={v=>set("ictalSleepResponse",v)} disabled={readOnly}
              options={["Not assessable — no sleep recorded","No seizures during sleep","Seizures occurred exclusively from sleep","Seizures from both sleep and wakefulness","Seizure frequency increased in sleep","Seizure frequency decreased in sleep","Hypermotor seizures from NREM sleep (consider NFLE / SHE)"]} />
          </Field>
          <Field label="Other Provocative Factors">
            <Select value={r.ictalOtherProvocation} onChange={v=>set("ictalOtherProvocation",v)} disabled={readOnly}
              options={["No clear precipitants identified","Seizures provoked by startle","Seizures provoked by somatosensory stimulus","Seizures provoked by reading / pattern","Seizures occurring on awakening","Seizures provoked by emotional stimulus","Seizures provoked by fever / temperature change","Seizures following medication administration"]} />
          </Field>
        </TwoCol>
        <Field label="Activation Response Free Text">
          <TextArea value={r.ictalActivationFreeText} onChange={v=>set("ictalActivationFreeText",v)} disabled={readOnly} rows={2}
            placeholder="e.g., 'Three typical absence seizures provoked during HV at 90 sec, each lasting 8–12 sec with 3 Hz generalised spike-wave and clinical arrest. None occurred spontaneously during the remainder of the recording.'" />
        </Field>
      </Card>

      {r.ictalType?.some(t => !t.startsWith("None")) && (
        <>
          <Card>
            <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:12}}>EEG Seizure Characteristics (most typical / index seizure)</div>
            <TwoCol>
              <Field label="EEG Onset Pattern" required>
                <Select value={r.onsetPattern} onChange={v=>set("onsetPattern",v)} disabled={readOnly}
                  options={["Low-voltage fast (LVF) — electrodecrement with superimposed fast","Rhythmic theta (≥4 Hz)","Rhythmic alpha (8–12 Hz)","Rhythmic delta (<4 Hz)","Repetitive spike-wave / sharp-wave","Generalised spike-wave (typical absence)","Polyspike burst","Evolving rhythmic pattern (specify frequency)"]} />
              </Field>
              <Field label="Onset Frequency (Hz)">
                <Input type="number" value={r.onsetFreq} onChange={v=>set("onsetFreq",v)} disabled={readOnly} placeholder="e.g. 12" />
              </Field>
              <Field label="Peak Ictal Frequency (Hz)">
                <Input type="number" value={r.peakFreq} onChange={v=>set("peakFreq",v)} disabled={readOnly} placeholder="if evolution" />
              </Field>
              <Field label="Onset Lateralisation" required>
                <Select value={r.onsetLateralisation} onChange={v=>set("onsetLateralisation",v)} disabled={readOnly}
                  options={["Generalised (bilateral synchronous onset)","Left-lateralised","Right-lateralised","Bilateral independent onset","Multifocal onset","Unclear"]} />
              </Field>
              <Field label="Onset Localisation" required>
                <Select value={r.onsetLocalisation} onChange={v=>set("onsetLocalisation",v)} disabled={readOnly}
                  options={["Frontal — bilateral / left / right","Fronto-temporal — left / right","Temporal anterior — left / right","Temporal mid — left / right","Central / Rolandic — left / right","Parietal — left / right","Occipital — left / right","Vertex / Midline","Hemispheric — left / right","Diffuse / Unclear"]} />
              </Field>
              <Field label="Onset Character">
                <Select value={r.onsetCharacter} onChange={v=>set("onsetCharacter",v)} disabled={readOnly}
                  options={["Sudden (<3 s to well-developed)","Gradual (>3 s build-up)"]} />
              </Field>
              <Field label="Ictal Evolution">
                <Select value={r.ictalEvolution} onChange={v=>set("ictalEvolution",v)} disabled={readOnly}
                  options={["Frequency evolution","Morphology evolution","Spatial evolution (spread)","Multiple evolution types","No evolution — static pattern","Cannot assess"]} />
              </Field>
              <Field label="Maximum Ictal Spread">
                <Select value={r.maxSpread} onChange={v=>set("maxSpread",v)} disabled={readOnly}
                  options={["Restricted to onset zone","Regional (same lobe)","Adjacent lobe(s) ipsilaterally","Ipsilateral hemisphere","Secondary bilateral synchrony","Generalised / Diffuse"]} />
              </Field>
              <Field label="Typical Seizure Duration">
                <Select value={r.seizureDuration} onChange={v=>set("seizureDuration",v)} disabled={readOnly}
                  options={["<30 seconds","30–60 seconds","1–5 minutes","5–10 minutes",">10 minutes (approaching/meeting SE)"]} />
              </Field>
              <Field label="Measured Duration — Typical (sec)">
                <Input type="number" value={r.seizureDurationMeasured} onChange={v=>set("seizureDurationMeasured",v)} disabled={readOnly} />
              </Field>
              <Field label="Measured Duration — Longest (sec)">
                <Input type="number" value={r.seizureLongest} onChange={v=>set("seizureLongest",v)} disabled={readOnly} />
              </Field>
              <Field label="Ictal Offset">
                <Select value={r.ictalOffset} onChange={v=>set("ictalOffset",v)} disabled={readOnly}
                  options={["Abrupt cessation","Gradual decrement","Transition to post-ictal suppression","Transition to post-ictal slowing"]} />
              </Field>
              <Field label="Post-Ictal EEG Change">
                <Select value={r.postIctal} onChange={v=>set("postIctal",v)} disabled={readOnly}
                  options={["Return to pre-ictal baseline","Post-ictal focal slowing","Post-ictal generalised slowing","Post-ictal suppression","No identifiable post-ictal change"]} />
              </Field>
              <Field label="Post-Ictal Duration (sec)">
                <Input type="number" value={r.postIctalDuration} onChange={v=>set("postIctalDuration",v)} disabled={readOnly} />
              </Field>
            </TwoCol>
            <Field label="Evolution Description">
              <TextArea value={r.evolutionDesc} onChange={v=>set("evolutionDesc",v)} disabled={readOnly} rows={2}
                placeholder="Starting frequency → direction of change → ending frequency → spread sequence with electrode order..." />
            </Field>
          </Card>

          <Card>
            <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:12}}>Clinical Phenomenology (ECSz — time-locked clinical features)</div>
            <Field label="Awareness / Responsiveness">
              <Select value={r.awareness} onChange={v=>set("awareness",v)} disabled={readOnly}
                options={["Maintained awareness throughout","Impaired awareness / unresponsive","Variable during event","Unable to assess (intubated/sedated/neonatal)"]} />
            </Field>
            <Field label="Motor Features (select all present)">
              <MultiSelect
                options={["None observable","Automatisms — oral (lip smacking, chewing)","Automatisms — manual (picking, fumbling)","Automatisms — bilateral gestural","Tonic posturing — left","Tonic posturing — right","Tonic — bilateral","Clonic — left","Clonic — right","Clonic — bilateral","Sequential tonic-clonic","Myoclonic jerks","Epileptic spasms (flexion/extension)","Hypermotor","Versive — left","Versive — right","Eyelid flutter","Subtle neonatal (cycling, boxing, lip smacking)"]}
                selected={r.motorFeatures || []} onChange={v=>set("motorFeatures",v)} />
            </Field>
            <Field label="Non-Motor Features (select all present)">
              <MultiSelect
                options={["Behavioural arrest / staring","Sudden cessation of activity","Autonomic — tachycardia","Autonomic — colour change","Autonomic — tachypnoea or apnoea","Autonomic — salivation","Autonomic — pupil change","Sensory / aura","Emotional (fear, laughter, crying)","No observable clinical features"]}
                selected={r.nonMotorFeatures || []} onChange={v=>set("nonMotorFeatures",v)} />
            </Field>
            <Field label="Clinical Phenomenology Free Text" required={r.ictalType?.some(t=>t.includes("Electroclinical"))} accent={T.red}>
              <TextArea value={r.phenoFreeText} onChange={v=>set("phenoFreeText",v)} disabled={readOnly} rows={4}
                placeholder="REQUIRED for ECSz: Precise time-locked description of clinical features relative to EEG onset and offset. e.g., 'At EEG seizure onset (left temporal LVF), child had leftward head deviation. At 5 sec, right arm clonic jerking. Awareness impaired. Duration 45 sec. Post-ictally, right arm weakness ~2 min.'" />
            </Field>
          </Card>

          <Card>
            <TwoCol>
              <Field label="Status Epilepticus Assessment" required>
                <Select value={r.seCriteria} onChange={v=>set("seCriteria",v)} disabled={readOnly}
                  options={["No — does not meet SE criteria","ESE: ESz ≥10 continuous min OR >20% of any 60-min period","ECSE: ECSz ≥10 min OR >20% of 60 min","Convulsive SE: bilateral tonic-clonic ≥5 min","NCSE: meets SE duration criteria, no prominent motor","Possible ECSE: IIC + SE duration + EEG not clinical improvement","Neonatal SE: seizures ≥50% of any 1-hour epoch"]} />
              </Field>
              <Field label="SE Type / Classification">
                <Select value={r.seType} onChange={v=>set("seType",v)} disabled={readOnly}
                  options={["Not applicable","Absence SE","Focal SE with impaired awareness","Focal SE without impaired awareness","NCSE in coma","Bilateral tonic-clonic SE (convulsive)","Tonic SE","Myoclonic SE","Epileptic Spasms SE","Unknown type"]} />
              </Field>
            </TwoCol>
          </Card>

          <Card>
            <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:12}}>Seizure Burden (monitoring recordings)</div>
            <ThreeCol>
              <Field label="Total Seizure Duration (min)"><Input type="number" value={r.seizureBurdenTotal} onChange={v=>set("seizureBurdenTotal",v)} disabled={readOnly} /></Field>
              <Field label="Max Hourly Seizure Burden (%)"><Input type="number" value={r.maxHourlyBurden} onChange={v=>set("maxHourlyBurden",v)} disabled={readOnly} /></Field>
              <Field label="Daily Seizure Burden (hrs/24h)"><Input type="number" value={r.dailyBurden} onChange={v=>set("dailyBurden",v)} disabled={readOnly} /></Field>
            </ThreeCol>
            <Field label="Seizure Burden Free Text">
              <TextArea value={r.seizureBurdenFreeText} onChange={v=>set("seizureBurdenFreeText",v)} disabled={readOnly} rows={2}
                placeholder="Trend over monitoring period (improving/stable/worsening), ASM response, timestamps for key events..." />
            </Field>
          </Card>

          <Card style={{borderColor:T.red}}>
            <Field label="Ictal Narrative Summary" required accent={T.red}>
              <TextArea value={r.ictalNarrative} onChange={v=>set("ictalNarrative",v)} disabled={readOnly} rows={6}
                placeholder="REQUIRED: Comprehensive narrative. e.g., 'A single electroclinical seizure was recorded at 14:23. EEG onset: left temporal LVF at F7-T3. Evolution: increasing amplitude rhythmic theta spreading to left parietal at 8 sec. Duration 55 sec. Gradual offset. Post-ictal left temporal delta for 90 sec. Clinical: right arm clonic jerking from onset, rightward head deviation, impaired awareness, resolving within 2 min. Consistent with left temporal focal seizure with ipsilateral hemispheric spread.'" />
            </Field>
          </Card>
        </>
      )}
    </div>
  );
}

function ModuleBrainDeath({ r, set, readOnly }) {
  return (
    <div>
      <ModuleBanner color={T.red} label="MODULE 8.2 — SUSPECTED BRAIN DEATH EVALUATION" icon="🔴" />
      <WarnBox text="EEG for brain death is an ANCILLARY TEST only. All clinical brain death criteria must be satisfied first. EEG alone is neither necessary nor sufficient to determine brain death. Technical requirements per ACNS Guideline 6 (2016) must be strictly met." />
      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:12}}>Technical Compliance Checklist (ACNS Guideline 6)</div>
        {[
          ["bd16ch","Minimum 16 EEG channels recorded"],
          ["bdFullComplement","Full 10-20 electrode complement applied"],
          ["bdInterelDist","Inter-electrode distances ≥10 cm"],
          ["bdImpedance","Electrode impedances 100 Ω – 10 kΩ throughout"],
          ["bdSensitivity","Sensitivity 2 µV/mm throughout recording"],
          ["bdDuration","Recording duration ≥30 minutes at required sensitivity"],
          ["bdNoSedatives","No confounding CNS depressants (toxicology if available)"],
          ["bdNoMetabolic","No confounding severe metabolic disturbance"],
          ["bdIntegrity","System integrity verified by technician during recording"],
          ["bdNoReactivity","No reactivity to auditory, visual, or noxious stimulation"],
          ["bdVideo","Simultaneous video recording"],
        ].map(([key, label]) => (
          <TwoCol key={key}>
            <div style={{fontSize:13,color:T.slate,fontWeight:600,paddingTop:8}}>{label}</div>
            <Select value={r[key]} onChange={v=>set(key,v)} disabled={readOnly}
              options={["Confirmed","Not met / Not confirmed — document below"]} />
          </TwoCol>
        ))}
        <Field label="Temperature at Recording (°C)">
          <Input type="number" value={r.bdTempValue} onChange={v=>set("bdTempValue",v)} disabled={readOnly} placeholder="Must be >32°C" />
        </Field>
        <Field label="Technical Compliance Notes">
          <TextArea value={r.bdTechNotes} onChange={v=>set("bdTechNotes",v)} disabled={readOnly} rows={3}
            placeholder="Document any departures from standard, confounders, or limitations..." />
        </Field>
      </Card>
      <Card>
        <Field label="EEG Finding" required>
          <Select value={r.bdResult} onChange={v=>set("bdResult",v)} disabled={readOnly}
            options={["Electrocerebral Inactivity (ECI) CONFIRMED — no cerebral electrical activity >2 µV in any scalp region throughout, system integrity verified, no confounders","Low-voltage cerebral activity PRESENT — does not meet ECI criteria (activity >2 µV detected)","Cerebral electrical activity PRESENT — clearly above threshold","Recording TECHNICALLY INADEQUATE for ECI determination — repeat required"]} />
        </Field>
        <Field label="Reactivity Testing Result" required>
          <Select value={r.bdReactivityResult} onChange={v=>set("bdReactivityResult",v)} disabled={readOnly}
            options={["No reactivity confirmed — auditory, tactile, noxious all tested and unreactive","Reactivity present — precludes ECI determination","Testing incomplete (document reason)"]} />
        </Field>
        <Field label="ECI Determination Statement" required accent={T.red}>
          <TextArea value={r.bdStatement} onChange={v=>set("bdStatement",v)} disabled={readOnly} rows={5}
            placeholder="Standard statement: e.g., 'This EEG was recorded in accordance with ACNS Guideline 6. No cerebral electrical activity exceeding 2 µV was detected over any scalp region during this 30-minute recording at a sensitivity of 2 µV/mm. Electrode integrity was confirmed throughout. No reactivity was observed to auditory, tactile, or noxious stimulation. Body temperature was 36.8°C. No confounding sedatives or metabolic disturbances were identified. These findings are consistent with electrocerebral inactivity.'" />
        </Field>
        <Field label="Caveats / Limitations">
          <TextArea value={r.bdCaveats} onChange={v=>set("bdCaveats",v)} disabled={readOnly} rows={3}
            placeholder="Confounders, medications, metabolic disturbance, technical limitations, age-specific considerations..." />
        </Field>
        {!r.bdResult?.startsWith("Electrocerebral Inactivity") && (
          <Field label="Residual Activity Description">
            <TextArea value={r.bdResidualActivity} onChange={v=>set("bdResidualActivity",v)} disabled={readOnly} rows={2}
              placeholder="Characterise detected activity: estimated voltage, distribution, character, artefactual vs cerebral..." />
          </Field>
        )}
      </Card>
    </div>
  );
}

function ModulePresurgical({ r, set, readOnly }) {
  return (
    <div>
      <ModuleBanner color={T.slate} label="MODULE 8.1 — VIDEO-EEG TELEMETRY — PRE-SURGICAL EVALUATION" icon="🔬" />
      <Card>
        <TwoCol>
          <Field label="Habitual Seizures Captured" required>
            <Select value={r.habitualSeizures} onChange={v=>set("habitualSeizures",v)} disabled={readOnly}
              options={["Yes — all known habitual seizure types","Yes — partial (not all types represented)","No habitual seizures captured","Non-habitual / atypical only"]} />
          </Field>
          <Field label="Number of Habitual Seizures">
            <Input type="number" value={r.seizuresCapturedCount} onChange={v=>set("seizuresCapturedCount",v)} disabled={readOnly} />
          </Field>
          <Field label="Interictal Zone">
            <Select value={r.interictialZone} onChange={v=>set("interictialZone",v)} disabled={readOnly}
              options={["Concordant with structural lesion on MRI","Non-lesional (no MRI abnormality at proposed onset zone)","Discordant with structural lesion","Multifocal / widespread / bilateral","Indeterminate"]} />
          </Field>
          <Field label="Ictal Onset Zone (EEG)">
            <Select value={r.ictalOnsetZone} onChange={v=>set("ictalOnsetZone",v)} disabled={readOnly}
              options={["Frontal — left / right / bilateral","Fronto-temporal — left / right","Temporal — left / right","Parietal — left / right","Occipital — left / right","Hemispheric — left / right","Multifocal / bilateral / unclear"]} />
          </Field>
          <Field label="Ictal Propagation">
            <Select value={r.propagation} onChange={v=>set("propagation",v)} disabled={readOnly}
              options={["Restricted to onset zone throughout","Ipsilateral spread only","Contralateral spread (secondary bilateral synchrony)","Rapid generalisation (<2 sec from onset)","Variable propagation across seizures"]} />
          </Field>
          <Field label="EEG Concordance with MRI Lesion">
            <Select value={r.mriConcordance} onChange={v=>set("mriConcordance",v)} disabled={readOnly}
              options={["Fully concordant — onset and interictal zone match MRI","Partially concordant","Discordant","Non-lesional MRI","MRI not available"]} />
          </Field>
          <Field label="Multi-modal Concordance">
            <Select value={r.multimodalConcordance} onChange={v=>set("multimodalConcordance",v)} disabled={readOnly}
              options={["Convergent multi-modal evidence (EEG + imaging + semiology)","Partially concordant","Discordant","Other investigations not performed"]} />
          </Field>
        </TwoCol>
        <Field label="Detailed Ictal Semiology (per seizure type)" required accent={T.slate}>
          <TextArea value={r.ictalSemiology} onChange={v=>set("ictalSemiology",v)} disabled={readOnly} rows={6}
            placeholder="For EACH captured seizure type: EEG onset character, frequency, electrode of onset, evolution, bilateral spread latency, clinical sequence with time-to-EEG onset, duration, postictal findings. Describe lateralising and localising signs separately." />
        </Field>
        <Field label="Localising Evidence Summary">
          <TextArea value={r.localisingEvidence} onChange={v=>set("localisingEvidence",v)} disabled={readOnly} rows={4}
            placeholder="Integrate interictal zone, ictal EEG onset zone, semiology, neuroimaging, and other investigations. State hypothesis for seizure onset zone clearly." />
        </Field>
        <Field label="Recommendation for Further Investigation">
          <TextArea value={r.furtherInvestigation} onChange={v=>set("furtherInvestigation",v)} disabled={readOnly} rows={3}
            placeholder="e.g., Phase 2 invasive EEG (SEEG / ECoG); PET; ictal SPECT; MEG; fMRI language lateralisation; Wada test; neuropsychological assessment; MDT review" />
        </Field>
      </Card>
    </div>
  );
}

function ModuleConclusion({ r, set, readOnly, onGenerateDraft }) {
  const [generating, setGenerating] = useState(false);
  const handleGenerate = async () => {
    setGenerating(true);
    try { await onGenerateDraft(); }
    finally { setGenerating(false); }
  };
  return (
    <div>
      <ModuleBanner color={T.navy} label="MODULE 9 — CONCLUSION" icon="📋" />
      <WarnBox text="The Conclusion is the most clinically critical section. Write in plain language comprehensible to any clinician. Expert assistance can draft both the clinical impression and recommended next steps — review and edit both before signing." />

      <Card>
        <TwoCol>
          <Field label="Overall EEG Classification" required>
            <Select value={r.overallClassification} onChange={v=>set("overallClassification",v)} disabled={readOnly}
              options={["NORMAL EEG — normal for age and state","NORMAL EEG with normal variant(s)","ABNORMAL — epileptiform only (no background abnormality)","ABNORMAL — background only (no epileptiform activity)","ABNORMAL — epileptiform and background abnormality","ABNORMAL — ictal (seizure recorded)","ABNORMAL — status epilepticus","ABNORMAL — electrocerebral inactivity","ABNORMAL — multiple abnormalities","TECHNICALLY LIMITED — interpretation restricted"]} />
          </Field>
          <Field label="Degree of Abnormality">
            <Select value={r.degreeAbnormality} onChange={v=>set("degreeAbnormality",v)} disabled={readOnly}
              options={["Mild","Moderate","Severe","Not applicable (normal or ECI)"]} />
          </Field>
        </TwoCol>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:13,color:T.navy,marginBottom:12}}>Structured Impression Elements</div>
        <Field label="Background Statement">
          <Select value={r.bgStatement} onChange={v=>set("bgStatement",v)} disabled={readOnly}
            options={["Background normal for age and state","Mild diffuse cerebral dysfunction","Moderate diffuse cerebral dysfunction","Severe diffuse cerebral dysfunction","Focal cerebral dysfunction (specify region)","Lateralised background abnormality","Burst suppression pattern","Electrocerebral inactivity","Normal neonatal background for PMA","Abnormal neonatal background for PMA"]} />
        </Field>
        <Field label="Background Impression — Free Text">
          <TextArea value={r.bgImpressionFreeText} onChange={v=>set("bgImpressionFreeText",v)} disabled={readOnly} rows={2}
            placeholder="e.g., 'The EEG background shows a posterior dominant rhythm at 7 Hz, slow for a 6-year-old (expected ≥8 Hz), with diffuse theta-delta slowing, consistent with mild diffuse cerebral dysfunction.'" />
        </Field>
        <Field label="IED Statement">
          <Select value={r.iedStatement} onChange={v=>set("iedStatement",v)} disabled={readOnly}
            options={["No epileptiform discharges recorded","Epileptiform discharges present — support a diagnosis of epilepsy","Epileptiform discharges with syndrome-specific pattern","Hypsarrhythmia identified — consistent with West Syndrome / IESS","ESES / CSWS pattern identified","Borderline / uncertain epileptiform activity"]} />
        </Field>
        <Field label="IED Impression — Free Text">
          <TextArea value={r.iedImpressionFreeText} onChange={v=>set("iedImpressionFreeText",v)} disabled={readOnly} rows={2}
            placeholder="e.g., 'There are epileptiform discharges arising from the left temporal region. These support a diagnosis of focal epilepsy with a left temporal epileptogenic focus.'" />
        </Field>
        <Field label="Ictal Statement">
          <Select value={r.ictalStatement} onChange={v=>set("ictalStatement",v)} disabled={readOnly}
            options={["No seizures recorded","A normal interictal EEG does not exclude epilepsy","Electrographic seizure(s) recorded","Electroclinical seizure(s) recorded","Electrographic status epilepticus recorded","Electroclinical status epilepticus recorded","Non-convulsive status epilepticus identified","Epileptic spasms recorded","Neonatal electrographic seizures recorded"]} />
        </Field>
        <Field label="Ictal Impression — Free Text">
          <TextArea value={r.ictalImpressionFreeText} onChange={v=>set("ictalImpressionFreeText",v)} disabled={readOnly} rows={2}
            placeholder="e.g., 'A focal seizure was captured beginning in the left temporal region, lasting 55 seconds, with right arm clonic jerking and impaired awareness.'" />
        </Field>
        <Field label="Comparison with Previous EEG">
          <Select value={r.comparisonStatement} onChange={v=>set("comparisonStatement",v)} disabled={readOnly}
            options={["No previous EEG available","Compared with previous EEG: no significant change","Compared with previous: improvement","Compared with previous: deterioration","Compared with previous: new findings"]} />
        </Field>
        <Field label="Comparison Free Text">
          <TextArea value={r.comparisonFreeText} onChange={v=>set("comparisonFreeText",v)} disabled={readOnly} rows={2}
            placeholder="Nature of change from previous EEG..." />
        </Field>
        <Field label="Syndrome / ILAE Classification">
          <TextArea value={r.ilaeClassification} onChange={v=>set("ilaeClassification",v)} disabled={readOnly} rows={2}
            placeholder="e.g., 'Self-Limited Epilepsy with Centrotemporal Spikes (SeLECTS). Aetiology: genetic (self-limited focal epilepsy).'" />
        </Field>
      </Card>

      <Card style={{borderColor:T.navy, background: T.navyLt}}>
        <div style={{fontWeight:700,fontSize:14,color:T.navy,marginBottom:4}}>🩺 Expert Assistance</div>
        <div style={{fontSize:12,color:T.slate,marginBottom:12}}>
          Expert assistance drafts a clinical impression <strong>and</strong> a recommendations paragraph from all structured fields in this report. Review and edit both before signing.
        </div>
        {!readOnly && (
          <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
            <Btn label={generating ? "Drafting..." : "🩺 Draft Impression & Recommendations"}
              onClick={handleGenerate} disabled={generating || readOnly} color={T.teal} />
            <span style={{fontSize:12,color:T.grey}}>or type directly in the fields below</span>
          </div>
        )}
        <Field label="Final Clinical Impression" required accent={T.navy} hint="Clinician writes or edits — this text appears on the printed report">
          <TextArea value={r.finalImpression} onChange={v=>set("finalImpression",v)} disabled={readOnly} rows={10}
            placeholder="Write or edit the final clinical impression here. Plain language for any clinician. Example: 'This EEG is mildly abnormal for a 6-year-old child. The background shows a PDR at 7 Hz, slow for age, indicating mild diffuse cerebral dysfunction. Frequent left centrotemporal spike-and-slow-wave discharges activated by sleep are consistent with Self-Limited Epilepsy with Centrotemporal Spikes (SeLECTS). No electrographic seizures were recorded.'" />
        </Field>
      </Card>

      <Card>
        <div style={{fontWeight:700,fontSize:14,color:T.teal,marginBottom:12}}>Recommendations</div>
        <Field label="Select all that apply">
          <MultiSelect
            options={["No further EEG investigation required at this time","Repeat routine EEG — specify timing in notes","Repeat EEG with sleep deprivation","Ambulatory EEG (24–72 hours)","Prolonged video-EEG monitoring — diagnostic","Video-EEG telemetry — pre-surgical evaluation","Continuous EEG monitoring (PICU / NICU)","MRI brain with epilepsy protocol (3 Tesla)","Urgent neuroimaging","Neurology / epilepsy specialist review","Genetic investigations","Metabolic investigations","Neuropsychological assessment","EEG for brain death evaluation","Multidisciplinary team review","Referral to epilepsy surgery programme","Repeat neonatal EEG — specify interval in notes","Cardiology review","Sleep study / polysomnography"]}
            selected={r.recommendations || []} onChange={v=>set("recommendations",v)} />
        </Field>
        <Field label="Recommendations — Free Text" hint="Expert-assistance draft appears here after generating; edit as needed">
          <TextArea value={r.recommendationsFreeText} onChange={v=>set("recommendationsFreeText",v)} disabled={readOnly} rows={5}
            placeholder="Drafted recommendations appear here. Edit as needed. e.g., 'Repeat EEG in 3 months to reassess after commencing levetiracetam. MRI brain with 3T epilepsy protocol recommended to exclude underlying structural lesion.'" />
        </Field>
      </Card>
    </div>
  );
}

function ModuleClinicalContext({ r, set, readOnly }) {
  return (
    <div>
      <ModuleBanner color={T.teal} label="MODULE 2 — PRE-RECORDING CLINICAL CONTEXT" icon="📋" />
      <Card>
        <TwoCol>
          <Field label="Clinical State During Recording" required>
            <Select value={r.clinicalState} onChange={v=>set("clinicalState",v)} disabled={readOnly}
              options={["Awake — cooperative","Awake — restless / irritable","Drowsy","Asleep — natural sleep","Asleep — post-sedation","Pharmacologically sedated (ICU)","Deeply sedated / anaesthetised","Comatose (GCS ≤8)"]} />
          </Field>
        </TwoCol>
        <Field label="State Comment">
          <TextArea value={r.stateComment} onChange={v=>set("stateComment",v)} disabled={readOnly} rows={2}
            placeholder="e.g., 'Alert throughout'; 'Transitioned from wakefulness to sleep at 15 min'; 'Lightly sedated on propofol, responsive to voice'" />
        </Field>
      </Card>
      <Card>
        <Field label="Sedation Administered for This EEG">
          <Select value={r.sedation} onChange={v=>set("sedation",v)} disabled={readOnly} options={["None","Yes"]} />
        </Field>
        {r.sedation === "Yes" && (
          <TwoCol>
            <Field label="Drug / Dose / Route">
              <Input value={r.sedationDrug} onChange={v=>set("sedationDrug",v)} disabled={readOnly}
                placeholder="e.g., Melatonin 3 mg oral" />
            </Field>
            <Field label="Time Before Recording Start (min)">
              <Input type="number" value={r.sedationTime} onChange={v=>set("sedationTime",v)} disabled={readOnly} />
            </Field>
          </TwoCol>
        )}
        {r.sedation === "Yes" && (
          <Field label="Sedation Effect on EEG">
            <TextArea value={r.sedationEffect} onChange={v=>set("sedationEffect",v)} disabled={readOnly} rows={2}
              placeholder="e.g., 'Child asleep within 20 min; no excess beta'; 'Excess fast activity consistent with benzodiazepine effect'" />
          </Field>
        )}
      </Card>
      <Card>
        <Field label="Antiseizure Medications" required>
          <TextArea value={r.meds} onChange={v=>set("meds",v)} disabled={readOnly} rows={2}
            placeholder="List: Drug / Dose / Frequency — e.g., Levetiracetam 500 mg BD, Sodium Valproate 300 mg TDS" />
        </Field>
        <Field label="Other CNS-Active Medications">
          <TextArea value={r.otherMeds} onChange={v=>set("otherMeds",v)} disabled={readOnly} rows={2}
            placeholder="Sedatives, antipsychotics, antihistamines, anaesthetic agents, neuromuscular blockers..." />
        </Field>
      </Card>
      <Card>
        <Field label="Relevant Clinical History" required>
          <TextArea value={r.clinicalHistory} onChange={v=>set("clinicalHistory",v)} disabled={readOnly} rows={4}
            placeholder="Age-appropriate context: seizure type, frequency, duration, evolution; diagnosis; MRI findings; developmental status; family history; medication response..." />
        </Field>
        <Field label="Specific Question for the EEG to Answer" required>
          <TextArea value={r.referralQuestion} onChange={v=>set("referralQuestion",v)} disabled={readOnly} rows={2}
            placeholder="e.g., 'Characterise EEG correlate of staring episodes'; 'Exclude NCSE in encephalopathic infant'; 'Lateralise seizure onset zone prior to surgery'" />
        </Field>
        <Field label="Previous EEG Available?">
          <Select value={r.previousEEG} onChange={v=>set("previousEEG",v)} disabled={readOnly}
            options={["No — first EEG","Yes — available and reviewed","Yes — not available for this report"]} />
        </Field>
        {r.previousEEG?.startsWith("Yes") && (
          <Field label="Previous EEG Summary">
            <TextArea value={r.previousEEGSummary} onChange={v=>set("previousEEGSummary",v)} disabled={readOnly} rows={2}
              placeholder="Brief description of relevant previous EEG findings for comparison..." />
          </Field>
        )}
      </Card>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SmartEEG() {
  const [appState, setAppState] = useState(INITIAL);
  const [activeReport, setActiveReport] = useState(null);
  const [activeModule, setActiveModule] = useState("patient");
  const [showLogin, setShowLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showAmendment, setShowAmendment] = useState(false);
  const [amendmentText, setAmendmentText] = useState("");
  const [view, setView] = useState("dashboard"); // dashboard | form | list
  const [notification, setNotification] = useState(null);

  const user = appState.currentUser;

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ── AUTH ──
  const handleLogin = () => {
    const u = appState.users.find(u =>
      (u.name.toLowerCase().includes(loginForm.username.toLowerCase()) || u.id === loginForm.username) &&
      u.password === loginForm.password
    );
    if (u) {
      setAppState(s => ({ ...s, currentUser: u }));
      setShowLogin(false);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    setAppState(s => ({ ...s, currentUser: null }));
    setShowLogin(true);
    setActiveReport(null);
    setView("dashboard");
  };

  // ── REPORT MANAGEMENT ──
  const newReport = () => {
    const r = emptyReport();
    setAppState(s => ({ ...s, reports: [r, ...s.reports] }));
    setActiveReport(r);
    setActiveModule("patient");
    setView("form");
  };

  const saveReport = (updated) => {
    setAppState(s => ({ ...s, reports: s.reports.map(r => r.id === updated.id ? updated : r) }));
    setActiveReport(updated);
  };

  // setField uses a functional update so that multiple calls made in quick
  // succession (e.g. setting several fields from one async action) always
  // build on the latest pending state rather than a stale closure snapshot.
  const setField = (key, val) => {
    setActiveReport(prev => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: val };
      setAppState(s => ({ ...s, reports: s.reports.map(r => r.id === updated.id ? updated : r) }));
      return updated;
    });
  };

  // setFields applies several field updates atomically in a single state
  // transition — the preferred way to commit more than one field at once
  // (e.g. the expert-assistance draft, which sets both impression and
  // recommendations together).
  const setFields = (patch) => {
    setActiveReport(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      setAppState(s => ({ ...s, reports: s.reports.map(r => r.id === updated.id ? updated : r) }));
      return updated;
    });
  };

  const signReport = () => {
    if (!activeReport.finalImpression?.trim()) {
      notify("Please complete the Final Impression before signing.", "error");
      return;
    }
    const updated = {
      ...activeReport,
      status: "signed",
      signedAt: new Date().toISOString(),
      signedBy: user.id,
    };
    saveReport(updated);
    notify("Report signed successfully.");
  };

  const submitAmendment = () => {
    if (!amendmentText.trim()) return;
    const amendment = { at: new Date().toISOString(), by: user.name, text: amendmentText };
    const updated = {
      ...activeReport,
      status: "amended",
      amendments: [...(activeReport.amendments || []), amendment],
    };
    saveReport(updated);
    setAmendmentText("");
    setShowAmendment(false);
    notify("Addendum added successfully.");
  };

  const markTechComplete = () => {
    const updated = {
      ...activeReport,
      techCompletedBy: user.name,
      techCompletedAt: new Date().toLocaleString("en-GB"),
    };
    saveReport(updated);
    notify("Technical section marked as complete.");
  };

  // ── EXPERT-ASSISTANCE DRAFT (CONCLUSION) ──
  // Builds a structured context summary from every completed field in the
  // report, sends it to the server-side generation endpoint, and applies
  // the returned impression + recommendations as a single atomic state
  // update (see setFields above) so neither value can silently overwrite
  // the other.
  const buildConclusionContext = (r) => {
    const neo = isNeonatal(r.dob, r.ga);
    const L = [];
    L.push("PATIENT: " + (r.patientName || "unnamed") + ", Age: " + getAgeDisplay(r.dob) + (neo ? ", PMA: " + getPMA(r.dob, r.ga) + " weeks" : ""));
    L.push("EEG TYPE: " + (r.eegType || "Not specified"));
    L.push("CLINICAL HISTORY: " + (r.clinicalHistory || "Not provided"));
    L.push("REFERRAL QUESTION: " + (r.referralQuestion || "Not provided"));
    L.push("");
    if (neo) {
      L.push("NEONATAL BACKGROUND: " + (r.bgGradeNeo || "Not documented"));
      if (r.continuityNeo)       L.push("  Continuity: " + r.continuityNeo);
      if (r.ibiDuration)         L.push("  IBI: " + r.ibiDuration + "s (range " + (r.ibiRange || "?") + ")");
      if (r.continuityAssessNeo) L.push("  Assessment vs PMA: " + r.continuityAssessNeo);
      if (r.symmetryNeo)         L.push("  Symmetry: " + r.symmetryNeo);
      if (r.synchronyNeo)        L.push("  Synchrony: " + r.synchronyNeo);
      if (r.variability)         L.push("  Variability: " + r.variability);
      if (r.reactivityNeo)       L.push("  Reactivity: " + r.reactivityNeo);
      if (r.eegMaturity)         L.push("  Maturity: " + r.eegMaturity);
      if (r.bgNarrativeNeo)      L.push("  Narrative: " + r.bgNarrativeNeo);
    } else {
      L.push("BACKGROUND: " + (r.bgClassification || "Not documented"));
      if (r.pdrFreq)     L.push("  PDR: " + r.pdrFreq + " Hz (" + (r.pdrAssessment || "?") + ")");
      if (r.bgFreq)      L.push("  Predominant frequency: " + r.bgFreq);
      if (r.continuity)  L.push("  Continuity: " + r.continuity);
      if (r.symmetry)    L.push("  Symmetry: " + r.symmetry);
      if (r.reactivity)  L.push("  Reactivity: " + r.reactivity);
      if (r.bgNarrative) L.push("  Narrative: " + r.bgNarrative);
    }
    L.push("");
    L.push("INTERICTAL EDs: " + (r.iedPresence || "Not documented"));
    if (r.iedPresence && r.iedPresence.startsWith("Present")) {
      if (r.iedMorphology)     L.push("  Morphology: " + r.iedMorphology);
      if (r.iedLateralisation) L.push("  Lateralisation: " + r.iedLateralisation);
      if (r.iedRegion)         L.push("  Region: " + r.iedRegion);
      if (r.iedPrevalence)     L.push("  Prevalence: " + r.iedPrevalence + (r.iedRate ? " (~" + r.iedRate + ")" : ""));
      if (r.iedState)          L.push("  State relationship: " + r.iedState);
      if (r.iedHvResponse && r.iedHvResponse !== "Not performed / not applicable")
        L.push("  HV response: " + r.iedHvResponse);
      if (r.iedIpsResponse && r.iedIpsResponse !== "Not performed / not applicable")
        L.push("  IPS response: " + r.iedIpsResponse);
      if (r.iedSleepResponse && r.iedSleepResponse !== "Not assessable — no sleep recorded")
        L.push("  Sleep response: " + r.iedSleepResponse);
      if (r.iedFixationResponse && r.iedFixationResponse !== "Not tested")
        L.push("  Fixation response: " + r.iedFixationResponse);
      if (r.hypsarrhythmia && r.hypsarrhythmia !== "Not present" && r.hypsarrhythmia !== "Not applicable")
        L.push("  Hypsarrhythmia: " + r.hypsarrhythmia);
      if (r.csws && !r.csws.startsWith("Not"))
        L.push("  CSWS/ESES: " + r.csws + (r.swi ? " (SWI " + r.swi + "%)" : ""));
      if (r.centrotemporalSpikes && r.centrotemporalSpikes.startsWith("Present"))
        L.push("  Centrotemporal spikes: " + r.centrotemporalSpikes);
      if (r.iedSummary) L.push("  IED summary: " + r.iedSummary);
    }
    L.push("");
    L.push("ICTAL: " + (r.ictalType && r.ictalType.length ? r.ictalType.join(", ") : "None recorded"));
    if (r.ictalType && r.ictalType.length && !r.ictalType[0].startsWith("None")) {
      if (r.seizureCount)            L.push("  Total seizures: " + r.seizureCount);
      if (r.onsetLateralisation)     L.push("  Onset: " + r.onsetLateralisation + " / " + (r.onsetLocalisation || "?"));
      if (r.seizureDurationMeasured) L.push("  Typical duration: " + r.seizureDurationMeasured + "s");
      if (r.seCriteria)              L.push("  SE: " + r.seCriteria);
      if (r.ictalHvResponse && r.ictalHvResponse !== "Not performed / not applicable")
        L.push("  Seizures with HV: " + r.ictalHvResponse);
      if (r.ictalIpsResponse && r.ictalIpsResponse !== "Not performed / not applicable")
        L.push("  Seizures with IPS: " + r.ictalIpsResponse);
      if (r.ictalSleepResponse && r.ictalSleepResponse !== "Not assessable — no sleep recorded")
        L.push("  Seizures in sleep: " + r.ictalSleepResponse);
      if (r.ictalOtherProvocation && r.ictalOtherProvocation !== "No clear precipitants identified")
        L.push("  Other precipitant: " + r.ictalOtherProvocation);
      if (r.ictalNarrative) L.push("  Narrative: " + r.ictalNarrative);
    }
    if (r.rppPresent && r.rppPresent.startsWith("Yes")) {
      L.push("");
      L.push("RPP: " + (r.rppLocalisation || "") + " " + (r.rppType || "") + " at " + (r.rppFreqMeasured || r.rppFreq || "?") + " Hz");
      if (r.iicAssessment) L.push("  IIC: " + r.iicAssessment);
    }
    if (r.comparisonStatement)
      L.push("\nPREVIOUS EEG: " + r.comparisonStatement + (r.comparisonFreeText ? " — " + r.comparisonFreeText : ""));
    return L.join("\n");
  };

  const buildConclusionPrompt = (ctx) =>
    "You are an expert paediatric neurologist writing the Conclusion section of a structured clinical EEG report.\n\n" +
    "Based on the EEG findings provided, write two paragraphs.\n\n" +
    "IMPRESSION paragraph:\n" +
    "- Start with: This EEG is [normal / mildly / moderately / severely abnormal] for a [age] [child / neonate].\n" +
    "- Third person clinical prose. No bullet points, no subheadings, no markdown formatting.\n" +
    "- Cover background, IEDs, ictal events, and RPP/IIC findings in order of clinical importance.\n" +
    "- Include syndrome hypothesis if supported by the data.\n" +
    "- State clearly whether findings support a diagnosis of epilepsy.\n" +
    "- Note clinically significant activation procedure responses.\n" +
    "- Maximum 200 words.\n\n" +
    "RECOMMENDATIONS paragraph:\n" +
    "- Short clinical recommendations paragraph, third person prose, no markdown formatting.\n" +
    "- Be specific (e.g., MRI brain with 3T epilepsy protocol including FLAIR).\n" +
    "- Include EEG follow-up, imaging, referral, genetic/metabolic tests and clinical review as appropriate.\n" +
    "- If EEG is normal, state clearly no further EEG is required unless clinically indicated.\n" +
    "- Maximum 100 words.\n\n" +
    "Respond with ONLY a single valid JSON object, no other text before or after, no markdown code fences, in exactly this shape:\n" +
    "{\"impression\": \"...\", \"recommendations\": \"...\"}\n\n" +
    "Both values must be non-empty plain text strings.\n\n" +
    "EEG FINDINGS:\n" + ctx;

  // Parses the model's raw text response into { impression, recommendations }.
  // Tolerates markdown code fences and stray text around the JSON object,
  // and never silently drops content — if parsing fails entirely, the raw
  // text is returned as the impression so nothing is lost.
  const parseConclusionResponse = (rawText) => {
    const raw = (rawText || "").trim();
    const fenceStripped = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

    const tryParse = (text) => {
      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object") {
          return {
            impression: (parsed.impression || "").toString().trim(),
            recommendations: (parsed.recommendations || "").toString().trim(),
            ok: true,
          };
        }
      } catch (_) { /* fall through */ }
      return null;
    };

    let result = tryParse(fenceStripped);
    if (!result) {
      const objMatch = fenceStripped.match(/\{[\s\S]*\}/);
      if (objMatch) result = tryParse(objMatch[0]);
    }
    if (!result || (!result.impression && !result.recommendations)) {
      return { impression: fenceStripped, recommendations: "", ok: false };
    }
    return result;
  };

  const generateDraft = async () => {
    const r = activeReport;
    if (!r) return;
    const ctx = buildConclusionContext(r);
    const prompt = buildConclusionPrompt(ctx);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, max_tokens: 1200 }),
      });
      const data = await response.json();
      const text = data?.content?.[0]?.text;

      if (!text) {
        notify("Unable to generate draft: " + (data?.error || "no response from server") + ".", "error");
        return;
      }

      const { impression, recommendations, ok } = parseConclusionResponse(text);

      // Apply both fields in one atomic update — this is the fix for the
      // earlier bug where the recommendations update silently overwrote
      // the impression update because both were derived from the same
      // stale snapshot of activeReport.
      const patch = {};
      if (impression) patch.finalImpression = impression;
      if (recommendations) patch.recommendationsFreeText = recommendations;
      if (Object.keys(patch).length > 0) setFields(patch);

      if (ok) {
        notify("Draft impression and recommendations generated. Review and edit before signing.");
      } else {
        notify("The response wasn't in the expected format — the full text was placed in the Impression field for your review.", "error");
      }
    } catch (e) {
      notify("Connection error while requesting expert assistance. Please try again.", "error");
    }
  };

  // ── ACTIVE MODULES ──
  const neo = activeReport ? isNeonatal(activeReport.dob, activeReport.ga) : false;
  const activeModules = activeReport ? getActiveModules(activeReport.eegType, neo) : [];
  const readOnly = activeReport?.status === "signed" || activeReport?.status === "amended";
  const techReadOnly = user?.role === "clinician" && !activeReport?.techCompletedBy ? false : (readOnly || (user?.role !== "technician" && !activeReport?.techCompletedBy));
  const clinicianReadOnly = readOnly || user?.role === "technician";

  // ── MODULES MAP ──
  const moduleList = [
    { id: "patient",     label: "1  Patient & Study",        icon: "👤", color: T.navy,   always: true },
    { id: "clinical",    label: "2  Clinical Context",        icon: "📋", color: T.teal,   always: true },
    { id: "technical",   label: "3  Technical",               icon: "🔧", color: T.blue,   always: true },
    { id: "background",  label: "4  EEG Background",          icon: "🧠", color: neo ? T.orange : T.green, always: true },
    { id: "ieds",        label: "5  Interictal Discharges",   icon: "⚡", color: T.red,    condition: () => !activeReport?.eegType?.includes("Brain Death") },
    { id: "ictal",       label: "6  Ictal Episodes",          icon: "🌩️", color: T.red,    condition: () => activeModules.includes("ictal") },
    { id: "rpp",         label: "7  Rhythmic & Periodic",     icon: "〰️", color: T.purple,  condition: () => activeModules.includes("rpp") },
    { id: "braindeath",  label: "7  Brain Death Evaluation",  icon: "🔴", color: T.red,    condition: () => activeModules.includes("braindeath") },
    { id: "presurgical", label: "8  Pre-surgical",            icon: "🔬", color: T.slate,  condition: () => activeModules.includes("presurgical") },
    { id: "icu",         label: "8  ICU Monitoring",          icon: "🏥", color: T.purple,  condition: () => activeModules.includes("icu") },
    { id: "conclusion",  label: "9  Conclusion",              icon: "📋", color: T.navy,   always: true },
    { id: "signoff",     label: "10  Sign-off",               icon: "✅", color: T.green,  always: true },
  ].filter(m => {
    if (!activeReport?.eegType) return m.always;
    if (m.always) return true;
    if (m.condition) return m.condition();
    return false;
  });

  // ─── LOGIN SCREEN ────────────────────────────────────────────────────────
  if (showLogin) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${T.navy} 0%, #2d5a8e 50%, ${T.teal} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <GlobalStyles />
      <div style={{ background: T.white, borderRadius: 20, padding: 48, width: "100%", maxWidth: 420, boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <EEGLogo size={50} />
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: T.navy }}>Smart</span>
            <span style={{ fontSize: 28, fontWeight: 800, color: T.teal }}>EEG</span>
          </div>
          <div style={{ fontSize: 13, color: T.grey, marginTop: 4, fontWeight: 700 }}>Standardised Paediatric EEG Reporting System</div>
        </div>
        <Field label="Username" required>
          <Input value={loginForm.username} onChange={v => setLoginForm(f => ({ ...f, username: v }))}
            placeholder="Enter your name or username"
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </Field>
        <Field label="Password" required>
          <Input type="password" value={loginForm.password} onChange={v => setLoginForm(f => ({ ...f, password: v }))}
            placeholder="Enter password"
            onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </Field>
        {loginError && <div style={{ color: T.red, fontSize: 12, marginBottom: 12 }}>{loginError}</div>}
        <Btn label="Sign In" onClick={handleLogin} color={T.navy} style={{ width: "100%" }} />
        <div style={{ marginTop: 24, padding: 12, background: T.greyLt, borderRadius: 8, fontSize: 11, color: T.grey }}>
          <strong>Demo accounts:</strong><br />
          EEG Technician: "Sarah Mitchell" / tech123<br />
          Clinician: "Dr. Aisha Al-Farsi" / doc123<br />
          Clinician: "Dr. James Okonkwo" / doc456
        </div>
      </div>
    </div>
  );

  // ─── DASHBOARD ────────────────────────────────────────────────────────────
  if (view === "dashboard") return (
    <div style={{ minHeight: "100vh", background: T.slateLt }}>
      {/* Header */}
      <div style={{ background: T.navy, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <EEGLogo size={32} />
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: T.white }}>Smart</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: T.teal }}>EEG</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.white }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "#A8D8EA" }}>{user.title}</div>
          </div>
          <Btn label="Sign Out" onClick={handleLogout} color={T.teal} small />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 32 }}>
        <div style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
          {user.role === "clinician" && (
            <Btn label="+ New EEG Report" onClick={newReport} color={T.navy} icon="📝" />
          )}
          {user.role === "technician" && (
            <NoteBox color={T.teal} text="As EEG Technician, you can open and complete the technical section (Module 3) of any pending report." />
          )}
          <Btn label="📋 All Reports" onClick={() => setView("list")} color={T.teal} outline />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {appState.reports.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: T.grey }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>No reports yet</div>
              <div style={{ fontSize: 13 }}>Click "New EEG Report" to start</div>
            </div>
          )}
          {appState.reports.slice(0, 12).map(rep => (
            <div key={rep.id} onClick={() => { setActiveReport(rep); setView("form"); setActiveModule("patient"); }}
              style={{ background: T.white, borderRadius: 12, padding: 20, cursor: "pointer", border: `1px solid ${T.border}`,
                transition: "all 0.15s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, color: T.navy, fontSize: 15 }}>{rep.patientName || "Unnamed Patient"}</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12,
                  background: rep.status === "signed" ? T.greenLt : rep.status === "amended" ? T.amberLt : T.blueLt,
                  color: rep.status === "signed" ? T.green : rep.status === "amended" ? T.amber : T.blue }}>
                  {rep.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 12, color: T.grey, marginBottom: 4 }}>ID: {rep.hospitalId || "—"}</div>
              <div style={{ fontSize: 12, color: T.slate }}>{rep.eegType || "EEG type not selected"}</div>
              <div style={{ fontSize: 11, color: T.grey, marginTop: 8 }}>{new Date(rep.createdAt).toLocaleDateString("en-GB")}</div>
              {!rep.techCompletedBy && <div style={{ fontSize: 11, color: T.amber, marginTop: 4 }}>⏳ Awaiting technical section</div>}
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  // ─── REPORTS LIST ──────────────────────────────────────────────────────────
  if (view === "list") return (
    <div style={{ minHeight: "100vh", background: T.slateLt }}>
      <div style={{ background: T.navy, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Btn label="← Back" onClick={() => setView("dashboard")} color={T.teal} small />
          <span style={{ color: T.white, fontWeight: 700 }}>All Reports</span>
        </div>
        <Btn label="Sign Out" onClick={handleLogout} color={T.teal} small />
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 32 }}>
        {appState.reports.map(rep => (
          <div key={rep.id} style={{ background: T.white, borderRadius: 10, padding: 16, marginBottom: 12, border: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            onClick={() => { setActiveReport(rep); setView("form"); setActiveModule("patient"); }}>
            <div>
              <div style={{ fontWeight: 700, color: T.navy }}>{rep.patientName || "Unnamed"} — {rep.hospitalId || "No ID"}</div>
              <div style={{ fontSize: 12, color: T.grey }}>{rep.eegType} | {new Date(rep.createdAt).toLocaleDateString("en-GB")}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 12,
              background: rep.status === "signed" ? T.greenLt : rep.status === "amended" ? T.amberLt : T.blueLt,
              color: rep.status === "signed" ? T.green : rep.status === "amended" ? T.amber : T.blue }}>
              {rep.status.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── FORM VIEW ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.slateLt, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: T.navy, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, flexShrink: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Btn label="← Dashboard" onClick={() => setView("dashboard")} color={T.teal} small />
          <EEGLogo size={28} />
          <span style={{ color: T.white, fontWeight: 700, fontSize: 14 }}>
            {activeReport?.patientName || "New Report"} {activeReport?.hospitalId ? `— ${activeReport.hospitalId}` : ""}
          </span>
          {activeReport?.status === "signed" && <span style={{ fontSize: 11, background: T.green, color: T.white, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>SIGNED</span>}
          {activeReport?.status === "amended" && <span style={{ fontSize: 11, background: T.amber, color: T.white, padding: "2px 8px", borderRadius: 10, fontWeight: 700 }}>AMENDED</span>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {readOnly && user?.role === "clinician" && (
            <Btn label="Add Addendum" onClick={() => setShowAmendment(true)} color={T.amber} small />
          )}
          {!readOnly && user?.role === "clinician" && (
            <Btn label="✅ Sign Report" onClick={signReport} color={T.green} small />
          )}
          {user?.role === "technician" && activeReport && !activeReport.techCompletedBy && (
            <Btn label="✅ Mark Technical Complete" onClick={markTechComplete} color={T.blue} small />
          )}
          {(readOnly || activeReport?.status === "signed") && (
            <Btn label="📥 Download PDF" onClick={() => generatePDF(activeReport, user, appState.users)} color={T.purple} small />
          )}
          <Btn label="Sign Out" onClick={handleLogout} color={T.slate} small outline />
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div style={{ position: "fixed", top: 70, right: 20, zIndex: 999, background: notification.type === "error" ? T.red : T.green,
          color: T.white, padding: "10px 20px", borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
          {notification.type === "error" ? "⚠️" : "✅"} {notification.msg}
        </div>
      )}

      {/* Amendment Modal */}
      {showAmendment && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: T.white, borderRadius: 16, padding: 32, maxWidth: 600, width: "100%", margin: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: T.amber, marginBottom: 8 }}>📝 Add Addendum</div>
            <WarnBox text="Original signed report content cannot be modified. This will be appended as a dated addendum." />
            <Field label="Addendum Text" required>
              <TextArea value={amendmentText} onChange={setAmendmentText} rows={6}
                placeholder="Enter addendum / amendment text. Include clinical context for the change." />
            </Field>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Btn label="Save Addendum" onClick={submitAmendment} color={T.amber} />
              <Btn label="Cancel" onClick={() => { setShowAmendment(false); setAmendmentText(""); }} color={T.grey} outline />
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar Navigation */}
        <div style={{ width: 220, background: T.white, borderRight: `1px solid ${T.border}`, overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.grey, textTransform: "uppercase", letterSpacing: 1 }}>Modules</div>
          </div>
          {moduleList.map(m => (
            <button key={m.id} onClick={() => setActiveModule(m.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px",
                background: activeModule === m.id ? `${m.color}15` : "transparent",
                borderLeft: activeModule === m.id ? `3px solid ${m.color}` : "3px solid transparent",
                border: "none", cursor: "pointer", textAlign: "left", transition: "all 0.1s",
                color: activeModule === m.id ? m.color : T.slate, fontWeight: activeModule === m.id ? 700 : 500, fontSize: 13 }}>
              <span style={{ fontSize: 16 }}>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
          {/* Progress indicator */}
          <div style={{ padding: 16, borderTop: `1px solid ${T.border}`, marginTop: 8 }}>
            <div style={{ fontSize: 11, color: T.grey, marginBottom: 4 }}>Report status</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: activeReport?.status === "signed" ? T.green : activeReport?.status === "amended" ? T.amber : T.blue }}>
              {activeReport?.status?.toUpperCase() || "DRAFT"}
            </div>
            {activeReport?.techCompletedBy ? (
              <div style={{ fontSize: 11, color: T.green, marginTop: 4 }}>✓ Tech section complete</div>
            ) : (
              <div style={{ fontSize: 11, color: T.amber, marginTop: 4 }}>⏳ Tech section pending</div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {/* Show amendments banner if signed */}
          {readOnly && (
            <div style={{ background: T.amberLt, border: `1px solid ${T.amber}`, borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: T.amber, fontWeight: 600 }}>
              🔒 This report has been signed and is read-only. Use "Add Addendum" to append changes. Original content is preserved.
            </div>
          )}
          {activeReport?.amendments?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {activeReport.amendments.map((a, i) => (
                <div key={i} style={{ background: T.amberLt, border: `1px solid ${T.amber}`, borderRadius: 8, padding: 12, marginBottom: 8, fontSize: 13 }}>
                  <strong style={{ color: T.amber }}>Addendum {i + 1} — {new Date(a.at).toLocaleString("en-GB")} by {a.by}:</strong>
                  <div style={{ marginTop: 4, color: T.slate }}>{a.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* Module content */}
          {activeModule === "patient" && activeReport && (
            <ModulePatient r={activeReport} set={setField} readOnly={user?.role === "technician" ? true : readOnly} />
          )}
          {activeModule === "clinical" && activeReport && (
            <ModuleClinicalContext r={activeReport} set={setField} readOnly={clinicianReadOnly} />
          )}
          {activeModule === "technical" && activeReport && (
            <ModuleTechnical r={activeReport} set={setField}
              readOnly={readOnly || (user?.role === "clinician" && !!activeReport.techCompletedBy)}
              userRole={user?.role} />
          )}
          {activeModule === "background" && activeReport && (
            <ModuleBackground r={activeReport} set={setField} readOnly={clinicianReadOnly} />
          )}
          {activeModule === "ieds" && activeReport && (
            <ModuleIEDs r={activeReport} set={setField} readOnly={clinicianReadOnly} />
          )}
          {activeModule === "rpp" && activeReport && (
            <ModuleRPP r={activeReport} set={setField} readOnly={clinicianReadOnly} />
          )}
          {activeModule === "ictal" && activeReport && (
            <ModuleIctal r={activeReport} set={setField} readOnly={clinicianReadOnly} />
          )}
          {activeModule === "braindeath" && activeReport && (
            <ModuleBrainDeath r={activeReport} set={setField} readOnly={clinicianReadOnly} />
          )}
          {activeModule === "presurgical" && activeReport && (
            <ModulePresurgical r={activeReport} set={setField} readOnly={clinicianReadOnly} />
          )}
          {activeModule === "conclusion" && activeReport && (
            <ModuleConclusion r={activeReport} set={setField} readOnly={clinicianReadOnly}
              onGenerateDraft={generateDraft} />
          )}
          {activeModule === "signoff" && activeReport && (
            <div>
              <ModuleBanner color={T.green} label="MODULE 10 — REPORT SIGN-OFF" icon="✅" />
              <Card>
                <TwoCol>
                  <div>
                    <div style={{ fontSize: 13, color: T.grey, marginBottom: 4 }}>Report prepared by</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: T.navy }}>{user.name}</div>
                    <div style={{ fontSize: 12, color: T.grey }}>{user.title}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: T.grey, marginBottom: 4 }}>Technical section completed by</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: T.blue }}>{activeReport.techCompletedBy || "Pending"}</div>
                    <div style={{ fontSize: 12, color: T.grey }}>{activeReport.techCompletedAt || ""}</div>
                  </div>
                </TwoCol>
                <div style={{ marginTop: 20 }}>
                  {activeReport.status === "signed" ? (
                    <div style={{ background: T.greenLt, border: `2px solid ${T.green}`, borderRadius: 10, padding: 16 }}>
                      <div style={{ fontWeight: 700, color: T.green, marginBottom: 4 }}>✅ Report Signed</div>
                      <div style={{ fontSize: 13, color: T.slate }}>Signed by: {appState.users.find(u => u.id === activeReport.signedBy)?.name}</div>
                      <div style={{ fontSize: 13, color: T.slate }}>Date & Time: {new Date(activeReport.signedAt).toLocaleString("en-GB")}</div>
                    </div>
                  ) : user.role === "clinician" ? (
                    <div>
                      {!activeReport.finalImpression?.trim() && (
                        <WarnBox text="Please complete the Final Impression (Module 9) before signing." />
                      )}
                      {!activeReport.techCompletedBy && (
                        <NoteBox text="Technical section has not yet been completed by the EEG technician. You may sign without it, but it is best practice to complete it first." color={T.amber} />
                      )}
                      <Btn label="✅ Sign & Finalise Report" onClick={signReport}
                        disabled={!activeReport.finalImpression?.trim()} color={T.green} />
                    </div>
                  ) : (
                    <NoteBox text="Only clinicians can sign reports. Please ensure all sections are complete and notify the reporting clinician." color={T.blue} />
                  )}
                </div>
                {activeReport.amendments?.length > 0 && (
                  <div style={{ marginTop: 16, padding: 12, background: T.amberLt, borderRadius: 8 }}>
                    <div style={{ fontWeight: 600, color: T.amber, fontSize: 13 }}>Amendment Log ({activeReport.amendments.length} addendum/addenda)</div>
                    {activeReport.amendments.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, color: T.slate, marginTop: 6 }}>
                        <strong>Addendum {i + 1}:</strong> {new Date(a.at).toLocaleString("en-GB")} by {a.by}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
              {(activeReport.status === "signed" || activeReport.status === "amended") && (
                <div style={{ marginTop: 20 }}>
                  <Btn label="📥 Download PDF Report" onClick={() => generatePDF(activeReport, user, appState.users)} color={T.purple} icon="📥" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
