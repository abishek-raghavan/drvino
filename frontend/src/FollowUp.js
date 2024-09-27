import React from 'react'
import {Link, useLocation} from 'react-router-dom'
import { Navigate } from "react-router-dom";

import './Home.css'

function Home() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');
  return (
    <>
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-50 h-50'>
              <div className='bwt'>
              <Link to={`/today?loginlocation=${username}`} className='btn btn-default border w-100 new'>Today</Link>
              </div>
              <div className='bwt'>
              <Link to={`/spanco?loginlocation=${username}`} className='btn btn-default border w-100 demo'>Spanco</Link>
              </div>
              <div className='bwt'>
              <Link to={`/calender?loginlocation=${username}`} className='btn btn-default border w-100 follow'>Calender</Link>
              </div>
              <div className='bwt'>
              <Link to={`/orders?loginlocation=${username}`} className='btn btn-default border w-100 follow'>Orders</Link>
              </div>
            </div> 
        </div>
      

      
    </>
    
  )
}

export default Home