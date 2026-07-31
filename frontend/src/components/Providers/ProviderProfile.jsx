import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api/config";

const StarDisplay = ({ rating, size = "text-sm" }) => {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={size}
          style={{ color: star <= rating ? "#f59e0b" : "var(--border)" }}
        >
          ★
        </span>
      ))}
    </span>
  );
};

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${API_URL}/users/${id}`);
        setProvider(userRes.data);

        const serviceRes = await axios.get(
          `${API_URL}/services?provider=${id}`
        );
        setServices(serviceRes.data);

        // Fetch reviews for all services of this provider
        if (serviceRes.data.length > 0) {
          const serviceId = serviceRes.data[0]._id;
          const reviewsRes = await axios.get(
            `${API_URL}/bookings/service/${serviceId}/reviews`
          );
          setReviews(reviewsRes.data);
        }

      } catch (err) {
        console.error("Error fetching provider:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg)] px-4">
        <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 max-w-md w-full shadow-xs">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-bold text-[var(--text)]">Provider not found</h3>
          <p className="text-[var(--text-secondary)] text-sm mt-1">This service provider profile could not be loaded.</p>
        </div>
      </div>
    );
  }

  const avgRating = services[0]?.rating || 0;
  const totalReviews = services[0]?.totalReviews || 0;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-6 md:px-12 py-10 transition-colors duration-200">
      
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 text-center md:text-left md:flex md:items-center md:gap-8 shadow-xs">
          <img
            src={provider.profilePic || "/user.png"}
            alt={provider.name}
            className="w-28 h-28 rounded-full object-cover mx-auto md:mx-0 border-4 border-[var(--primary-light)] shadow-sm"
            onError={(e) => {
              e.target.src = "https://img.icons8.com/color/96/user-male-circle--v1.png";
            }}
          />
          <div className="mt-4 md:mt-0 space-y-1">
            <h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
              {provider.name}
            </h1>
            <p className="text-sm text-[var(--text-muted)] font-medium">
              @{provider.username}
            </p>
            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
              <span className="text-xs font-bold uppercase bg-[var(--primary-light)] text-[var(--primary)] px-3 py-1 rounded-full border border-[var(--primary-border)]/50">
                Verified Provider
              </span>
              {totalReviews > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-bold bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-full border border-yellow-500/15">
                  <StarDisplay rating={Math.round(avgRating)} size="text-xs" />
                  {avgRating} ({totalReviews})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {provider.providerDetails?.bio && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-[var(--text)] tracking-tight mb-3">About</h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed whitespace-pre-line">
              {provider.providerDetails.bio}
            </p>
          </div>
        )}

        {/* Services Section */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text)] tracking-tight mb-6">
            Services Offered by {provider.name}
          </h2>

          {services.length === 0 ? (
            <p className="text-[var(--text-secondary)] text-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 text-center">No services listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div 
                  key={s._id} 
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded border border-[var(--primary-border)]/40">
                      {s.category}
                    </span>
                    <h3 className="font-bold text-base text-[var(--text)] pt-1">{s.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">{s.description}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[var(--border)]/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block">Price</span>
                      <span className="font-extrabold text-[var(--primary)]">Rs. {s.price}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/book/${s._id}`)}
                      className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs px-4 py-2 rounded-xl font-bold tracking-wide transition duration-200 cursor-pointer shadow-xs active:scale-98"
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text)] tracking-tight">
              Customer Reviews
            </h2>
            {totalReviews > 0 && (
              <span className="text-xs font-bold bg-[var(--bg-card-hover)] text-[var(--text-secondary)] px-3 py-1 rounded-full border border-[var(--border)]">
                {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Rating Summary Card */}
          {totalReviews > 0 && (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-4xl font-black text-yellow-500">{avgRating}</p>
                  <StarDisplay rating={Math.round(avgRating)} size="text-lg" />
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">{totalReviews} total</p>
                </div>
                <div className="h-16 w-px bg-[var(--border)]"></div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length;
                    const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="text-[var(--text-muted)] font-bold w-4 text-right">{star}</span>
                        <span className="text-yellow-500 text-xs">★</span>
                        <div className="flex-1 h-2 bg-[var(--bg-card-hover)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <span className="text-[var(--text-muted)] font-medium w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Individual Reviews */}
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
              <div className="text-3xl mb-3">💬</div>
              <p className="text-[var(--text-secondary)] text-sm">No reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={review.customer?.profilePic || "/user.png"}
                      alt={review.customer?.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[var(--border)] flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "https://img.icons8.com/color/96/user-male-circle--v1.png";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-[var(--text)] leading-tight">
                            {review.customer?.name}
                          </h4>
                          <p className="text-xs text-[var(--text-muted)]">@{review.customer?.username}</p>
                        </div>
                        <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                          {new Date(review.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="mt-2">
                        <StarDisplay rating={review.rating} />
                      </div>

                      {review.reviewComment && (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2">
                          {review.reviewComment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ProviderProfile;
