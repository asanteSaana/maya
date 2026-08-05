import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

/** Sends farmers to their dashboard and everyone else to sign-up. */
const FarmerCta = () => {
  const { isAuthenticated, isPartner, isReady } = useAuth();

  const href = isReady && isPartner ? "/farmer/dashboard" : "/register";
  const label =
    isReady && isPartner ? "Go to your dashboard" : "Start selling with Maya";

  return (
    <div className="text-center pt-40 wow fadeInUp delay-0-2s">
      <h3 className="mb-15">Grow your farm business</h3>
      <p className="mb-25">
        {isReady && isPartner
          ? "Manage your listings and fulfil incoming orders."
          : "List your harvest and sell directly to customers near you."}
      </p>
      <Link href={href}>
        <a className="theme-btn style-two">
          {label} <i className="fas fa-angle-double-right" />
        </a>
      </Link>
      {isReady && isAuthenticated && !isPartner && (
        <p className="pt-15 mb-0">
          <small>
            You are signed in as a customer — selling needs a farmer account.
          </small>
        </p>
      )}
    </div>
  );
};

export default FarmerCta;
