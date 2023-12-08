import React from 'react'
import './ProfileInfo.scss'
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import photo from '../../utils/user.png'

const handleClick = () => {
  console.info('You clicked the Chip.');
}

const ProfileInfo: React.FC = () => {
  return (
    <div className='profile-info'>
      <div className='profile-info__avatar'>
        <div className='profile-info__avatar-square'>
        </div>
        <div className='profile-info__avatar-photo'>
          <img src={photo} alt="user" />
        </div>
      </div>
      <div className='profile-info__content'>
        <div className='profile-info__content-info'>
          <p className='profile-info__content-info-name'>Sebastian Wiora</p>
          <div className='profile-info__content-info-name-others'>
            <p> Age:</p>
            <p> Birthday: 29.01.1999</p>
          </div>
        </div>
        <div className='profile-info__content-interests'>
          <p>Interests</p>
          <div className='profile-info__content-interests-container'>
            <Stack direction="row" spacing={1}>
              <Chip label="Clickable" onClick={handleClick} />
              <Chip label="Clickable" onClick={handleClick} />
              <Chip label="Clickable" onClick={handleClick} />
            </Stack>
          </div>

        </div>
      </div>
    </div>
  )
}
export default ProfileInfo;