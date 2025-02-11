import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Login from '../pages/Auth/Login';
import { getAuthUser } from '../helper/Storage';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Register from '../pages/Auth/Register';
import { removeAuthUser } from '../helper/Storage';
import { Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "../Css/Header.css";
import axios from 'axios';
import AuctionCard from '../components/AuctionCard';

export default function Header() {
  const Logout=()=>{
    removeAuthUser();
    window.location.reload(true);
  }
  
  let userData= getAuthUser();
    let  viewAuth;
    let statuscheck;
    let mangeUsers=null;
    let statusCss;

    const [auctions, setAuction] = useState({
      loading: true,
      result: [],
      err: null,
      reload:0
    });
    
    const [Search,setSearch]=useState("");

    useEffect(() => {
      axios
        .get("http://localhost:4000/Auction/")
        .then((resp) => {
         

        })
        .catch((err) => {
          setAuction({
            ...auctions,
            loading: false,
            err: "something went wrong",
          });
        });
    }, [auctions.reload]);
  
   const  SearchAuction=(e)=>{
    e.preventDefault();
    setAuction({...auctions, reload: auctions.reload+1  });


    }

    if(userData) { 
      if(userData.status==="Active"){
        statuscheck= 
          <><Nav.Link href="/create"disabled={false} >Create Auction</Nav.Link>
            <Nav.Link href="/history">History</Nav.Link>
           </> ;
       statusCss =<Dropdown.ItemText className='Active'>{userData.status}</Dropdown.ItemText>  
      
    }

      else if (userData.status==="Inactive"){
        statuscheck= 
          <>
          <Nav.Link href="/create"disabled={true} >Create Auction</Nav.Link>
          </> ;
                 statusCss =<Dropdown.ItemText className='InActive'>{userData.status}</Dropdown.ItemText>  

      }
      else{
        statuscheck= 
          <>
          <Nav.Link href="/create"disabled={true} >Create Auction</Nav.Link>
          </> ;
                 statusCss =<Dropdown.ItemText className='Reject'>{userData.status}</Dropdown.ItemText> 
      }
      if(userData.type=="admin"){
        mangeUsers=<Nav.Link href="/ManageUsers" >Manage Users Account</Nav.Link>
 
     }
     viewAuth=
     <Nav className="justify-content-end padingnav" >
     <img src={userData.image} className="imgProfile" alt="image Profile" />
   <NavDropdown title={userData.Name} id="basic-nav-dropdown" className='ju ' >
        {statusCss}
       <NavDropdown.Item href="/Settings">
       Settings
       </NavDropdown.Item>
       <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
       <NavDropdown.Divider />
       <NavDropdown.Item href="#action/3.4" onClick={Logout}>
         Logout
       </NavDropdown.Item>
     </NavDropdown>
     
     </Nav>
    }
    else { 
      statuscheck= null;
      viewAuth=      
      <>
      <Register/>
      <Login/>
      </>
    }
   
  return (
    <>
    <div className='navscroll '>
    <Navbar bg="dark" variant="dark"   className='p-3 ' >
    <Container fluid>
      <Navbar.Brand href="/">Home</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
      <Nav className="me-auto">
        <Nav.Link href="/auction">Auction</Nav.Link>
        {statuscheck}
        {mangeUsers}

        <Form onSubmit={SearchAuction}>
          <Form.Group className='d-flex  mrgin'>
            <Form.Control
              type="text"
              placeholder="Search"
              className="me-4"
              required
              value={Search}
              onChange={(e) =>setSearch(e.target.value)}


            />
            <Button variant="outline-secondary" >Search</Button>

            </Form.Group>
          </Form>
        

      </Nav>
     
     
          
      {viewAuth}
    
      
        </Navbar.Collapse>

        
    </Container>
    </Navbar>
    </div>  
    



</>
  )
}
