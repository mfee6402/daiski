export default async function ProductDetail({ params }) {
  const { id } = await params;
  const res = await fetch(`http://localhost:3005/api/products/${id}`);
  if (!res.ok) {
    return <p>商品不存在或發生錯誤</p>;
  }
  const product = await res.json();

  return (
    <main>
      <h1>{product.name}</h1>
      {/* <p>價格：${product.price}</p> */}
      <p>分類：{product.category_id}</p>
      <section>
        <h2>介紹</h2>
        <p>{product.introduction}</p>
      </section>
      <section>
        <h2>規格</h2>
        <p>{product.spec}</p>
      </section>
      <p>發佈時間：{new Date(product.publishAt).toLocaleString()}</p>
    </main>
  );
}
