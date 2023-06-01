import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// This code handles user authentication using Firebase and provides the necessary function
// and data for managing user sign-up, sign-in, and sign-out operations.

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
        // if successful, creates a document in the Firestore database for the new user.
        watchList: [],
      });
      setUser(coinUser.user); // update the user state with the newly created user
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
      // It takes a callback function that will be executed whenever the authentication state changes
      setUser(currentUser);
    });
    return () => {
      unsubscribe(); // It ensures that the component unsubscribes from the authentication state changes when it unmounts
    };
  }, []);
  return (
    <UserContext.Provider value={{ signUp, signIn, logOut, user, error }}>
      {children}
    </UserContext.Provider>
  );
};

// This allows other components to access the authentication-related data and functions provided by the AuthContextProvider.
export const UserAuth = () => {
  return useContext(UserContext);
};
