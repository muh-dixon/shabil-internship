import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

const SkeletonCard = () => {
  return (
    <div className="nft_coll skeleton-card">
      <div className="nft_wrap skeleton-img"></div>

      <div className="nft_coll_pp skeleton-avatar"></div>

      <div className="nft_coll_info">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line subtitle"></div>
      </div>
    </div>
  );
};

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections",
        );
        const data = await res.json();

      
        setCollections(data);
      } catch (err) {
        console.error("Failed to fetch collections", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCollections();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          arrows: false, 
        },
      },
    ],
  };

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>

        {loading ? (
          <Slider {...sliderSettings}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </Slider>
        ) : (
          <Slider {...sliderSettings}>
            {collections.map((item) => (
              <div key={item.id}>
                <div className="nft_coll">
                  <div className="nft_wrap">
                    <Link to="/item-details">
                      <img
                        src={item.nftImage}
                        className="img-fluid"
                        alt={item.title}
                      />
                    </Link>
                  </div>

                  <div className="nft_coll_pp">
                    <Link to={`/author/${item.authorId}`}>
                      <img
                        className="pp-coll"
                        src={item.authorImage || "/images/author_thumbnail.jpg"}
                        alt={item.authorName}
                      />
                    </Link>
                    <i className="fa fa-check"></i>
                  </div>

                  <div className="nft_coll_info">
                    <Link to="/explore">
                      <h4>{item.title}</h4>
                    </Link>
                    <span>{item.code}</span>
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

export default HotCollections;
