import React, { useEffect, useState } from 'react'
import { getAuthUser } from '../helper/Storage'
import UsersCard from '../components/UsersCard';
import axios from 'axios';
export default function Manageusers() {
  const admin=getAuthUser();
  const [UserStatus, setUserStatus] = useState({
    loading: true,
    result: [],
    err: null,
  });

  useEffect(() => {
    axios
      .get("http://localhost:4000/ManageUsers",  {
        headers: {
          token:admin.token,
          
        },
      })
      
      .then((resp) => {
        setUserStatus({
          ...UserStatus,
          result: resp.data,
          loading: false,
          err: [],
        });
      })
      .catch((err) => {
        setUserStatus({
          ...UserStatus,
          loading: false,
          err: "something went wrong",
        });
      });
  }, []);
  if(admin){

    if(admin.type=="admin"){
      return(

           <div className="p-5 home-container">
      <div className="row ">
        {UserStatus.result.map((user) => (
          <div className="col-3 card-movie-container" key={user.id}>
            <UsersCard
              ID={user.ID}
              Name={user.Name}
              Email={user.Email}
              image={user.image}
              token={user.token}
              phone={user.phone}
              status={user.status}
              type={user.type}
            />
          </div>
        ))}
      </div>
    </div>
      )

    }
  }
  else{
    return (

      <div>Error 404</div>
    )
  }
  
  
}
