
import { Hero, Section } from "@/components/Blocks";
import { learningTasks } from "@/data/content";

export default function TasksPage() {
  return (
    <>
      <Hero title="60 天任务制学习" desc="不用你自己每天系统规划，直接按这个表执行。每一天都有一个明确产出。" />

      <Section title="每天固定流程">
        <ol>
          <li>先看对应知识页面。</li>
          <li>再用自己的话解释是什么和为什么。</li>
          <li>再说明它在 AI 客服项目中用在哪里。</li>
          <li>再做当天产出。</li>
          <li>最后让 AI 检查你的理解是否准确。</li>
        </ol>
      </Section>

      <Section title="60 天任务表">
        <div className="tableWrap">
          <table>
            <thead><tr><th>天数</th><th>任务</th></tr></thead>
            <tbody>
              {learningTasks.map((task, index) => (
                <tr key={task}>
                  <td>第 {index + 1} 天</td>
                  <td>{task}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
