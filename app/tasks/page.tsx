
"use client";

import { useEffect, useMemo, useState } from "react";
import { Hero, Section } from "@/components/Blocks";
import { learningTasks } from "@/data/content";

const STORAGE_KEY = "learning-tasks-progress-v1";

export default function TasksPage() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      // 本地数据损坏时从零开始
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done, loaded]);

  const doneCount = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const percent = Math.round((doneCount / learningTasks.length) * 100);
  const nextIndex = learningTasks.findIndex((_, i) => !done[i]);

  function toggle(index: number) {
    setDone((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  function reset() {
    if (confirm("确定清空所有打卡记录吗？")) setDone({});
  }

  return (
    <>
      <Hero title="任务制学习计划" desc="不用自己每天系统规划，直接按这个表执行。每天完成一个任务就打卡，进度保存在浏览器本地。" />

      <Section title="我的进度">
        <div className="progressWrap">
          <div className="progressMeta">
            <b>{doneCount} / {learningTasks.length} 个任务</b>
            <span>{percent}%</span>
          </div>
          <div className="progressBar">
            <div className="progressFill" style={{ width: `${percent}%` }} />
          </div>
          {nextIndex >= 0 ? (
            <p className="progressNext">下一个任务：<b>第 {nextIndex + 1} 天</b> — {learningTasks[nextIndex]}</p>
          ) : (
            <p className="progressNext">全部完成，非常棒！可以回头复盘薄弱的知识点，或去面试题库自测。</p>
          )}
          <button className="ghost" onClick={reset}>清空打卡记录</button>
        </div>
      </Section>

      <Section title="每天固定流程">
        <ol>
          <li>先看对应知识页面。</li>
          <li>再用自己的话解释是什么和为什么。</li>
          <li>再说明它在 AI 客服项目中用在哪里。</li>
          <li>再做当天产出。</li>
          <li>最后让 AI 检查你的理解是否准确（选中文字或按 Alt + A 提问）。</li>
        </ol>
      </Section>

      <Section title="任务清单">
        <div className="taskList">
          {learningTasks.map((task, index) => (
            <label className={`taskItem${done[index] ? " done" : ""}`} key={task}>
              <input
                type="checkbox"
                checked={!!done[index]}
                onChange={() => toggle(index)}
              />
              <span className="taskDay">第 {index + 1} 天</span>
              <span className="taskText">{task}</span>
            </label>
          ))}
        </div>
      </Section>
    </>
  );
}
