import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Leadership from './pages/Leadership.jsx'
import Schedule from './pages/Schedule.jsx'
import Departments from './pages/Departments.jsx'
import Events from './pages/Events.jsx'
import Sermons from './pages/Sermons.jsx'
import UploadSermon from './pages/UploadSermon.jsx'
import Giving from './pages/Giving.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import Involve from './pages/Involve.jsx'
import Baptism from './pages/Baptism.jsx'
import JoinTeam from './pages/JoinTeam.jsx'
import Volunteer from './pages/Volunteer.jsx'
import Testimonies from './pages/Testimonies.jsx'
import Prayer from './pages/Prayer.jsx'
import Partner from './pages/Partner.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/kuhusu" element={<About />} />
          <Route path="/uongozi" element={<Leadership />} />
          <Route path="/ratiba" element={<Schedule />} />
          <Route path="/idara" element={<Departments />} />
          <Route path="/matukio" element={<Events />} />
          <Route path="/mahubiri" element={<Sermons />} />
          <Route path="/mahubiri/pakia" element={<UploadSermon />} />
          <Route path="/michango" element={<Giving />} />
          <Route path="/matunzio" element={<Gallery />} />
          <Route path="/wasiliana" element={<Contact />} />

          <Route path="/shiriki" element={<Involve />} />
          <Route path="/ubatizo" element={<Baptism />} />
          <Route path="/jiunge" element={<JoinTeam />} />
          <Route path="/kujitolea" element={<Volunteer />} />
          <Route path="/ushuhuda" element={<Testimonies />} />
          <Route path="/maombi" element={<Prayer />} />
          <Route path="/ubia" element={<Partner />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}
