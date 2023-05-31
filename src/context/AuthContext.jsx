import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signUp = async (email, password) => {
    try {
      const coinUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", email), {
        watchList: [],
      });
      setUser(coinUser.user);
      navigate("/account");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      }
      if (error.code === "auth/weak-password") {
        setError("Weak password. At least 6 characters required");
      }
    }
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const logOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <UserContext.Provider value={{ signUp, signIn, logOut, user, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
