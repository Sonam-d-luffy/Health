import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InfoCard from '../Components/InfoCard'
import assets from '../assets/assets'
import Navbar from '../Components/Navbar'
import Bg from '../Components/Bg'

const Academy = () => {
  const [academy, setAcademy] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('matching')
  const [search, setSearch] = useState('')
  const [sport, setSport] = useState('')
  const [girlsOnly, setGirlsOnly] = useState(false)
  const [address, setAddress] = useState('')
  const [radius, setRadius] = useState('10000')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [pagination, setPagination] = useState({})
  const navigate = useNavigate()
  const { id } = useParams()

  const getAca = (acaId) => {
    navigate(`/academy/${acaId}`)
  }

  useEffect(() => {
    setPage(1)
  }, [search, sport, girlsOnly, address, radius, sortBy, order, mode])

  useEffect(() => {
    const fetchAcademy = async () => {
      setLoading(true)
      setMessage('')
      try {
        let url = ''
        let params = {
          search: search || undefined,
          sport: sport || undefined,
          page,
          limit,
          sortBy,
          order
        }
        if (address.trim()) {
          url = '${import.meta.env.VITE_BACKEND_URL}/api/academy/search-address'
          params.address = address
          params.radius = radius
        } else if (girlsOnly) {
          url = `${import.meta.env.VITE_BACKEND_URL}/api/academy/girls`
        } else if (mode === 'matching') {
          url = `${import.meta.env.VITE_BACKEND_URL}/api/academy/matchingAcademy/${id}`
        } else {
          url = `${import.meta.env.VITE_BACKEND_URL}/api/academy/academies`
        }
        const res = await axios.get(url, { params })
        const data = res.data.academies || res.data.institutes || []
        setAcademy(data)
        setPagination(res.data.pagination || {})
      } catch (error) {
        setAcademy([])
        setPagination({})
        setMessage(error?.response?.data?.message || 'Could not find academies')
      } finally {
        setLoading(false)
      }
    }
    const timer = setTimeout(fetchAcademy, 300)
    return () => clearTimeout(timer)
  }, [id, page, search, sport, girlsOnly, address, radius, sortBy, order, mode, limit])

  const changeMode = (newMode) => {
    setMode(newMode)
    setGirlsOnly(false)
    setAddress('')
    setPage(1)
  }

  const handleGirls = () => {
    setGirlsOnly(prev => !prev)
    setAddress('')
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setSport('')
    setGirlsOnly(false)
    setAddress('')
    setRadius('10000')
    setSortBy('createdAt')
    setOrder('desc')
    setMode('matching')
    setPage(1)
  }

  return (
    <Bg>
      <div className="min-h-screen text-black">
        <Navbar
          title="Academies for you"
          logo={assets.clogo}
          buttonName="Home"
          onButtonClick={() => navigate('/')}
        />
        <div className="max-w-7xl mx-auto px-5 pt-28 pb-10">
          <div className="bg-white/95 rounded-2xl shadow-lg border border-gray-200 p-5 mb-6">
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={() => changeMode('matching')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'matching' && !girlsOnly && !address ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
              >
                For You
              </button>
              <button
                onClick={() => changeMode('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'all' && !girlsOnly && !address ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
              >
                All Institutes
              </button>
              <button
                onClick={handleGirls}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${girlsOnly ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
              >
                Girls Institutes
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Search Institute
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by institute, sport, city..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Sport
                </label>
                <input
                  type="text"
                  value={sport}
                  onChange={e => setSport(e.target.value)}
                  placeholder="Football, Cricket..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none bg-white"
                  >
                    <option value="createdAt">Date</option>
                    <option value="name">Name</option>
                    <option value="city">City</option>
                    <option value="state">State</option>
                    <option value="updatedAt">Updated</option>
                  </select>
                  <button
                    onClick={() => setOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="px-3 border border-gray-300 rounded-lg text-sm font-bold hover:bg-black hover:text-white transition"
                  >
                    {order === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Search By Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter any address or location..."
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Radius
                </label>
                <select
                  value={radius}
                  onChange={e => setRadius(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm outline-none bg-white"
                >
                  <option value="5000">5 KM</option>
                  <option value="10000">10 KM</option>
                  <option value="20000">20 KM</option>
                  <option value="50000">50 KM</option>
                  <option value="100000">100 KM</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-black rounded-lg text-sm font-semibold hover:bg-black hover:text-white transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
          {address && (
            <div className="bg-white/95 rounded-xl border border-gray-200 px-4 py-3 mb-5 text-sm">
              Searching institutes near <span className="font-semibold">{address}</span> within <span className="font-semibold">{Number(radius) / 1000} KM</span>
            </div>
          )}
          {message && (
            <div className="bg-white/95 rounded-xl border border-gray-200 px-4 py-4 mb-5 text-center text-sm font-medium">
              {message}
            </div>
          )}
          {loading && (
            <div className="text-center py-10">
              <p className="text-white font-semibold">Loading academies...</p>
            </div>
          )}
          {!loading && academy.length === 0 && (
            <div className="bg-white/95 rounded-xl border border-gray-200 py-12 text-center">
              <p className="text-gray-500">No institutes found.</p>
            </div>
          )}
          {!loading && academy.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {academy.map(aca => (
                  <div key={aca._id}>
                    <InfoCard
                      image={aca.docs?.image}
                      title={aca.name}
                      description={Array.isArray(aca.sports) ? aca.sports.join(', ') : aca.sports || 'Sports not specified'}
                      onClick={() => getAca(aca._id)}
                      buttonName="Enroll here"
                    />
                  </div>
                ))}
              </div>
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => setPage(prev => prev - 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${pagination.hasPreviousPage ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                  >
                    ← Previous
                  </button>
                  <span className="px-4 py-2 bg-white rounded-lg text-sm font-semibold">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage(prev => prev + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${pagination.hasNextPage ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Bg>
  )
}

export default Academy