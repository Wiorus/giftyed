import React, { useContext, useEffect, useState } from 'react'
import './ProfileMenu.scss'
import FollowedUser from '../followedUser/FollowedUser';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import WishItem from '../wishItem/WishItem';
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { GiftApp } from '../../utils/types/gift';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../utils/firebase/firebase.utils';

const ProfileMenu: React.FC = () => {
  const { currentUserContext } = useContext(UsersContext) as UsersContextType;
  const [wishGifts, setWishGifts] = useState<GiftApp[]>([]);

  useEffect(() => {
    const fetchWishGifts = async () => {
      if (currentUserContext && currentUserContext.wishes) {
        const giftsCollection = collection(db, 'gifts');
        const wishesQuery = query(giftsCollection, where('id', 'in', currentUserContext.wishes));

        try {
          const wishesSnapshot = await getDocs(wishesQuery);
          const wishesData = wishesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GiftApp));
          setWishGifts(wishesData);
        } catch (error) {
          console.error('Error fetching wish gifts:', error);
        }
      }
    };

    fetchWishGifts();
  }, [currentUserContext]);
  return (
    <div className='profile-menu'>
      <div className='profile-menu__upcomingBirthday'>
        <p className='profile-menu__upcomingBirthday-header'>Upcoming Birthday</p>
        <div className='profile-menu__upcomingBirthday-followedUsers'>
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
          <WishItem gifts={wishGifts} />
        </div>
      </div>
    </div>
  )
}

export default ProfileMenu
