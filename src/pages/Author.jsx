import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthorItems from "../components/author/AuthorItems";
import AuthorBanner from "../images/author_banner.jpg";

const shortenAddress = (addr) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    async function fetchAuthor() {
      try {
        const res = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        const data = await res.json();
        setAuthor(data);
      } catch (err) {
        console.error("Failed to fetch author", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthor();
  }, [authorId]);

  if (loading) {
    return <div className="container text-center">Loading author...</div>;
  }

  if (!author) {
    return <div className="container text-center">Author not found</div>;
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">

        {/* ✅ AUTHOR BANNER */}
        <section
          id="profile_banner"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) center / cover` }}
        />

        <section>
          <div className="container">
            <div className="row">

              {/* PROFILE HEADER */}
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img src={author.authorImage} alt={author.authorName} />
                      <i className="fa fa-check"></i>

                      <div className="profile_name">
                        <h4>
                          {author.authorName}
                          <span className="profile_username">
                            @{author.tag}
                          </span>
                          <span className="profile_wallet">
                            {shortenAddress(author.address)}
                          </span>
                          <button
                            id="btn_copy"
                            onClick={() =>
                              navigator.clipboard.writeText(author.address)
                            }
                          >
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">
                        {author.followers + (following ? 1 : 0)} followers
                      </div>
                      <button
                        className="btn-main"
                        onClick={() => setFollowing(f => !f)}
                      >
                        {following ? "Unfollow" : "Follow"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AUTHOR NFTS */}
              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems
                    items={author.nftCollection}
                    authorImage={author.authorImage}
                    authorName={author.authorName}
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
