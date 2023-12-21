import React from 'react'
import './ProfileMenu.scss'
import FollowedUser from '../followedUser/FollowedUser';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import WishItem from '../wishItem/WishItem';

const ProfileMenu: React.FC = () => {
  return (
    <div className='profile-menu'>
      <div className='profile-menu__upcomingBirthday'>
        <p className='profile-menu__upcomingBirthday-header'>Upcoming Birthday</p>
        <div className='profile-menu__upcomingBirthday-followedUsers'>
          <FollowedUser />
          <FollowedUser />
          <FollowedUser />
          <FollowedUser />
        </div>
      </div>
      <div className='profile-menu__calendar'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar />
        </LocalizationProvider>
      </div>
      <div className='profile-menu__wishList'>
        <p className='profile-menu__wishList-header'>Wish List</p>
        <div className='profile-menu__wishList-items'>
          <WishItem />
          <WishItem />
          <WishItem />
          <WishItem />
        </div>
      </div>
    </div>
  )
}

export default ProfileMenu
