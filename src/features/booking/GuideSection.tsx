'use client';

import { useState } from 'react';

type GuideCopy = { title: string; importantTitle: string; importantDescription: string; items: Array<{ title: string; description: string }> };

export function GuideSection({ copy, hideTitle = false }: { copy: GuideCopy; hideTitle?: boolean }) {
  const [openIndex, setOpenIndex] = useState(-1);
  return (
    <section className="card guideSectionCard" aria-labelledby="guide-title">
      {hideTitle ? <span id="guide-title" className="srOnly">{copy.title}</span> : <h2 id="guide-title">{copy.title}</h2>}
      <aside className="importantNotice"><h3>{copy.importantTitle}</h3><p>{copy.importantDescription}</p></aside>
      <div className="guideList">
        {copy.items.map((item, index) => {
          const open = openIndex === index;
          const panelId = `guide-panel-${index}`;
          return (
            <article key={item.title} className="guideAccordionItem">
              <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpenIndex(open ? -1 : index)}>
                <span>{item.title}</span><span aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
              <p id={panelId} className="guideAccordionPanel" hidden={!open}>{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
