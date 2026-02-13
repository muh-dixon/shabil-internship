import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 4;

const AuthorItems = ({ items = [], authorImage, loading }) => {
  const [visible, setVisible] = useState(ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="row">
        {[...Array(4)].map((_, index) => (
          <div className="col-lg-3 col-md-6 col-sm-6" key={index}>
            <div className="nft__item skeleton-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-line title"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row">
      {items.slice(0, visible).map((item) => (
        <div className="col-lg-3 col-md-6 col-sm-6" key={item.id}>
          <div className="nft__item">
            <div className="author_list_pp">
              <img src={authorImage} alt="Author" />
              <i className="fa fa-check"></i>
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

      {visible < items.length && (
        <div className="col-md-12 text-center">
          <button
            className="btn-main"
            onClick={() => setVisible((v) => v + ITEMS_PER_PAGE)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthorItems;
