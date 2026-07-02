
import { Hero, Section } from "@/components/Blocks";
import { resources } from "@/data/content";

export default function ResourcesPage() {
  return (
    <>
      <Hero title="可靠学习链接" desc="必要时查看官方/权威入口。不要每天刷文档，遇到具体卡点再查。" />

      <Section title="官方/权威文档">
        <div className="resourceList">
          {resources.map((item) => (
            <a href={item.url} target="_blank" rel="noopener noreferrer" key={item.url}>
              <b>{item.name}</b>
              <span>{item.url}</span>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
