import { Button, Form, Modal,InputGroup,Image, Alert } from 'react-bootstrap';
import "../../Css/Profile.css"
import { getAuthUser, setAuthUser } from '../../helper/Storage';
import React, { useRef, useState } from 'react'

import axios from 'axios';
export default function Profile() {

    const [profileUpdate,setprofileUpdate]=useState({
        Name:"",
        Email:"",
        password: "",
        phone:"",
        Confirm_Password:"",
        type:"",
        loading:false,
        err:[],
    })
    const imageData= useRef(null);
    
    const userData=getAuthUser();
    if(userData){
        userData.image=userData.image.replace("http://localhost:4000/", "");
        const  SumbitFrom=(e)=>{

            e.preventDefault();
              console.log(e)


              if(profileUpdate.password==profileUpdate.Confirm_Password){
                const formData = new FormData();    
                profileUpdate.Name ? formData.append('Name', profileUpdate.Name) :
                profileUpdate.Email ? formData.append('Email', profileUpdate.Email) : 
                profileUpdate.password ? formData.append('password', profileUpdate.password) :
                profileUpdate.phone ? formData.append('phone', profileUpdate.phone) :
                profileUpdate.type ? formData.append('type', profileUpdate.type) : 
                imageData.current && imageData.current.files[0] ? formData.append('image', imageData.current.files[0]) :
                setprofileUpdate({...profileUpdate,loading:true,err:[]});
        
                axios
                .post('http://localhost:4000/auth/update', 
                
                formData
                , {
                  headers: {
                    token:userData.token,
                    'Content-Type': 'multipart/form-data',
                  },
                })
                .then((resp) => {
                  setprofileUpdate({ ...profileUpdate, loading: false, err: [] });
                  setAuthUser(resp.data);
                  window.location.reload(true);
        
        
                })
                .catch((errors) => {
                  console.log(errors);
                  setprofileUpdate({ ...profileUpdate, loading: false, err: errors.response.data.errors });
                });
            }
            else  setprofileUpdate({ ...profileUpdate, loading: false, err: [{msg:"passsword doesnt match"} ]});
        
        
          };



        let UserType=       
        <> 
        <Form.Label>type : <b>{userData.type}</b></Form.Label>

        <Form.Select value={userData.type} aria-label="Default select example"onChange={(e =>setprofileUpdate({...profileUpdate,type:e.target.value}))}>             
            <option value="bidder">bidder</option>
            <option value="seller">seller</option>
        </Form.Select>
        </>       
        if(userData.type==="admin")
        {
            UserType=null
        }
        return (
            <div className='divFrom'>
            <form onSubmit={SumbitFrom}>
            <Modal.Header>
            <Modal.Title>
                profileUpdate
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>

            <Form.Label>Name : <b>{userData.Name}</b></Form.Label>
                <Form.Control type='text' 
                   value={profileUpdate.Name} 
                   onChange={(e =>setprofileUpdate({...profileUpdate,Name:e.target.value}))}
                />
                <Form.Label>Email Address : <b>{userData.Email}</b></Form.Label>
                <Form.Control type='Email' 
                value={profileUpdate.Email} 
                onChange={(e =>setprofileUpdate({...profileUpdate,Email:e.target.value}))}
                
                
                />

                <Form.Label>Phone : <b>{userData.phone}</b></Form.Label>
                <Form.Control type='text' 
                value={profileUpdate.phone} 
                onChange={(e =>setprofileUpdate({...profileUpdate,phone:e.target.value}))}
                />

                <Form.Label>Password : <b>{userData.password}</b></Form.Label>
                <InputGroup className="mb-3">
                <Form.Control className='pass' type='Password' 
                value={profileUpdate.password} 
                onChange={(e =>setprofileUpdate({...profileUpdate,password:e.target.value}))}
                />
                </InputGroup>
                <Form.Label>Confirm Password</Form.Label>
                
                <InputGroup className="mb-3">
                <Form.Control className='pass'  type='Password' 
                value={profileUpdate.Confirm_Password} 
                onChange={(e =>setprofileUpdate({...profileUpdate,Confirm_Password:e.target.value}))}
                />
                </InputGroup>
               {UserType}
                <br></br>
                <Form.Group>

                    <Form.Label>image</Form.Label>

                    <input type="File" className='form-control' ref={imageData} ></input>
                </Form.Group>



            </Form.Group>
        </Modal.Body>
        {profileUpdate.err && profileUpdate.err.map((error,index) =>(
    <Alert key={index} variant='danger' className='p-2'>
        {error.msg}
    </Alert>
))}
        <Modal.Footer >
            <br></br>
            <br></br>

            <br></br>

            <Button   variant='primary'type='submit'>profile Update</Button>

        </Modal.Footer>
          </form>
          </div>
          )
    }
    else return(
        <div> Error 404</div>
    )

}
