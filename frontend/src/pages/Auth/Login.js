import React, { useState } from 'react'
import { Button, Form, Modal,InputGroup,Image, Alert } from 'react-bootstrap';
import axios from 'axios';
import { setAuthUser } from '../../helper/Storage';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
export default function Login() {

    const[showFrom, setshow]=useState(false);
    const openFrom=()=> setshow(true);
    const closeFrom=()=> setshow(false);
    const navigate= useNavigate();
    const [Login,setLogin]=useState({
        email:"",
        password: "",
        loading:false,
        err:[],
    })
    const  SumbitFrom=(e)=>{
        e.preventDefault();
        setLogin({...Login,loading:true,err:[]});
        axios.post("http://localhost:4000/auth/login",
        {
            Email:Login.email,
            password:Login.password,
        }
        ).then(resp=>{

            setLogin({...Login,loading:false,err:[]})
            setAuthUser(resp.data);
            window.location.reload(true);


        }).catch(errors=>{
            console.log(errors);
            setLogin({...Login,loading:false,err:errors.response.data.errors,});

        });

    }
  return (
    <>
    <div onClick={openFrom} className='btn btn-outline-secondary mx-2'>Login</div>
    <Modal centered show={showFrom} onHide={closeFrom}>
    
   
    <Form onSubmit={SumbitFrom}>
        <Modal.Header>
            <Modal.Title>
                Login
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='Email' required 
                value={Login.email} 
                onChange={(e =>setLogin({...Login,email:e.target.value}))}
                />

                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-3">
                <Form.Control className='pass'  type='Password' required
                value={Login.password} 
                onChange={(e =>setLogin({...Login,password:e.target.value}))}
                
                />
                </InputGroup>

                    {Login.err.map((error,index) =>(
                    <Alert key={index} variant='danger' className='p-2'>
                        {error.msg}
                    </Alert>
                    ))}
                <Modal.Footer >
                    <Button  variant='secondary' onClick={closeFrom}>Cancel</Button>
                <Button   variant='primary'type='submit'disabled={Login.loading=== true}>Login</Button>

            </Modal.Footer>

            </Form.Group>
        </Modal.Body>
       
        </Form>
       

    </Modal>
    </>
  )
}
