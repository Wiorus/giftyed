import React, { useContext, useEffect, useState } from 'react';
import './FollowedUser.scss';
import photo from '../../utils/user.png';
import { UsersContext } from '../../contexts/user.context';
import { UserApp } from '../../utils/types/user';
import { db } from '../../utils/firebase/firebase.utils';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const FollowedUser: React.FC = () => {
  const usersContext = useContext(UsersContext);
  const [users, setUsers] = useState<UserApp[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() } as UserApp));

      const observedUsers = usersData.filter((user) =>
        usersContext?.currentUserContext?.followed?.includes(user._id)
      );

      const sortedUsers = observedUsers
        .filter((user) => user._id !== usersContext?.currentUserContext?._id)
        .sort((a, b) => {
          if (a.birthday && b.birthday) {
            return a.birthday.seconds - b.birthday.seconds;
          }
          return 0;
        });

      setUsers(sortedUsers);
    };

    fetchUsers();
  }, [usersContext?.currentUserContext]);

  const handleUserClick = (userId: string) => {
    navigate(`/Profile/${userId}`);
  };

  return (
    <div className='followed-user'>
      {users.map((user, index) => (
        <div key={index} className='followed-user__container' onClick={() => handleUserClick(user._id)}>
          <img className='followed-user__container-photo' src={user.photoURL ?? photo} alt='user' />
          <p className='followed-user__container-name'>{user.displayName}</p>
        </div>
      ))}
    </div>
  );
};

export default FollowedUser;
