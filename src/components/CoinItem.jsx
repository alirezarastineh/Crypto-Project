import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, arrayRemove, doc, updateDoc } from "firebase/firestore";

const CoinItem = ({ coin }) => {
  const [savedCoin, setSavedCoin] = useState(false);
  const { user } = UserAuth();

  const coinPath = doc(db, "users", `${user?.email}`);

  const saveCoin = async (a) => {
    if (!user?.email) {
      alert("Please sign in to save a coin to your watch list");
      return;
    }

    if (savedCoin) {
      await updateDoc(coinPath, {
        watchList: arrayRemove({
          id: coin.id,
          name: coin.name,
          image: coin.image,
          rank: coin.market_cap_rank,
          symbol: coin.symbol,
        }),
      });
      setSavedCoin(false);
    } else {
      await updateDoc(coinPath, {
        watchList: arrayUnion({
          id: coin.id,
          name: coin.name,
          image: coin.image,
          rank: coin.market_cap_rank,
          symbol: coin.symbol,
        }),
      });
      setSavedCoin(true);
    }
  };

  const removeCoin = async (e) => {
    e.preventDefault();
    await updateDoc(coinPath, {
      watchList: arrayRemove({
        id: coin.id,
        name: coin.name,
        image: coin.image,
        rank: coin.market_cap_rank,
        symbol: coin.symbol,
      }),
    });
    setSavedCoin(false);
  };

  return (
    <tr className="h-[80px] border-b overflow-hidden">
      <td onClick={savedCoin ? removeCoin : saveCoin}>
        {savedCoin ? (
          <AiFillStar className=" text-[#ffe600]" />
        ) : (
          <AiOutlineStar />
        )}
      </td>
      <td>{coin.market_cap_rank}</td>
      <td>
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
    </tr>
  );
};

export default CoinItem;
