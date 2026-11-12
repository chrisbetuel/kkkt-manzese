import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'

// kurasa nyingine hupakiwa zinapohitajika — tovuti hufunguka haraka kwenye simu za bei nafuu
const page = (load, name = 'default') => lazy(() => load().then((m) => ({ default: m[name] })))

const About = page(() => import('./pages/About.jsx'))
const Leadership = page(() => import('./pages/Leadership.jsx'))
const Schedule = page(() => import('./pages/Schedule.jsx'))
const Departments = page(() => import('./pages/Departments.jsx'))
const Events = page(() => import('./pages/Events.jsx'))
const EventDetail = page(() => import('./pages/EventDetail.jsx'))
const Sermons = page(() => import('./pages/Sermons.jsx'))
const SermonDetail = page(() => import('./pages/SermonDetail.jsx'))
const UploadSermon = page(() => import('./pages/UploadSermon.jsx'))
const Giving = page(() => import('./pages/Giving.jsx'))
const Gallery = page(() => import('./pages/Gallery.jsx'))
const Contact = page(() => import('./pages/Contact.jsx'))
const Involve = page(() => import('./pages/Involve.jsx'))
const Baptism = page(() => import('./pages/Baptism.jsx'))
const JoinTeam = page(() => import('./pages/JoinTeam.jsx'))
const Volunteer = page(() => import('./pages/Volunteer.jsx'))
const Testimonies = page(() => import('./pages/Testimonies.jsx'))
const Prayer = page(() => import('./pages/Prayer.jsx'))
const Register = page(() => import('./pages/Register.jsx'))
const Partner = page(() => import('./pages/Partner.jsx'))
const Live = page(() => import('./pages/Live.jsx'))
const News = page(() => import('./pages/News.jsx'))
const NewsDetail = page(() => import('./pages/News.jsx'), 'NewsDetail')
const Devotions = page(() => import('./pages/Devotions.jsx'))
const ReadingPlans = page(() => import('./pages/Devotions.jsx'), 'ReadingPlans')
const ReadingPlanDetail = page(() => import('./pages/Devotions.jsx'), 'ReadingPlanDetail')
const Library = page(() => import('./pages/Library.jsx'))
const LibraryDetail = page(() => import('./pages/Library.jsx'), 'LibraryDetail')
const Projects = page(() => import('./pages/Projects.jsx'))
const ProjectDetail = page(() => import('./pages/Projects.jsx'), 'ProjectDetail')
const Jumuiya = page(() => import('./pages/Community.jsx'), 'Jumuiya')
const MinistryDetail = page(() => import('./pages/Community.jsx'), 'MinistryDetail')
const Visitor = page(() => import('./pages/Community.jsx'), 'Visitor')
const VerifyCard = page(() => import('./pages/Community.jsx'), 'VerifyCard')
const Account = page(() => import('./pages/Account.jsx'))
const NotFound = page(() => import('./pages/NotFound.jsx'))

function PageLoading() {
  return (
    <div className="container-x py-20" aria-busy="true">
      <div className="h-8 w-1/2 animate-pulse rounded-lg bg-cream" />
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-cream" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/kuhusu" element={<About />} />
            <Route path="/uongozi" element={<Leadership />} />
            <Route path="/ratiba" element={<Schedule />} />
            <Route path="/tazama" element={<Live />} />
            <Route path="/idara" element={<Departments />} />
            <Route path="/huduma" element={<Departments />} />
            <Route path="/idara/:slug" element={<MinistryDetail />} />
            <Route path="/jumuiya" element={<Jumuiya />} />
            <Route path="/matukio" element={<Events />} />
            <Route path="/matukio/:slug" element={<EventDetail />} />
            <Route path="/mahubiri" element={<Sermons />} />
            <Route path="/mahubiri/pakia" element={<UploadSermon />} />
            <Route path="/mahubiri/:slug" element={<SermonDetail />} />
            <Route path="/habari" element={<News />} />
            <Route path="/habari/:slug" element={<NewsDetail />} />
            <Route path="/neno-la-leo" element={<Devotions />} />
            <Route path="/neno-la-leo/:date" element={<Devotions />} />
            <Route path="/mipango-ya-kusoma" element={<ReadingPlans />} />
            <Route path="/mipango-ya-kusoma/:slug" element={<ReadingPlanDetail />} />
            <Route path="/maktaba" element={<Library />} />
            <Route path="/maktaba/:slug" element={<LibraryDetail />} />
            <Route path="/elimu" element={<Library />} />
            <Route path="/miradi" element={<Projects />} />
            <Route path="/miradi/:slug" element={<ProjectDetail />} />
            <Route path="/michango" element={<Giving />} />
            <Route path="/matunzio" element={<Gallery />} />
            <Route path="/matunzio/:slug" element={<Gallery />} />
            <Route path="/wasiliana" element={<Contact />} />
            <Route path="/karibu" element={<Visitor />} />

            <Route path="/shiriki" element={<Involve />} />
            <Route path="/ubatizo" element={<Baptism />} />
            <Route path="/jiunge" element={<JoinTeam />} />
            <Route path="/kujitolea" element={<Volunteer />} />
            <Route path="/ushuhuda" element={<Testimonies />} />
            <Route path="/maombi" element={<Prayer />} />
            <Route path="/jisajili" element={<Register />} />
            <Route path="/ubia" element={<Partner />} />

            <Route path="/akaunti" element={<Account />} />
            <Route path="/thibitisha/:token" element={<VerifyCard />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
