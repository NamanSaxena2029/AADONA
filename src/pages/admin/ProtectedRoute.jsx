import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult();
        setIsAdmin(tokenResult.claims.admin === true);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen text-green-700 font-semibold">
        Checking Authentication...
      </div>
    );
  }

  if (!user) return <Navigate to="/namanisrockstar" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}