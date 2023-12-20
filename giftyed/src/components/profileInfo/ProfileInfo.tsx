import React, { useContext } from 'react';
import './ProfileInfo.scss';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import photo from '../../utils/user.png';
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { useNavigate } from 'react-router-dom';

const handleClick = () => {
  console.info('You clicked the Chip.');
};

const ProfileInfo: React.FC = () => {
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  const navigate = useNavigate();
  if (!currentUserContext) {
    navigate('/');
    return null;
  }

  const { displayName, age, birthday, interests } = currentUserContext;
  
  const formattedBirthday = birthday
    ? new Date(birthday.seconds * 1000).toLocaleDateString()
    : '';

  return (
    <div className='profile-info'>
      <div className='profile-info__avatar'>
        <div className='profile-info__avatar-square'></div>
        <div className='profile-info__avatar-photo'>
          <img src={photo} alt='user' />
        </div>
      </div>
      <div className='profile-info__content'>
        <div className='profile-info__content-info'>
          <p className='profile-info__content-info-name'>{displayName}</p>
          <div className='profile-info__content-info-name-others'>
            <p> Age: {age?.toString()}</p>
            <p> Birthday: {formattedBirthday}</p>
          </div>
        </div>
        <div className='profile-info__content-interests'>
          <p>Interests</p>
          <div className='profile-info__content-interests-container'>
            <Stack direction='row' spacing={1}>
            {interests?.map((interest, index) => (
                <Chip key={index} label={interest} onClick={handleClick} />
              ))}
              <Chip onClick={handleClick} label="+" />
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
