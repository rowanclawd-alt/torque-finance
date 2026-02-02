import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AppPage from './pages/AppPage'
import VaultDetail from './pages/VaultDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/app/vault/:id" element={<VaultDetail />} />
    </Routes>
  )
}

export default App
