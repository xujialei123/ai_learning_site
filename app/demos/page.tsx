
"use client";

import { useMemo, useState } from "react";
import { Hero, Section } from "@/components/Blocks";
import { featureMaps } from "@/data/content";

export default function DemosPage() {
  const [feature, setFeature] = useState(featureMaps[0].feature);
  const selectedFeature = useMemo(() => featureMaps.find((x) => x.feature === feature) || featureMaps[0], [feature]);

  const [resource, setResource] = useState("knowledge-docs");

  const [kb, setKb] = useState(`营业时间：工作日10:00-22:00，周末10:00-23:00。
退款规则：未使用套餐可在购买后7天内申请退款。
预约规则：周末需要提前一天预约。
地址：北京市朝阳区示例路88号。`);
  const [question, setQuestion] = useState("周末几点关门？");

  const terms = question.replace(/[？。，、]/g, " ").split(/\s+/).filter(Boolean);
  const chunks = kb.split(/\n+/).filter(Boolean);
  const scored = chunks
    .map((c, i) => ({ i: i + 1, c, score: terms.reduce((n, t) => n + (c.includes(t) ? 1 : 0), 0) }))
    .sort((a, b) => b.score - a.score);
  const top = scored.filter((x) => x.score > 0).slice(0, 3);
  const confidence = top.length ? Math.min(0.95, 0.45 + top[0].score * 0.2) : 0.2;

  const [total, setTotal] = useState(100);
  const [correct, setCorrect] = useState(82);
  const [refused, setRefused] = useState(10);
  const [halluc, setHalluc] = useState(4);

  return (
    <>
      <Hero title="练习 Demo 实验室" desc="这些 Demo 用来理解概念之间的关系，不依赖真实后端。你可以边操作边选词问 AI。" />

      <Section title="Demo 1：功能到技术栈拆解">
        <div className="demoPanel">
          <label>选择功能</label>
          <select value={feature} onChange={(e) => setFeature(e.target.value)}>
            {featureMaps.map((x) => <option key={x.feature}>{x.feature}</option>)}
          </select>
          <div className="demoOutput">
            {selectedFeature.stack.map((x, i) => `${i + 1}. ${x}`).join("\n")}
            {"\n\n风险点：\n"}
            {selectedFeature.risks.map((x, i) => `${i + 1}. ${x}`).join("\n")}
          </div>
        </div>
      </Section>

      <Section title="Demo 2：API 设计生成器">
        <div className="demoPanel">
          <label>资源名称</label>
          <input value={resource} onChange={(e) => setResource(e.target.value)} />
          <div className="demoOutput">
            {[
              `GET /api/${resource} - 查询列表，支持分页、筛选、排序`,
              `POST /api/${resource} - 创建资源，必须参数校验和权限校验`,
              `GET /api/${resource}/:id - 查询详情，必须校验数据归属`,
              `PATCH /api/${resource}/:id - 局部修改，必须审计日志`,
              `DELETE /api/${resource}/:id - 删除资源，必须防越权和二次确认`
            ].join("\n")}
          </div>
        </div>
      </Section>

      <Section title="Demo 3：RAG 检索与拒答判断">
        <div className="demoPanel">
          <label>知识库</label>
          <textarea rows={6} value={kb} onChange={(e) => setKb(e.target.value)} />
          <label>用户问题</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} />
          <div className="demoOutput">
            {`Top命中：\n${top.map((x) => `[${x.i}] score=${x.score} ${x.c}`).join("\n") || "无命中"}\n\n建议动作：${confidence < 0.55 ? "拒答或转人工" : "基于引用回答"}\n置信度模拟：${confidence.toFixed(2)}`}
          </div>
        </div>
      </Section>

      <Section title="Demo 4：AI 评估指标计算">
        <div className="demoPanel">
          <label>总问题数</label>
          <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} />
          <label>正确回答数</label>
          <input type="number" value={correct} onChange={(e) => setCorrect(Number(e.target.value))} />
          <label>正确拒答数</label>
          <input type="number" value={refused} onChange={(e) => setRefused(Number(e.target.value))} />
          <label>幻觉回答数</label>
          <input type="number" value={halluc} onChange={(e) => setHalluc(Number(e.target.value))} />
          <div className="demoOutput">
            {`准确率：${((correct / Math.max(total, 1)) * 100).toFixed(1)}%\n拒答率：${((refused / Math.max(total, 1)) * 100).toFixed(1)}%\n幻觉率：${((halluc / Math.max(total, 1)) * 100).toFixed(1)}%\n建议：${halluc / Math.max(total, 1) > 0.05 ? "优先降低幻觉：加强引用来源、拒答和评估集。" : correct / Math.max(total, 1) < 0.8 ? "优先提升检索和 Prompt 质量。" : "质量较好，继续观察成本和延迟。"}`}
          </div>
        </div>
      </Section>
    </>
  );
}
