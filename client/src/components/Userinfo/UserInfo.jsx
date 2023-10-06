import './Userinfo.scss';
import avatar from '../../img/icon-accounts.svg'
const UserInfo = () => {
    return (
        <div className='user-info'>
            <div className="user-info__img">
                <img src= {avatar} alt="" />
            </div>
            <div className="user-info__name">
                <span>admin</span>
            </div>
        </div>
    )
}

export default UserInfo
