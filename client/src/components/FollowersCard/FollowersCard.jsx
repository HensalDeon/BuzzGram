import './FollowersCard.scss'

import { Followers } from '../../Data/FollwersData'
const FollowersCard = () => {
  return (
    <div className="FollowersCard">
        <h3>People you may know!</h3>

        {Followers. map((follower)=>{
            return(
                <div className="follower" key={follower.id}>
                    <div>
                        <img src={follower.img} alt="" className='followerImage' />
                        <div className="name">
                            <span>{follower.name}</span>
                            <span>@{follower.username}</span>
                        </div>
                    </div>
                    <button className='button fc-button'>
                        Follow
                    </button>
                </div>
            )
        })}
    </div>
  )
}

export default FollowersCard