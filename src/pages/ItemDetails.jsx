import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EthImage from "../images/ethereum.svg";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchItem() {
      try {
        const res = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${id}`,
        );
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error("Failed to fetch item", err);
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                {/* LEFT IMAGE SKELETON */}
                <div className="col-md-6">
                  <div className="skeleton-img img-rounded"></div>
                </div>

                {/* RIGHT DETAILS SKELETON */}
                <div className="col-md-6">
                  <div className="item_info">
                    <div className="skeleton-line title"></div>

                    <div className="spacer-20"></div>

                    <div className="d-flex">
                      <div
                        className="skeleton-line"
                        style={{ width: "120px" }}
                      ></div>
                      <div
                        className="skeleton-line ml-3"
                        style={{ width: "120px" }}
                      ></div>
                    </div>

                    <div className="spacer-20"></div>

                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                    <div
                      className="skeleton-line"
                      style={{ width: "60%" }}
                    ></div>

                    <div className="spacer-30"></div>

                    {/* Owner Skeleton */}
                    <div className="d-flex align-items-center">
                      <div className="skeleton-avatar"></div>
                      <div className="ml-3 w-100">
                        <div
                          className="skeleton-line"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="spacer-30"></div>

                    {/* Creator Skeleton */}
                    <div className="d-flex align-items-center">
                      <div className="skeleton-avatar"></div>
                      <div className="ml-3 w-100">
                        <div
                          className="skeleton-line"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="spacer-30"></div>

                    {/* Price Skeleton */}
                    <div
                      className="skeleton-line"
                      style={{ width: "100px" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!item) {
    return <div className="container text-center">Item not found</div>;
  }

  const handleLike = () => {
    setLiked((prev) => !prev);
  };

  const displayedLikes = item.likes + (liked ? 1 : 0);

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              {/* NFT IMAGE */}
              <div className="col-md-6 text-center">
                <img
                  src={item.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={item.title}
                />
              </div>

              {/* ITEM DETAILS */}
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item.title}</h2>

                  {/* Views + Likes */}
                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {item.views}
                    </div>

                    <div
                      className="item_info_like"
                      style={{ cursor: "pointer" }}
                      onClick={handleLike}
                    >
                      <i
                        className={`fa fa-heart ${liked ? "text-danger" : ""}`}
                      ></i>
                      {displayedLikes}
                    </div>
                  </div>

                  <p>{item.description}</p>

                  {/* OWNER */}
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.ownerId}`}>
                            <img src={item.ownerImage} alt={item.ownerName} />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.ownerId}`}>
                            {item.ownerName}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CREATOR */}
                  <div className="spacer-40"></div>
                  <h6>Creator</h6>
                  <div className="item_author">
                    <div className="author_list_pp">
                      <Link to={`/author/${item.creatorId}`}>
                        <img src={item.creatorImage} alt={item.creatorName} />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    <div className="author_list_info">
                      <Link to={`/author/${item.creatorId}`}>
                        {item.creatorName}
                      </Link>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="spacer-40"></div>
                  <h6>Price</h6>
                  <div className="nft-item-price">
                    <img src={EthImage} alt="ETH" />
                    <span>{item.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
