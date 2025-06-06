// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Classes from './pages/Classes'
import StudyPlan from './pages/StudyPlan'
import Navbar from './components/Navbar'
import AuthWrapper from './components/AuthWrapper'

export default function App() {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <Navbar />
        <Routes>
          <Route path="/loginRegister" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/studyplan" element={<StudyPlan />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </AuthWrapper>
    </BrowserRouter>
  )
}
