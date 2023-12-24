import React, { useEffect, useState } from 'react';
import './PeopleList.scss';
import { collection, getDocs } from 'firebase/firestore';
import { UserApp } from '../../utils/types/user';
import { db } from '../../utils/firebase/firebase.utils';
import photo from '../../utils/user.png'


const PeopleList: React.FC = () => {
  const [users, setUsers] = useState<UserApp[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() } as UserApp));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  return (
    <div className='PeopleList'>
      {users.map((user, index) => (
        <div key={index} className='PeopleList__container'>
          <div className='PeopleList__container-user'>
            <img className='PeopleList__container-user-photo' src={user.photoURL ?? photo} alt="user" />
            <p className='PeopleList__container-user-name'>{user.displayName}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PeopleList;
