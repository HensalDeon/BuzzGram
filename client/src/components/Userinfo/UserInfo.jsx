import avatar from '../../img/icon-flatAdmin.svg'
import './Userinfo.scss';
const UserInfo = () => {
    return (
        <div className='user-info'>
            <div className="user-info__img">
                <img src= {avatar} alt="" />
            </div>
            <div className="user-info__name">
                <span>Hensal Deon</span>
            </div>
        </div>
    )
}

export default UserInfo
