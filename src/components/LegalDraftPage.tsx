const titles: Record<string, string> = { terms: '이용약관', privacy: '개인정보처리방침', 'refund-policy': '환불정책', 'house-rules': '숙소 이용규칙' };
export function LegalDraftPage({ type }: { type: keyof typeof titles }) {
  return <main className="legalPage"><a href="/">← 돌아가기</a><section className="card"><p className="eyebrow">Prototype draft</p><h1>{titles[type]}</h1><p>이 문서는 프로토타입용 준비 중 페이지입니다. 실제 확정 약관 또는 법률 문서가 아니며, 정식 서비스 전 별도 검토가 필요합니다.</p></section></main>;
}
