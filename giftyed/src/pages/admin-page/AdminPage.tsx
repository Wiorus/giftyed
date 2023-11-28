import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import AdminList from '../../components/adminList/AdminList';
import "./AdminPage.scss"
import cubes from "../../utils/cubes.png"

const AdminPage: React.FC = () => {
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
