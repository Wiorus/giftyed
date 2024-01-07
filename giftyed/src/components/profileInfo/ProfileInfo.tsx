import React, { useContext, useState } from 'react';
import './ProfileInfo.scss';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import photo from '../../utils/user.png';
import { UserApp } from '../../utils/types/user';
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { updateUserDoc } from '../../utils/firebase/firebase.utils';
import { useNavigate } from 'react-router-dom';

interface ProfileInfoProps {
  user: UserApp;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  const formattedBirthday = user.birthday ? new Date(user.birthday.seconds * 1000).toLocaleDateString() : 'Not set yet';
  const [isFollowed, setIsFollowed] = useState(currentUserContext?.followed?.includes(user._id) || false);

  const navigate = useNavigate();

  const handleInterestsButtonClick = () => {
    navigate(`/search?interests=${encodeURIComponent(JSON.stringify(user.interests || []))}`);
  };

  const handleFollowClick = async () => {
    if (currentUserContext) {
      try {
        const updatedFollowed = isFollowed
          ? currentUserContext.followed?.filter((id) => id !== user._id) || []
          : [...(currentUserContext.followed || []), user._id];
        await updateUserDoc(currentUserContext._id, { followed: updatedFollowed });
        const updatedUser = { ...currentUserContext, followed: updatedFollowed };
        setCurrentUserContext(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setIsFollowed(!isFollowed);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <div className='profile-info'>
      <div className='profile-info__avatar'>
        <div className='profile-info__avatar-square'></div>
        <div className='profile-info__avatar-photo'>
          <img src={user.photoURL || photo} alt="User" />
        </div>
      </div>
      <div className='profile-info__content'>
        <div className='profile-info__content-info'>
          <div className='profile-info__content-info-name'>
            <p>{user.displayName}</p>
          </div>
          <div className='profile-info__content-info-name-others'>
            <p> Age:{user.age} </p>
            <p> Birthday: {formattedBirthday}</p>
          </div>
          <div className='profile-info__content-info-follow'>
            <button onClick={handleFollowClick}>
              {isFollowed ? 'Unfollow' : 'Follow'}
            </button>
            
          </div>
        </div>
        <div className='profile-info__content-interests'>
          <p>Interests</p>
          <div className='profile-info__content-interests-container'>
            <Stack direction='row' spacing={1}>
              {user.interests?.map((interest, index) => (
                <Chip key={index} label={interest} />
              ))}
            </Stack>
            <button onClick={handleInterestsButtonClick}>Match Gift</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
