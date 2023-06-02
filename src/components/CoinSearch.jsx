import React, { useState } from "react";
import CoinItem from "./CoinItem";

//  defines a search component for cryptocurrency coins. It allows users to search for specific coins based on their name.
// The filtered coins are rendered using the "CoinItem" component

const CoinSearch = ({ coins }) => {
  const [searchText, setSearchText] = useState(""); // holds the current value of the search input field
  return (
    <div className="rounded-div my-4">
      <div className="flex flex-col md:flex-row justify-between pt-4 pb-6 text-center md:text-right">
        <h1 className="text-2xl font-bold my-2 ">Search Crypto</h1>
        <form>
          <input
            onChange={(e) => setSearchText(e.target.value)} // updates the searchText state variable whenever the value of the input changes
            className="w-full bg-primary border border-input px-4 py-2 rounded-2xl shadow-xl"
            type="text"
            placeholder="Search a coin"
          />
        </form>
      </div>
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="border-b">
            <th></th>
            <th className="px-4">Rank</th>
            <th className="text-center">Coin</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>24h</th>
            <th className="hidden md:table-cell">24h Volume</th>
            <th className="hidden sm:table-cell">Market Cap</th>
            <th>Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {coins
            .filter((value) => {
              if (searchText === "") {
                return value;
              } else if (
                value.name.toLowerCase().includes(searchText.toLowerCase()) ||
                value.symbol.toLowerCase().includes(searchText.toLowerCase())
              ) {
                return value;
              } else {
                return false;
              }
            })
            .map((coin) => (
              <CoinItem key={coin.id} coin={coin} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinSearch;
