import React from 'react'
import {Link, useLocation} from 'react-router-dom'
import './Home.css'
import myImage from './Visual Planet.png';

function Home() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('loginlocation');
  const country = searchParams.get('country');
  const state = searchParams.get('state');
  const district = searchParams.get('district');
  const area = searchParams.get('area');

  return (
    <>
    <div>

   
      <div className='admin-container'>
       
        <div className='admin-header'>
          <img src={myImage} alt="My Image" className="admin-panel-image" />
        </div>
        </div>
       </div>
        <div className='admin-container2'>
          <div className='admin-panel'>
            <div className='admin-buttons'>
            <Link to={`/new?loginlocation=${username}&country=${country}&state=${state}&district=${district}&area=${area}`} className=' btn-default'>NEW</Link>
            <Link to={`https://www.visualplanet.in/demo.html`} className='btn-default'>DEMO</Link>
            <Link to={`/today?loginlocation=${username} & country=${country}&state=${state}&district=${district}&area=${area}`} className='btn-default'>FOLLOW UP</Link>
              <Link to={`/`} className='btn btn-danger'>Logout</Link>
            </div>
        </div>
        </div>
      
      
    </>
  );
}

export default Home