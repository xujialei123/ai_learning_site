import type { KnowledgeGroup, KnowledgeItem } from "@/data/content";
import { knowledgeMemoryPatches } from "@/data/knowledgeMemory";

export function enrichKnowledgeItem(item: KnowledgeItem): KnowledgeItem {
  const patch = knowledgeMemoryPatches[item.name];
  if (!patch) return item;
  return {
    ...item,
    ...patch,
    keyPoints: patch.keyPoints ?? item.keyPoints,
    interviewQA: patch.interviewQA ?? item.interviewQA
  };
}

export function enrichKnowledgeGroup(group: KnowledgeGroup): KnowledgeGroup {
  return {
    ...group,
    items: group.items.map(enrichKnowledgeItem)
  };
}

/** 从 understanding 的「1) 2)」格式拆成要点，供未补丁的条目兜底展示 */
export function splitUnderstandingPoints(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/；(?=\d+\))/)
    .map((s) => s.trim())
    .filter(Boolean);
}
