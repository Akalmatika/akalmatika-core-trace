// src/services/progressStorage.ts

// ─── Tipe Data ───────────────────────────────────────────

export interface DiagnosticResult {
  topicId: string;
  date: string;                           // ISO date
  isPerfectTrack: boolean;
  detectedMisconceptionCode: string | null;
  /** Tingkat keyakinan/kepercayaan mesin bahwa pola jawaban cocok dengan miskonsepsi ini (0-100%). BUKAN nilai ujian siswa. */
  confidence: number;
  /** Rasio kecocokan jawaban siswa dengan signature jawaban salah dari aturan miskonsepsi (misal: "2/2", "0/2"). BUKAN nilai ujian siswa. */
  matchRatio: string;
  answers: (number | string)[];
}

export interface BridgeVisit {
  topicId: string;
  misconceptionCode: string;
  visitedDate: string;
  completedVisualization: boolean;
  /** Menandakan apakah siswa telah mengklik tombol untuk membuka media visualisasi. */
  visualizationOpened: boolean;
}

export interface DrillProgress {
  topicId: string;
  currentPhase: 1 | 2 | 3;
  phase1Completed: boolean;
  phase2Accuracy: number;
  phase3Accuracy: number;
  totalAttempts: number;
  lastAttemptDate: string;
}

export interface MasteryResult {
  topicId: string;
  passed: boolean;
  score: number;
  attemptDate: string;
}

export type MasteryLevel = 'not-started' | 'diagnosed' | 'bridging' | 'drilling' | 'mastered';

export interface TopicProgress {
  topicId: string;
  masteryLevel: MasteryLevel;
  diagnosticResults: DiagnosticResult[];
  bridgeVisits: BridgeVisit[];
  drillProgress: DrillProgress | null;
  masteryResults: MasteryResult[];
}

// ─── Konfigurasi & Helper Internal ─────────────────────────

const STORAGE_KEY = 'akalmatika_progress';

const ALL_TOPICS = ['integer', 'fractions', 'percent', 'mixed-operations', 'algebra', 'plsv'];

const PREREQUISITES: Record<string, string[]> = {
  'integer': [],
  'fractions': ['integer'],
  'percent': ['fractions'],
  'mixed-operations': ['integer', 'fractions'],
  'algebra': ['integer', 'fractions'],
  'plsv': ['algebra']
};

interface ProgressStore {
  topics: Record<string, TopicProgress>;
}

/**
 * Menormalisasi ID topik agar konsisten di seluruh aplikasi.
 * Mendukung ID dalam Bahasa Inggris dan Bahasa Indonesia.
 */
function normalizeTopicId(id: string): string {
  switch (id.toLowerCase()) {
    case 'bilangan-bulat':
      return 'integer';
    case 'pecahan':
      return 'fractions';
    case 'persen':
      return 'percent';
    case 'aljabar':
      return 'algebra';
    case 'operasi-campuran':
    case 'mixed-ops':
      return 'mixed-operations';
    default:
      return id;
  }
}

/**
 * Membaca data progress secara utuh dari localStorage.
 */
function readStore(): ProgressStore {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { topics: {} };
    }
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === 'object' && parsed.topics && typeof parsed.topics === 'object') {
      return parsed as ProgressStore;
    }
  } catch (e) {
    console.error('Gagal membaca progress dari localStorage:', e);
  }
  return { topics: {} };
}

/**
 * Menulis data progress secara utuh ke localStorage.
 */
function writeStore(store: ProgressStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Gagal menyimpan progress ke localStorage:', e);
  }
}

/**
 * Mengambil progress untuk topik tertentu. Jika belum ada, buat progress baru berstatus kosong.
 */
function getOrCreateTopicProgress(store: ProgressStore, topicId: string): TopicProgress {
  const normId = normalizeTopicId(topicId);
  if (!store.topics[normId]) {
    store.topics[normId] = {
      topicId: normId,
      masteryLevel: 'not-started',
      diagnosticResults: [],
      bridgeVisits: [],
      drillProgress: null,
      masteryResults: []
    };
  }
  return store.topics[normId];
}

/**
 * Menghitung tingkat penguasaan (MasteryLevel) berdasarkan aturan alur belajar.
 */
function computeMasteryLevel(progress: TopicProgress): MasteryLevel {
  const isMastered = progress.masteryResults.some(r => r.passed);
  if (isMastered) return 'mastered';
  
  if (progress.drillProgress !== null) return 'drilling';
  
  if (progress.bridgeVisits.length > 0) return 'bridging';
  
  if (progress.diagnosticResults.length > 0) return 'diagnosed';
  
  return 'not-started';
}

// ─── API Publik ───────────────────────────────────────────

