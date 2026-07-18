type IndependentStayNoticeProps = { title: string; description: string };
export function IndependentStayNotice({ title, description }: IndependentStayNoticeProps) {
  return (
    <aside className="independentNotice">
      <h2>{title}</h2>
      <p>{description}</p>
    </aside>
  );
}
