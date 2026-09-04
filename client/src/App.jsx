import './App.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import OTP from './Pages/OTP'
import InstituteLogin from './Pages/InstituteLogin'
import PlayerLogin from './Pages/PlayerLogin'
import ActivityTracker from './Pages/ActivityTracker'
import OTPplayer from './Pages/OTPplayer'
import Academy from './Pages/Academy'
import AcademyDetails from './Pages/AcademyDetails'
import Report from './Pages/Report'
import Ai from './Pages/Ai'
import Submissions from './Pages/Submissions'
import YourSub from './Pages/YourSub'
import Girls from './Pages/Girls'
import Posts from './Pages/Posts'
import Leaderboard from './Pages/LeaderBoard';
import TerritoryMap from './Components/TerritoryMap';
import Profile from './Pages/Profile';
import InstituteDashboard from './Pages/InstituteDashboard';
import FitnessTrainer from './Pages/FitnessTrainer';
import Communities from './Pages/Communities';

function App() {

  return (
    <BrowserRouter>
<Routes>
  <Route path='/' element={<Home/>} />
  <Route path='/instituteLogin' element={<InstituteLogin/>} />
  <Route path='/fitness' element={<Ai/>} />
  <Route path='/post' element={<Posts/>} />
  <Route path='/record' element={<ActivityTracker/>} />
  <Route path='/playerLogin' element={<PlayerLogin/>} />
  <Route path='/otp' element={<OTP/>} />
  <Route path='/girls' element={<Girls/>} />
  <Route path='/:academyId/submission' element={<Submissions/>} />
  <Route path='/:playerId/:academyId/report' element={<Report/>} />
  <Route path='/otp-player' element={<OTPplayer/>} />
  <Route path='/instituteDashboard/:id' element={<InstituteDashboard/>} />
  <Route path='/:playerId/report' element={<YourSub/>} />
  <Route path='/leaderboard' element={<Leaderboard/>}/>
  <Route path='/academy/:acaId' element={<AcademyDetails/>} />
  <Route path='/:id/academies' element={<Academy/>} />
  <Route path='/territoryMap' element={<TerritoryMap/>} />
  <Route path='/profile/:id' element={<Profile/>} />
  <Route path='/FitnessTrainer' element={<FitnessTrainer/>} />
  <Route path="/community" element={<Communities/>} />
</Routes>
    </BrowserRouter>
  )
}

export default App
