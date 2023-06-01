import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { db } from "../firebase";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";

// displaying and managing a user's saved coins

const SavedCoin = () => {
  const [coins, setCoins] = useState([]);
  const { user } = UserAuth();

  // fetch the user's saved coins from the Firebase Firestore database when the component mounts or when the "user.email" value changes
  useEffect(() => {
    onSnapshot(doc(db, "users", `${user?.email}`), (doc) => {
      setCoins(doc.data()?.watchList);
    });
  }, [user?.email]);

  const coinPath = doc(db, "users", `${user?.email}`);
  const deleteCoin = async (passedid) => {
    try {
      const result = coins.filter((item) => item.id !== passedid); // makes a new list called "result" that doesn't include the coin you want to remove
      await updateDoc(coinPath, {
        watchList: result,
      });
    } catch (e) {}
  };

  return (
    <div>
      {coins?.length === 0 ? (
        <p>
          You don't have any coins saved. Please save a coin to add it to your
          watch list. Click{" "}
          <Link
            to="/"
            className="bg-button text-btnText rounded shadow-lg hover:shadow-2xl"
          >
            here
          </Link>{" "}
          to search coins.
        </p>
      ) : (
        <table className="w-full border-collapse text-center ">
          <thead>
            <tr className="border-b">
              <th className="px-4">Rank #</th>
              <th className="text-left">Coin</th>
              <th className="text-left">Remove</th>
            </tr>
          </thead>
          <tbody>
            {coins?.map((coin) => (
              <tr key={coin.id} className="h-[60px] overflow-hidden">
                <td>{coin?.rank}</td>
                <td className="hover:scale-105 ease-in-out duration-300">
                  <Link to={`/coin/${coin.id}`}>
                    <div className="flex items-center">
                      <img src={coin?.image} className="w-8 mr-4" alt="/" />
                      <div>
                        <p className="hidden sm:table-cell">{coin?.name}</p>
                        <p className="text-gray-500 text-left text-sm">
                          {coin?.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="pl-8">
                  <AiOutlineClose
                    onClick={() => deleteCoin(coin.id)}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SavedCoin;
