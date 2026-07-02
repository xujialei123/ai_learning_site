
export type InterviewDifficulty = "基础" | "中级" | "高级" | "综合";
export type InterviewCategory =
  | "前端"
  | "后端"
  | "数据库"
  | "Redis"
  | "架构"
  | "AI应用"
  | "RAG"
  | "Agent"
  | "部署运维"
  | "安全"
  | "综合";

export type InterviewQuestion = {
  id: string;
  question: string;
  answer: string;
  category: InterviewCategory;
  difficulty: InterviewDifficulty;
  tags: string[];
  source: "agnes" | "manual";
  topic: string;
  createdAt: number;
};

const DB_NAME = "ai-learning-interview-db";
const DB_VERSION = 1;
const STORE_NAME = "questions";

function ensureBrowser() {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    throw new Error("当前环境不支持 IndexedDB。");
  }
}

export function openInterviewDb(): Promise<IDBDatabase> {
  ensureBrowser();

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("category", "category", { unique: false });
        store.createIndex("difficulty", "difficulty", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("topic", "topic", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveInterviewQuestions(items: InterviewQuestion[]) {
  const db = await openInterviewDb();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    items.forEach((item) => store.put(item));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listInterviewQuestions(): Promise<InterviewQuestion[]> {
  const db = await openInterviewDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const items = (request.result || []) as InterviewQuestion[];
      resolve(items.sort((a, b) => b.createdAt - a.createdAt));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteInterviewQuestion(id: string) {
  const db = await openInterviewDb();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearInterviewQuestions() {
  const db = await openInterviewDb();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function exportQuestionsAsJson(items: InterviewQuestion[]) {
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `interview-questions-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
