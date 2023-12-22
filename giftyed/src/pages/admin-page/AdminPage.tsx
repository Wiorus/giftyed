// import React, { useContext, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import AdminList from '../../components/adminList/AdminList';
// import { useNavigate } from 'react-router-dom';
import "./AdminPage.scss"
import cubes from "../../utils/cubes.png"
// import { UsersContext, UsersContextType } from '../../contexts/user.context';

const AdminPage: React.FC = () => {
  // let navigate = useNavigate();
  // const {currentUserContext,setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  // useEffect(() => {
  //   tu pobranie z lokal
  //   if(!sprawdzenie lokal ) {
  //     navigate("/login")
  //   }else {
  //     setCurrentUserContext(tu zloka)
  //   }
   
  // }, [currentUserContext])
 
  return (
    <div className='AdminPage'>
      <Navbar />
      <div className='AdminPage__listContainer'>
        <div className='AdminPage__listContainer-textUsers'>
          <p>USERS</p>
        <AdminList />
        </div>
        <div className='AdminPage__listContainer-textGifts'>
          <p>GIFTS</p>
        <AdminList />
        </div>
      </div>
      <img className="AdminPage__cubesImg" src={cubes} alt="cubes" />
    </div>
  )
}
export default AdminPage;
