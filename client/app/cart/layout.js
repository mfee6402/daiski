import Container from '@/components/container';

export default function CartLayout({ children }) {
  return (
    <>
      {/* FIXME 測試用高度，之後h-[500]要刪掉 */}
      <div className="relative h-[500]">
        <Container>{children}</Container>
      </div>
    </>
  );
}
