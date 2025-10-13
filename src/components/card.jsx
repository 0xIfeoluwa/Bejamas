export function Card({ src, alt, category, title, price, onClick, isPremium }) {
  return (
    <section className="card">
      <div className="card-img-container">
        {isPremium && (
          <div className="absolute top-2 left-2 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full z-10">
            Premium
          </div>
        )}
        <img src={src} alt={alt} />
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
