import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const API_URL =
  "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems";

const PrevArrow = ({ onClick }) => {
  return (
    <button
      className="carousel-arrow prev"
      onClick={onClick}
      aria-label="Previous"
    >
      ‹
    </button>
  );
};

const NextArrow = ({ onClick }) => {
  return (
    <button className="carousel-arrow next" onClick={onClick} aria-label="Next">
      ›
    </button>
  );
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch new items", err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  /* ---------------- LIVE TIMER ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function getCountdown(expiryDate) {
    const diff = new Date(expiryDate).getTime() - now;
    if (diff <= 0) return "Expired";

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    return `${h}h ${m}m ${s}s`;
  }

  /* ---------------- CAROUSEL SETTINGS ---------------- */
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="text-center">
          <h2>New Items</h2>
          <div className="small-border bg-color-2"></div>
        </div>

        {loading ? (
          <p className="text-center">Loading items...</p>
        ) : (
          <Slider {...settings}>
            {items.map((item) => (
              <div key={item.id}>
                <div className="nft__item">
                  {/* AUTHOR */}
                  <div className="author_list_pp">
                    <Link to={`/author/${item.authorId}`}>
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
          </Slider>
        )}
      </div>
    </section>
  );
};

export default NewItems;
