import React from 'react';
import AuctionCard from '../components/AuctionCard';

function SearchResults({ results }) {
  return (
    <div className="p-5 home-container">
    <div className="row ">
      {results.map((auction) => (
        <AuctionCard key={auction.id} auction={auction} />
      ))}
      </div>
    </div> 
     );
}

export default SearchResults;