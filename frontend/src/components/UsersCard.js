import React, { useEffect, useState } from 'react'
import {Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../Css/card.css"
import axios from 'axios';
import { getAuthUser } from '../helper/Storage';

export default function UsersCard(props) {
  const admin= getAuthUser();
  const [Satatus, setSatatus] = useState({
    loading: true,
    err: [],
    bidnum: null,
  });
  
  const AcceptUser=()=>{
    console.log("http://localhost:4000/ManageUsers/"+props.ID+"/Accept/");
    console.log(admin.token);
    axios
    .put(
      "http://localhost:4000/ManageUsers/"+props.ID+"/Accept/" ,null,
      {
        headers: {
          token: admin.token,
        },
      }
    )
    .then((resp) => { 
      window.location.reload(true);
     
    })
    .catch((errors) => {
      setSatatus({
        ...Satatus,
        loading: true,
        err: errors.response.data.errors,
      });
    });
  }

  const RejectUser=()=>{
    axios
    .put(
      "http://localhost:4000/ManageUsers/"+props.ID+"/Reject/" ,null,
      {
        headers: {
          token: admin.token,
        },
      }
    )
    .then((resp) => { 
      window.location.reload(true);
     
    })
    .catch((errors) => {
      setSatatus({
        ...Satatus,
        loading: true,
        err: errors.response.data.errors,
      });
    });
  }
  return (
    <>

<div class="card  usercard text-center">
  <div class="card-header">
   ID: {props.ID}
  </div>
  <div class="card-body">
    <img src={props.image} className='userImage'></img>
    <h5 class="card-title"> Name: {props.Name}</h5>

    <h5 class="card-title">Email : {props.Email}</h5>

    <h4 class="card-text ">type : {props.type}</h4>
    
  </div>
  <div class="card-footer text-muted ">
  <button onClick={() => AcceptUser()} class="btn btn-success m-3 col-5">Accept</button>
<button onClick={() => RejectUser()} class="btn btn-danger m-3 col-5">Reject</button>
  </div>
</div>

    </>
  );
}
