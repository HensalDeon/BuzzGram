import UserInfo from '../Userinfo/UserInfo'
import './Topnav.scss'

const TopNav = () => {
    const openSidebar = () => {
        document.body.classList.add('sidebar-open')
    }

    return (
        <div className='topnav'>
            <UserInfo/>
            <div className="sidebar-toggle" onClick={openSidebar}>
                <i className='bx bx-menu-alt-right'></i>
            </div>
        </div>
    )
}

export default TopNav
