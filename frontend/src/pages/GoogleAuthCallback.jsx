import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getProfile, refreshAccessToken } from "../api/auth";
import { setCredentials } from "../store/authSlice";

const hasCompleteProfile = (user) => {
  return Boolean(user.phone && user.gender && user.dob && (user.role === "provider" || user.address));
};

const GoogleAuthCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const completeGoogleLogin = async () => {
      try {
        const [tokenRes, profileRes] = await Promise.all([
          refreshAccessToken(),
          getProfile(),
        ]);

        const user = profileRes.data;

        dispatch(setCredentials({
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            address: user.address,
            profilePic: user.profilePic,
          },
          accessToken: tokenRes.data.accessToken,
        }));

        toast.success("Google login successful!");

        if (!hasCompleteProfile(user)) {
          toast.info("Please complete your profile details.");
          navigate("/edit-profile", { replace: true });
        } else if (user.role === "provider") {
          navigate("/provider-dashboard", { replace: true });
        } else if (user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Google login failed");
        navigate("/login", { replace: true });
      }
    };

    completeGoogleLogin();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] px-4">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[var(--primary)]">Finishing Google login</h1>
        <p className="text-sm text-[var(--text-secondary)]">Please wait...</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
