
import { Hero, Section } from "@/components/Blocks";
import { resources } from "@/data/content";

export default function ResourcesPage() {
  const categories = Array.from(new Set(resources.map((r) => r.category)));

  return (
    <>
      <Hero title="可靠学习链接" desc="按主题分类的官方/权威入口。不要每天刷文档，遇到具体卡点再来查对应的那一篇。" />

      {categories.map((cat) => (
        <Section title={cat} key={cat}>
          <div className="resourceList">
            {resources
              .filter((r) => r.category === cat)
              .map((item) => (
                <a href={item.url} target="_blank" rel="noopener noreferrer" key={item.url}>
                  <b>{item.name}</b>
                  {item.note && <em>{item.note}</em>}
                  <span>{item.url}</span>
                </a>
              ))}
          </div>
        </Section>
      ))}
    </>
  );
}
