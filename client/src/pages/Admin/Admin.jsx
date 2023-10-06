import './Admin.scss'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/AdminSideBar/AdminSidebar'
import TopNav from '../../components/TopNav/TopNav'

const Admin = () => {
    return (
        <div className='body'>
            <AdminSidebar />
            <div className="main">
                <div className="main__content">
                    <TopNav />
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Admin
