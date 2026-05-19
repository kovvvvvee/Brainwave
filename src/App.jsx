import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CpList from './pages/CpList'
import CreateCp from './pages/CreateCp'
import EditCp from './pages/EditCp'
import CpDetail from './pages/CpDetail'
import CreateAu from './pages/CreateAu'
import EditAu from './pages/EditAu'
import AuDetail from './pages/AuDetail'
import InspirationDetail from './pages/InspirationDetail'
import UncategorizedInspirations from './pages/UncategorizedInspirations'

// Generate and store user_id for data isolation
let userId = localStorage.getItem('user_id')
if (!userId) {
  userId = crypto.randomUUID()
  localStorage.setItem('user_id', userId)
}
window.CURRENT_USER_ID = userId

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cp-list" element={<CpList />} />
          <Route path="/create-cp" element={<CreateCp />} />
          <Route path="/cp/:id/edit" element={<EditCp />} />
          <Route path="/cp/:id" element={<CpDetail />} />
          <Route path="/cp/:cpId/create-au" element={<CreateAu />} />
          <Route path="/au/:id/edit" element={<EditAu />} />
          <Route path="/au/:id" element={<AuDetail />} />
          <Route path="/inspiration/:id" element={<InspirationDetail />} />
          <Route path="/uncategorized" element={<UncategorizedInspirations />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
