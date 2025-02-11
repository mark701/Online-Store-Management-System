import React, { useRef, useState } from 'react'
import { getAuthUser, setAuthUser } from '../../helper/Storage'
import { Button, Form, Modal,InputGroup,Image, Alert } from 'react-bootstrap';
import axios from 'axios';
export default function Create() {
  const user=getAuthUser();
  
  const [CreateAuction,setCreateAuction]=useState({
    Name:"",
    Description: "",
    StartDate:"",
    EndDate:"",
    Bid_Number:0,
    loading:false,
    err:[],
})
const imageData= useRef(null);

  if(user.status=="Active"){

    const  SumbitFrom=(e)=>{

      e.preventDefault();
        console.log(e)
        
          const formData = new FormData();
          formData.append('Name', CreateAuction.Name);
          formData.append('Description', CreateAuction.Description);
          formData.append('StartDate', new Date(CreateAuction.StartDate).toISOString().replace(/\..+/, '') );
          formData.append('EndDate', new Date(CreateAuction.EndDate).toISOString().replace(/\..+/, '') );
          formData.append('Bid_Number', CreateAuction.Bid_Number);
          formData.append('image', imageData.current.files[0]);
          setCreateAuction({...CreateAuction,loading:true,err:[]});
  
          axios
          .post('http://localhost:4000/Auction/create', formData, {
            headers: {
              token:user.token,
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((resp) => {
            setCreateAuction({ ...CreateAuction, loading: false, err: [] });
            window.location.reload(true);
  
  
          })
          .catch((errors) => {
            console.log(errors);
            setCreateAuction({ ...CreateAuction, loading: false, err: errors.response.data.errors });
          });
      
  
  
    };


    

    return (
      <>
     <div className='divFrom'>
            <form onSubmit={SumbitFrom}>
            <Modal.Header>
            <Modal.Title>
                CreateAuction
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
            <br></br>

            <Form.Label>Name </Form.Label>
                <Form.Control type='text' 
                   value={CreateAuction.Name} 
                   onChange={(e =>setCreateAuction({...CreateAuction,Name:e.target.value}))}
                />

                <br></br>
                <Form.Label>Description  </Form.Label>
                <Form.Control type='text' 
                value={CreateAuction.phone} 
                onChange={(e =>setCreateAuction({...CreateAuction,Description:e.target.value}))}
                
                required/>
                                <br></br>
                <Form.Label>Start Date</Form.Label>

                <input type="datetime-local"className='form-control' ref={imageData} required 
                onChange={(e =>setCreateAuction({...CreateAuction,StartDate:e.target.value}))}

                ></input>
                <br></br>
                <Form.Label>End Date</Form.Label>

                <input type="datetime-local" className='form-control' ref={imageData} required
                onChange={(e =>setCreateAuction({...CreateAuction,EndDate:e.target.value}))}

                ></input>

                <br></br>

                <Form.Label>Start Bid Number</Form.Label>
                
                <InputGroup className="mb-3">
                <Form.Control className='pass'  type='text' 
                value={CreateAuction.Confirm_Password} 
                onChange={(e =>setCreateAuction({...CreateAuction,Bid_Number:parseInt(e.target.value)}))}
                required/>
                </InputGroup>
                <br></br>
                <Form.Group>

                    <Form.Label>image</Form.Label>

                    <input type="File" className='form-control' ref={imageData} required></input>
                </Form.Group>



            </Form.Group>
        </Modal.Body>
        {CreateAuction.err && CreateAuction.err.map((error,index) =>(
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
      </>
    )
  }
  else{
    return    (
    
    <div>Error 404</div>
    )

  }
  

}
