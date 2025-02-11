import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import {Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import "../Css/card.css"
import Form from 'react-bootstrap/Form';
import { getAuthUser } from '../helper/Storage';
import axios from 'axios';



export default function AuctionCard(props) {
  const enddate=new Date(props.EndDate).toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '')  
  const startdate=new Date(props.StartDate).toISOString().
  replace(/T/, ' ').      
  replace(/\..+/, '')  
     

  const user = getAuthUser();
  const [Bid_Auction, setBidAuction] = useState({
    loading: true,
    err: [],
    bidnum: null,
  });
  
  const bid_check = (e) => {
    e.preventDefault();
    if(user){
     

      setBidAuction({ ...Bid_Auction, loading: true, err: [] });
      axios
        .post(
          "http://localhost:4000/BidAuction/" + props.id,
          {
            Bid_Number: Bid_Auction.bidnum,
          },
          {
            headers: {
              token: user.token,
            },
          }
        )
        .then((resp) => { 
          window.location.reload(true);
         
        })
        .catch((errors) => {
          setBidAuction({
            ...Bid_Auction,
            loading: true,
            err: errors.response.data.errors,
          });
        });
    }
    else setBidAuction({ ...Bid_Auction, loading: true, err: [{msg:"you sholud  login  first"}] });

    
  };

  let bid_Email = null;
  if (props.Bid_Email) {
    bid_Email = (
      <>
        <Form.Label className="col-8 ">
          highest bid <b>{props.Bid_Number}$</b>{" "}
        </Form.Label>

        <Form.Label className="col-8 ">
          Bid Email : <b>{props.Bid_Email}</b>{" "}
        </Form.Label>
      </>
    );
  } else {
    bid_Email = (
      <Form.Label className="col-8 ">
        Start bid <b>{props.Bid_Number}$</b>{" "}
      </Form.Label>
    );
  }

  return (
    <>
      
      <Card className="card m-4">
        <Card.Img src={props.image} className="cardImage" />
        <Card.Body>
          <Card.Title>{props.Name}</Card.Title>
          <Card.Text>{props.Description}</Card.Text>
          <Form>
            <Form.Group>
              {bid_Email}
              <Form.Label className="col-12 ">
         Bid Start Date <b>{startdate}</b>{" "}
         <Form.Label className="col-12 ">
         Bid End Date <b>{enddate}</b>{" "}</Form.Label>
        </Form.Label>
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="BidNum"
                placeholder="enter bid number"
                className="me-3  m-2"
                aria-label="BidNum"
                required
                
                onChange={(e) => {
                  setBidAuction({ ...Bid_Auction, bidnum :parseInt(e.target.value)});
                }}
              />
              <Button
                className="col-8 m-2"
                type="submit"
                variant="primary"
                disabled={Bid_Auction.loading === false}
                onClick={bid_check}
              >
                Bid{" "}
              </Button>
            </Form.Group>
          </Form>
          {Bid_Auction.err.map((error, index) => (
            <Alert key={index} variant="danger" className="p-2">
              {error.msg}
            </Alert>
          ))}
        </Card.Body>
      </Card>
    </>
  );
}

