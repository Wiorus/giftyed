import React from 'react'
import './FollowPage.scss'
import PeopleList from '../../components/peopleList/PeopleList';
import Navbar from '../../components/navbar/Navbar';
import wavesTwo from "../../utils/wavesTwo.png"

const FollowPage: React.FC = () => {
    return (
        <div className='FollowPage'>
            <Navbar />
            <div className='FollowPage__search'>
                <input type="text" placeholder='search...' />
            </div>
            <div className='FollowPage__peoplelist'>
                <div className='FollowPage__peoplelist-users'>
                    <p className='FollowPage__peoplelist-users-header'>USERS</p>
                    <PeopleList />
                </div>
                <div className='FollowPage__peoplelist-followedUsers'>
                    <p className='FollowPage__peoplelist-followedUsers-header'>FOLLOWED USERS</p>
                    <PeopleList />
                </div>
            </div>
            <img className="FollowPage__wavesTwoImg" src={wavesTwo} alt="wavesTwo" />
        </div>

    )
}
export default FollowPage;