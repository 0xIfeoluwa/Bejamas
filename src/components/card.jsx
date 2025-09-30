export function Card({ src, alt, category, title, price }) {
  return (
    <section className="card">
      <div className="card-img-container">
        <img src={src} alt={alt} />
        <button className="card-btn"> ADD TO CART</button>
      </div>
      <p className="card-category">{category}</p>
      <p className="card-title">{title}</p>
      <p className="card-price">{price}</p>
    </section>
  );
}
