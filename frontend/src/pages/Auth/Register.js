import React, { useRef, useState } from 'react'
import { Button, Form, Modal,InputGroup,Image, Alert } from 'react-bootstrap';
import axios from 'axios';
import { setAuthUser } from '../../helper/Storage';
export default function Register() {
  const[showFrom, setshow]=useState(false);
  const openFrom=()=> setshow(true);
  const closeFrom=()=> setshow(false);
  const [register,setRegister]=useState({
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
  const  SumbitFrom=(e)=>{

    e.preventDefault();
      console.log(e)
      if(register.password==register.Confirm_Password){
        const formData = new FormData();
        formData.append('Name', register.Name);
        formData.append('Email', register.Email);
        formData.append('password', register.password);
        formData.append('phone', register.phone);
        formData.append('type', register.type);
        formData.append('image', imageData.current.files[0]);
        setRegister({...register,loading:true,err:[]});

        axios
        .post('http://localhost:4000/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((resp) => {
          setRegister({ ...register, loading: false, err: [] });
          setAuthUser(resp.data);
          window.location.reload(true);


        })
        .catch((errors) => {
          console.log(errors);
          setRegister({ ...register, loading: false, err: errors.response.data.errors });
        });
    }
    else  setRegister({ ...register, loading: false, err: [{msg:"passsword doesnt match"} ]});


  };

  return (
    <>
    <div onClick={openFrom} className='btn btn-outline-secondary mx-2'>Register</div>
    <Modal centered show={showFrom} onHide={closeFrom}>
        <form onSubmit={SumbitFrom}>
        <Modal.Header>
            <Modal.Title>
                Register
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>

            <Form.Label>Name</Form.Label>
                <Form.Control type='text' required
                   value={register.Name} 
                   onChange={(e =>setRegister({...register,Name:e.target.value}))}
                />
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='Email' required
                value={register.Email} 
                onChange={(e =>setRegister({...register,Email:e.target.value}))}
                
                
                />

                <Form.Label>Phone</Form.Label>
                <Form.Control type='text' required
                value={register.phone} 
                onChange={(e =>setRegister({...register,phone:e.target.value}))}
                />

                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-3">
                <Form.Control className='pass' type='Password' required
                value={register.password} 
                onChange={(e =>setRegister({...register,password:e.target.value}))}
                />
                </InputGroup>
                <Form.Label>Confirm Password</Form.Label>
                
                <InputGroup className="mb-3">
                <Form.Control className='pass'  type='Password' required
                value={register.Confirm_Password} 
                onChange={(e =>setRegister({...register,Confirm_Password:e.target.value}))}
                />
                </InputGroup>
                <Form.Label>type</Form.Label>

                <Form.Select  aria-label="Default select example"onChange={(e =>setRegister({...register,type:e.target.value}))}>
                        <option hidden>Choose bidder or seller</option>    
                        <option value="bidder">bidder</option>
                        <option value="seller">seller</option>
                </Form.Select>
                <br></br>
                <Form.Group>

                    <Form.Label>image</Form.Label>
                    <input type="File" className='form-control' ref={imageData} required></input>
                </Form.Group>



            </Form.Group>
        </Modal.Body>
        {register.err.map((error,index) =>(
                    <Alert key={index} variant='danger' className='p-2'>
                        {error.msg}
                    </Alert>
                    ))}
        <Modal.Footer >
            
            <Button  variant='secondary' onClick={closeFrom}>Cancel</Button>
            <Button   variant='primary'type='submit'>Register</Button>

        </Modal.Footer>
        </form>
    </Modal>
    </>
  )
}