// Diagnosis
export function saveDiagnosticResult(result: DiagnosticResult): void {
  const store = readStore();
  const normId = normalizeTopicId(result.topicId);
  const topicProgress = getOrCreateTopicProgress(store, normId);
  
  const normalizedResult: DiagnosticResult = {
    ...result,
    topicId: normId
  };
  
  topicProgress.diagnosticResults.push(normalizedResult);
  topicProgress.masteryLevel = computeMasteryLevel(topicProgress);
  
  writeStore(store);
}

export function getDiagnosticResults(topicId: string): DiagnosticResult[] {
  const store = readStore();
  const normId = normalizeTopicId(topicId);
  return store.topics[normId]?.diagnosticResults || [];
}

export function getLatestDiagnostic(topicId: string): DiagnosticResult | null {
  const results = getDiagnosticResults(topicId);
  if (results.length === 0) return null;
  return results[results.length - 1];
}

// Bridge
export function saveBridgeVisit(visit: BridgeVisit): void {
  const store = readStore();
  const normId = normalizeTopicId(visit.topicId);
  const topicProgress = getOrCreateTopicProgress(store, normId);
  
  const normalizedVisit: BridgeVisit = {
    ...visit,
    topicId: normId
  };
  
  const existingIdx = topicProgress.bridgeVisits.findIndex(
    v => v.misconceptionCode === visit.misconceptionCode
  );
  
  if (existingIdx !== -1) {
    topicProgress.bridgeVisits[existingIdx] = normalizedVisit;
  } else {
    topicProgress.bridgeVisits.push(normalizedVisit);
  }
  
  topicProgress.masteryLevel = computeMasteryLevel(topicProgress);
  writeStore(store);
}

export function getBridgeVisits(topicId: string): BridgeVisit[] {
  const store = readStore();
  const normId = normalizeTopicId(topicId);
  return store.topics[normId]?.bridgeVisits || [];
}

// Drill
export function saveDrillProgress(progress: DrillProgress): void {
  const store = readStore();
  const normId = normalizeTopicId(progress.topicId);
  const topicProgress = getOrCreateTopicProgress(store, normId);
  
  topicProgress.drillProgress = {
    ...progress,
    topicId: normId
  };
  
  topicProgress.masteryLevel = computeMasteryLevel(topicProgress);
  writeStore(store);
}

export function getDrillProgress(topicId: string): DrillProgress | null {
  const store = readStore();
  const normId = normalizeTopicId(topicId);
  return store.topics[normId]?.drillProgress || null;
}

// Mastery
export function saveMasteryResult(result: MasteryResult): void {
  const store = readStore();
  const normId = normalizeTopicId(result.topicId);
  const topicProgress = getOrCreateTopicProgress(store, normId);
  
  const normalizedResult: MasteryResult = {
    ...result,
    topicId: normId
  };
  
  topicProgress.masteryResults.push(normalizedResult);
  topicProgress.masteryLevel = computeMasteryLevel(topicProgress);
  writeStore(store);
}

export function getMasteryResults(topicId: string): MasteryResult[] {
  const store = readStore();
  const normId = normalizeTopicId(topicId);
  return store.topics[normId]?.masteryResults || [];
}

export function isTopicMastered(topicId: string): boolean {
  const results = getMasteryResults(topicId);
  return results.some(r => r.passed);
}

// Agregat
export function getTopicProgress(topicId: string): TopicProgress {
  const store = readStore();
  const normId = normalizeTopicId(topicId);
  
  if (store.topics[normId]) {
    return store.topics[normId];
  }
  
  return {
    topicId: normId,
    masteryLevel: 'not-started',
    diagnosticResults: [],
    bridgeVisits: [],
    drillProgress: null,
    masteryResults: []
  };
}

export function getAllProgress(): TopicProgress[] {
  const store = readStore();
  return ALL_TOPICS.map(topicId => {
    if (store.topics[topicId]) {
      return store.topics[topicId];
    }
    return {
      topicId,
      masteryLevel: 'not-started',
      diagnosticResults: [],
      bridgeVisits: [],
      drillProgress: null,
      masteryResults: []
    };
  });
}

export function getMasteryLevel(topicId: string): MasteryLevel {
  const progress = getTopicProgress(topicId);
  return progress.masteryLevel;
}

// Learning Map
export function isTopicUnlocked(topicId: string): boolean {
  const normId = normalizeTopicId(topicId);
  const prereqs = PREREQUISITES[normId];
  if (!prereqs || prereqs.length === 0) return true;
  
  return prereqs.every(prereq => isTopicMastered(prereq));
}

export function getAvailableTopics(): string[] {
  return ALL_TOPICS.filter(topicId => isTopicUnlocked(topicId));
}

// Singleton Export
export const progressStorage = {
  saveDiagnosticResult,
  getDiagnosticResults,
  getLatestDiagnostic,
  saveBridgeVisit,
  getBridgeVisits,
  saveDrillProgress,
  getDrillProgress,
  saveMasteryResult,
  getMasteryResults,
  isTopicMastered,
  getTopicProgress,
  getAllProgress,
  getMasteryLevel,
  isTopicUnlocked,
  getAvailableTopics
};
