import React, { useEffect, useState } from 'react'

import { getAuthUser } from '../../helper/Storage';
import AuctionCard from '../../components/AuctionCard';
import axios from 'axios';


export default function Auction() {
  const [auctions, setAuction] = useState({
    loading: true,
    result: [],
    err: null,
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/Auction/")
      .then((resp) => {
        setAuction({
          ...auctions,
          result: resp.data,
          loading: false,
          err: [],
        });
      })
      .catch((err) => {
        setAuction({
          ...auctions,
          loading: false,
          err: "something went wrong",
        });
      });
  }, []);

  return (
    <div className="p-5 home-container">
      <div className="row ">
        {auctions.result.map((auc) => (
          <div className="col-3 card-movie-container" key={auc.id}>
            <AuctionCard
              id={auc.id}
              Name={auc.Name}
              Email={auc.Email}
              Description={auc.Description}
              image={auc.image}
              EndDate={auc.EndDate}
              StartDate={auc.StartDate}
              Bid_Number={auc.Bid_Number}
              Bid_Email={auc.Bid_Email}
              isPayed={auc.isPayed}
            />
          </div>
        ))}
      </div>
    </div>
  );
}