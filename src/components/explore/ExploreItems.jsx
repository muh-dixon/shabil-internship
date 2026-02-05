import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore";

const ITEMS_PER_LOAD = 8;

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const url = filter ? `${API_BASE}?filter=${filter}` : API_BASE;
        const res = await fetch(url);
        const data = await res.json();
        setItems(data);
        setVisibleCount(ITEMS_PER_LOAD);
      } catch (err) {
        console.error("Failed to fetch explore items", err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [filter]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  function getCountdown(expiryDate) {
    const diff = expiryDate - now;
    if (diff <= 0) return "Expired";

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return `${h}h ${m}m ${s}s`;
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
  }

  /* ---------------- RENDER ---------------- */
  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        {/* HEADER + FILTER */}
        <div className="explore-header">
          <h2>Explore Items</h2>

          <select
            id="filter-items"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Default</option>
            <option value="price_low_to_high">Price, Low to High</option>
            <option value="price_high_to_low">Price, High to Low</option>
            <option value="likes_high_to_low">Most liked</option>
          </select>
        </div>

        {/* GRID */}
        <div className="explore-grid">
          {loading &&
            [...Array(8)].map((_, i) => (
              <div key={i} className="explore-card skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-line title"></div>
                <div className="skeleton-line"></div>
              </div>
            ))}

          {!loading &&
            items.slice(0, visibleCount).map((item) => (
              <div key={item.id} className="explore-card">
                <div className="nft__item">
                  {/* AUTHOR */}
                  <div className="author_list_pp">
                    <Link to={`/author/${item.authorId}`}>
                      <img src={item.authorImage} alt="" />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

                  {/* COUNTDOWN */}
                  <div className="de_countdown">
                    {getCountdown(item.expiryDate)}
                  </div>

                  {/* IMAGE */}
                  <div className="nft__item_wrap">
                    <Link to={`/item/${item.nftId}`}>
                      <img
                        src={item.nftImage}
                        className="nft__item_preview"
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  {/* INFO */}
                  <div className="nft__item_info">
                    <Link to={`/item/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>

                    <div className="nft__item_price">{item.price} ETH</div>

                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* LOAD MORE */}
        {!loading && visibleCount < items.length && (
          <div className="text-center mt-4">
            <button className="btn-main lead" onClick={handleLoadMore}>
              Load more
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreItems;
