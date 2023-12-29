import React, { useState } from 'react';
import './FollowPage.scss';
import PeopleList from '../../components/peopleList/PeopleList';
import Navbar from '../../components/navbar/Navbar';
import wavesTwo from "../../utils/wavesTwo.png";

const FollowPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
  };

  return (
    <div className='FollowPage'>
      <Navbar />
      <div className='FollowPage__search'>
        <input
          type="text"
          placeholder='search...'
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className='FollowPage__peoplelist'>
        <div className='FollowPage__peoplelist-users'>
          <p className='FollowPage__peoplelist-users-header'>USERS</p>
          <PeopleList showFollowedUsers={false} searchQuery={searchQuery} />
        </div>
        <div className='FollowPage__peoplelist-followedUsers'>
          <p className='FollowPage__peoplelist-followedUsers-header'>FOLLOWED USERS</p>
          <PeopleList showFollowedUsers={true} searchQuery={searchQuery} />
        </div>
      </div>
      <img className="FollowPage__wavesTwoImg" src={wavesTwo} alt="wavesTwo" />
    </div>
  );
};

export default FollowPage;
