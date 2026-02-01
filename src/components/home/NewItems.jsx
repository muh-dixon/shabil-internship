import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setItems(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch new items", err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function getCountdown(expiryDate) {
    const diff = new Date(expiryDate).getTime() - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>New Items</h2>
            <div className="small-border bg-color-2"></div>
          </div>

          {/* ---------------- LOADING STATE ---------------- */}
          {loading &&
            new Array(4).fill(0).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item skeleton">
                  <div className="nft__item_wrap skeleton-box"></div>
                  <div className="nft__item_info">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              </div>
            ))}

          {/* ---------------- DATA MAP ---------------- */}
          {!loading &&
            items.map((item) => (
              <div
                className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                key={item.id}
              >
                <div className="nft__item">
                  {/* AUTHOR */}
                  <div className="author_list_pp">
                    <Link
                      to={`/author/${item.authorId}`}
                      data-bs-toggle="tooltip"
                      title={item.authorName}
                    >
                      <img src={item.authorImage} alt={item.authorName} />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

                  {/* COUNTDOWN */}
                  <div className="de_countdown">
                    {getCountdown(item.expiryDate)}
                  </div>

                  {/* NFT IMAGE */}
                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                      </div>
                    </div>

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
      </div>
    </section>
  );
};

export default NewItems;
