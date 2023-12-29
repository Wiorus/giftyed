import React from 'react'
import './MyProfilePage.scss'
import Navbar from '../../components/navbar/Navbar'
import ProfileMenu from '../../components/profileMenu/ProfileMenu'
import MyProfileInfo from '../../components/myProfileInfo/MyProfileInfo'

const MyProfilePage: React.FC = () => {
    return (
        <div className='MyProfilePage'>
                <Navbar />
            <div className='MyProfilePage__content'>
                <div className='MyProfilePage__content-info'>
                    <MyProfileInfo />
                </div>
                <div className='MyProfilePage__content-menu'>
                    <ProfileMenu />
                </div>
            </div>
        </div>
    )
}

export default MyProfilePage;