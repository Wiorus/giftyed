import React, { useEffect, useState, useContext } from 'react';
import './PeopleList.scss';
import { collection, getDocs } from 'firebase/firestore';
import { UserApp } from '../../utils/types/user';
import { db } from '../../utils/firebase/firebase.utils';
import photo from '../../utils/user.png';
import { UsersContext } from '../../contexts/user.context';
import { useNavigate } from 'react-router-dom';

interface PeopleListProps {
  showFollowedUsers: boolean;
  searchQuery: string;
}

const PeopleList: React.FC<PeopleListProps> = ({ showFollowedUsers, searchQuery }) => {
  const usersContext = useContext(UsersContext);
  const [users, setUsers] = useState<UserApp[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserApp[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() } as UserApp));

      if (showFollowedUsers) {
        const followedUsers = usersData.filter((user) => usersContext?.currentUserContext?.followed?.includes(user._id));
        setUsers(followedUsers.filter(user => user._id !== usersContext?.currentUserContext?._id));
      } else {
        const allUsers = usersData.filter(user => user._id !== usersContext?.currentUserContext?._id);
        setUsers(allUsers.filter(user => !usersContext?.currentUserContext?.followed?.includes(user._id)));
      }
    };
    fetchUsers();
  }, [showFollowedUsers, usersContext?.currentUserContext]);

  useEffect(() => {
    const filterUsersByName = () => {
      if (searchQuery) {
        const filteredUsers = users.filter(
          (user) =>
            user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filteredUsers);
      } else {
        setFilteredUsers(users);
      }
    };

    filterUsersByName();
  }, [searchQuery, users]);

  const handleUserClick = (userId: string) => {
    navigate(`/Profile/${userId}`);
  };

  return (
    <div className='PeopleList'>
      {filteredUsers.map((user, index) => (
        <div key={index} className='PeopleList__container' onClick={() => handleUserClick(user._id)}>
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