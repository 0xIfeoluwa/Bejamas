export function Card({ src, alt, category, title, price, onClick }) {
  return (
    <section className="card">
      <div className="card-img-container">
        <img
          src={src}
          alt={alt}
          // height={390.6706848144531}
          // width={271.951416015625}
        />
        <button className="card-btn" onClick={onClick}>
          {" "}
          ADD TO CART
        </button>
      </div>
      <p className="card-category">{category}</p>
      <p className="card-title">{title}</p>
      <p className="card-price">{price}</p>
    </section>
  );
}
