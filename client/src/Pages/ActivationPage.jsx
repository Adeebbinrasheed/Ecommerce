import React, { useEffect, useState } from 'react'
import {useParams} from "react-router-dom"
import { server } from '../server'
import axios from 'axios'

const ActivationPage = () => {

  const {activation_token}=useParams()
  const [error,setError]=useState(false)
  console.log(activation_token);

  useEffect(()=>{
    if(activation_token){
      const sendRequest=async()=>{
        await axios.post(`${server}/activation`,{
          activation_token,
        })
        .then((res)=>{
          console.log(res);
        }).catch((err)=>{
          console.log(err);
          setError(true)
        })
      }
      sendRequest()
    }
  },[])

  return (
    <div style={{
      width:"100%",
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      fontWeight:"bold",
      fontSize:"2rem"
    }} >
        {error ? (
          <p>Your token is expired</p>
        ):(
          <p>Your account has been created successfully</p>
        )}
    </div>
  )
}

export default ActivationPage