import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers";

const TopSellerSkeleton = () => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
      <div className="top-seller-card skeleton-card">
        {/* AVATAR + RANK WRAPPER */}
        <div className="avatar-wrap">
          <div
            className="skeleton-avatar"
            style={{
              width: "72px",
              height: "72px",
              margin: "0",
            }}
          ></div>

          {/* Rank Badge Skeleton */}
          <div
            className="rank-badge skeleton-rank"
            style={{
              top: "-6px",
              left: "-6px",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
            }}
          ></div>
        </div>

        {/* INFO */}
        <div className="seller-info">
          <div
            className="skeleton-line title"
            style={{ width: "60%", margin: "10px auto 6px" }}
          ></div>
          <div
            className="skeleton-line"
            style={{ width: "40%", margin: "0 auto" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    async function fetchTopSellers() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // limit to 12 sellers
        const sorted = [...data].sort((a, b) => b.price - a.price).slice(0, 12);

        setSellers(sorted);
      } catch (err) {
        console.error("Failed to fetch top sellers", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopSellers();
  }, []);

  return (
    <section id="section-sellers">
      <div className="container">
        {/* TITLE */}
        <div className="text-center">
          <h2>Top Sellers</h2>
          <div className="small-border bg-color-2"></div>
        </div>

        {/* SELLERS LIST */}
        <div className="row top-sellers-list">
          {/* LOADING */}
          {loading &&
            new Array(12).fill(0).map((_, i) => <TopSellerSkeleton key={i} />)}

          {/* DATA */}
          {!loading &&
            sellers
              .sort((a, b) => b.price - a.price)
              .map((seller, index) => (
                <div
                  key={seller.id}
                  className="col-lg-3 col-md-4 col-sm-6 col-xs-12"
                >
                  <div className="top-seller-card">
                    <div className="avatar-wrap">
                      <Link to={`/author/${seller.authorId}`}>
                        <img
                          src={seller.authorImage}
                          alt={seller.authorName}
                          className="seller-avatar"
                        />
                      </Link>

                      {/* RANK BADGE */}
                      <div className={`rank-badge rank-${index + 1}`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* INFO */}
                    <div className="seller-info">
                      <Link to={`/author/${seller.authorId}`}>
                        <h4>{seller.authorName}</h4>
                      </Link>
                      <span>{seller.price} ETH</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
