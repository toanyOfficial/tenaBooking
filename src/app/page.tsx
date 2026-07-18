import { defaultLocale, messages } from '@/locales/messages';
import styles from './page.module.css';

const sections = messages[defaultLocale].sections;

function PrototypeSection({ title }: { title: string }) {
  return (
    <section className={styles.section} aria-labelledby={title}>
      <h2 id={title}>{title}</h2>
      <p>다음 단계에서 세부 기능이 연결됩니다.</p>
    </section>
  );
}

export default function Home() {
  return (
    <main className={styles.shell}>
      <header className={styles.brandArea}>
        <p className={styles.eyebrow}>Hospital Connected Residence</p>
        <h1>{messages[defaultLocale].brand}</h1>
        <p className={styles.lead}>진료 일정과 회복에 집중할 수 있는 프리미엄 숙소 예약 기반 화면입니다.</p>
      </header>

      <PrototypeSection title={sections.language} />
      <PrototypeSection title={sections.dates} />
      <PrototypeSection title={sections.roomImage} />
      <PrototypeSection title={sections.roomInfo} />
      <PrototypeSection title={sections.payment} />
      <PrototypeSection title={sections.policy} />
      <PrototypeSection title={sections.notice} />
      <PrototypeSection title={sections.contact} />
    </main>
  );
}
