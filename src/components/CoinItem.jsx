import React, { useState, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";
import Modal from "react-modal";
import { db } from "../firebase";
import {
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { UserAuth } from "../context/AuthContext";

// This code displays information about cryptocurrency coins in a table row. It allows users to save or remove coins from their
// watchlist. If the user is not authenticated, a modal dialog prompts them to sign in or sign up.
// This component can be used to render individual coin items in a cryptocurrency tracking application.

const CoinItem = ({ coin }) => {
  const [savedCoin, setSavedCoin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user } = UserAuth();

  const coinPath = doc(db, "users", `${user?.email}`); // "?" is for  optional chaining to prevent errors if the user object or email property is undefined

  // This code manages a user's coin watchlist by allowing them to add or remove coins. It checks the user's email,
  // updates a database document accordingly, and tracks the saved state using the savedCoin variable.

  const updateWatchList = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      setShowModal(true);
      return;
    }

    const coinData = {
      id: coin.id,
      name: coin.name,
      image: coin.image,
      rank: coin.market_cap_rank,
      symbol: coin.symbol,
    };

    if (savedCoin) {
      await updateDoc(coinPath, {
        watchList: arrayRemove(coinData),
      });
      setSavedCoin(false);
    } else {
      await updateDoc(coinPath, {
        watchList: arrayUnion(coinData),
      });
      setSavedCoin(true);
    }
  };

  // fetch the user's watch list and checking if the current coin is already saved in the watch list
  useEffect(() => {
    const getWatchList = async () => {
      if (!user?.email) {
        setSavedCoin(false);
        return;
      }

      const docRef = doc(db, "users", `${user?.email}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const watchList = docSnap.data().watchList;
        if (watchList.find((savedCoin) => savedCoin.id === coin.id)) {
          setSavedCoin(true);
        }
      }
    };

    getWatchList();
  }, [user?.email, coin.id]);

  return (
    <tr className="h-[80px] border-b overflow-hidden">
      <td onClick={updateWatchList}>
        {savedCoin ? (
          <AiFillStar className=" text-[#ffe600]" />
        ) : (
          <AiOutlineStar />
        )}
      </td>
      <td>{coin.market_cap_rank}</td>
      <td className="hover:scale-105 ease-in-out duration-300">
        <Link to={`/coin/${coin.id}`}>
          <div className="flex items">
            <img className="w-6 mr-2 rounded-full" src={coin.image} alt="id" />
            <p className="hidden sm:table-cell">{coin.name}</p>
          </div>
        </Link>
      </td>
      <td>{coin.symbol.toUpperCase()}</td>
      <td>${coin.current_price.toLocaleString()}</td>
      <td>
        {coin.price_change_percentage_24h > 0 ? (
          <p className="text-green-600">
            {coin.price_change_percentage_24h.toFixed(2)}%
          </p>
        ) : (
          <p className="text-red-600">
            {coin.price_change_percentage_24h.toFixed(2)}%
          </p>
        )}
      </td>
      <td className="w-[180px] hidden md:table-cell">
        ${coin.total_volume.toLocaleString()}
      </td>
      <td className="w-[180px] hidden sm:table-cell">
        ${coin.market_cap.toLocaleString()}
      </td>
      <td>
        <Sparklines data={coin.sparkline_in_7d.price}>
          <SparklinesLine color="teal" />
        </Sparklines>
      </td>

      {/* Modal component */}
      <Modal
        className="rounded-div flex items-center justify-center h-20 font-bold transition-opacity fixed inset-x-0 top-1/4"
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <div className="animate-bounce bg-button text-btnText px-5 py-2 ml-2 rounded-2xl shadow-lg hover:shadow-2xl">
          Please sign in or sign up, if you don't have an account, to save a
          coin into your watch list
        </div>
      </Modal>
    </tr>
  );
};

export default CoinItem;
