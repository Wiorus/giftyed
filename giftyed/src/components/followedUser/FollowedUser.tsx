import React from 'react'
import './FollowedUser.scss'
import photo from '../../utils/user.png'

const FollowedUser: React.FC = () => {
  return (
    <div className='followed-user'>
        <div className='followed-user__photo'>
            <img src={photo} alt="user" />
        </div>
        <div className='followed-user__name'>
            <p>jan kowal</p>
        </div>
    </div>
  )
}

export default FollowedUser