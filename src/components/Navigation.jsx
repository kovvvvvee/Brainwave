import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    if (path === '/inspirations') {
      return location.pathname.startsWith('/inspirations') || location.pathname.startsWith('/inspiration/')
    }
    if (path === '/archive') {
      return location.pathname.startsWith('/archive') || 
             location.pathname.startsWith('/cp') ||
             location.pathname.startsWith('/create-cp')
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="navigation">
      <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>首页</Link>
      <span className="nav-divider">｜</span>
      <Link to="/inspirations" className={`nav-link ${isActive('/inspirations') ? 'active' : ''}`}>灵感</Link>
      <span className="nav-divider">｜</span>
      <Link to="/archive" className={`nav-link ${isActive('/archive') ? 'active' : ''}`}>档案</Link>
    </nav>
  )
}

export default Navigation
