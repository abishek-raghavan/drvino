
import './App.css';
import Login from './Login';
import Signup from './Signup';
import Home from './Home'
import NewOrderForm from './New.js'
import FollowUp from './FollowUp.js';
import Today from './Today.js';
import Spanco from './Spanco.js';
import Form from './Form.js'
import Demo from './demo.js'
import Admin from './Admin.js'
import Add from './Add.js'
import AdminFollow from './AdminFollow.js';
import AdminForm from './AdminForm.js';
import Manageusers from './Manageusers.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AddManage from './AddManage.js';
import UserAdd from './UserAdd.js'
import ManageOp from './MnageOp.js';
import Bill from './Bill.js'
import Managecatpo from './Managecatpo.js';
import Managecatpo1 from './Managecatpo1.js';
import Managecatpo2 from './Managecatpo2.js';
import Managecatpo3 from './Managecatpo3.js';
import Managecatpo4 from './Managecatpo4.js';
import Managecatpo5 from './Managecatpo5.js';
import Managecatpo6 from './Managecatpo6.js';
import Managecatpo7 from './Managecatpo7.js';
import Managecatpo8 from './Managecatpo8.js';
import Managecatpo9 from './Managecatpo9.js';
import Managecatpo10 from './Managecatpo10.js';
import Managecatpo11 from './Managecatpo11.js';
import ManageProducts from './ManageProducts.js';
import Choosecatpo from './Choosecatpo.js';
import ModalPage from './ModalPage.js';
import ManagePositions from './ManagePositions.js';
import AddPatient from './AddPatient.js';
import Com from './Com.js';
import PatientsFollowUp from './PatientsFollowUp.js';


function App() {
  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<Login />}></Route>
    <Route path='/signup' element={<Signup />}></Route>
    <Route path='/home' element={<Home />}></Route>
    <Route path='/new' element={<NewOrderForm />}></Route>
    <Route path='/followup' element={<FollowUp />}></Route>
    <Route path='/today' element={<Today />}></Route>
    <Route path='/spanco' element={<Spanco />}></Route>
    <Route path='/form' element={<Form />}></Route>
    <Route path='/demo' element={<Demo />}></Route>
    <Route path='/admin' element={<Admin />}></Route>
    <Route path='/add' element={<Add />}></Route>  
    <Route path='/adminfollow' element={<AdminFollow />}></Route>
    <Route path='/adminform' element={<AdminForm />}></Route>
    <Route path='/manageusers' element={<Manageusers />}></Route>
    <Route path='/addmanage' element={<AddManage></AddManage>}></Route>
    <Route path='/UserAdd' element={<UserAdd></UserAdd>}></Route>
    <Route path='/manageop' element={<ManageOp></ManageOp>}></Route>
    <Route path='/bill' element={<Bill></Bill>}></Route>
    <Route path='/managecatpo' element={<Managecatpo></Managecatpo>}></Route>
    <Route path='/managecatpo1' element={<Managecatpo1></Managecatpo1>}></Route>
    <Route path='/managecatpo2' element={<Managecatpo2></Managecatpo2>}></Route>
    <Route path='/managecatpo3' element={<Managecatpo3></Managecatpo3>}></Route>
    <Route path='/managecatpo4' element={<Managecatpo4></Managecatpo4>}></Route>
    <Route path='/managecatpo5' element={<Managecatpo5></Managecatpo5>}></Route>
    <Route path='/managecatpo6' element={<Managecatpo6></Managecatpo6>}></Route>
    <Route path='/managecatpo7' element={<Managecatpo7></Managecatpo7>}></Route>
    <Route path='/managecatpo8' element={<Managecatpo8></Managecatpo8>}></Route>
    <Route path='/managecatpo9' element={<Managecatpo9></Managecatpo9>}></Route>
    <Route path='/managecatpo10' element={<Managecatpo10></Managecatpo10>}></Route>
    <Route path='/managecatpo11' element={<Managecatpo11></Managecatpo11>}></Route>
    <Route path='/manageproduct' element={<ManageProducts></ManageProducts>}></Route>
    <Route path='/choosecatpo' element={<Choosecatpo></Choosecatpo>}></Route>
    <Route path="/modal" element={<ModalPage />} />
    <Route path="/managepositions" element={<ManagePositions />} />
    <Route path="/AddPatient" element={<AddPatient />} />
    <Route path="/Com" element={<Com />} />
    <Route path="/PatientsFollowUp" element={<PatientsFollowUp />} />


    
   </Routes>
   </BrowserRouter>
  
   </>
  ); 
}

export default App;
