import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import assets from '../assets/assets'
import Bg from '../Components/Bg'

const Submissions = () => {
  const [reports, setReports] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [mailedReports, setMailedReports] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')

  const navigate = useNavigate()
  const { academyId } = useParams()

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const res = await axios.get(
          `http://localhost:5000/api/reports/${academyId}/report`,
          {
            params: {
              search: search || undefined,
              status: status !== 'All' ? status : undefined,
              sortBy,
              order
            }
          }
        )
        setReports(Array.isArray(res.data.reports) ? res.data.reports : [])
      } catch (error) {
        if (error?.response?.status === 404) {
          setReports([])
        } else {
          setMessage(error?.response?.data?.message || 'Error fetching reports')
        }
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchReports, 300)
    return () => clearTimeout(timer)
  }, [academyId, search, status, sortBy, order])

  const updateStatus = async (id, newStatus) => {
    const report = reports.find(r => r._id === id)

    if (!report || report.status !== 'Pending') {
      return
    }

    const confirmed = window.confirm(
      `Are you sure you want to mark this report as ${newStatus}? This action cannot be changed later.`
    )

    if (!confirmed) return

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/reports/${id}/status`,
        { status: newStatus }
      )

      setMessage(res.data.message)

      setReports(prev =>
        prev.map(r =>
          r._id === id
            ? { ...r, status: res.data.report.status }
            : r
        )
      )
    } catch (error) {
      setMessage(
        error?.response?.data?.message || 'Error updating status'
      )
    }
  }
const sendMail = async id => {
  const report = reports.find(r => r._id === id)

  if (!report || report.mailSent) return

  const confirmed = window.confirm(
    'Are you sure you want to send the status update email?'
  )

  if (!confirmed) return

  try {
    const res = await axios.post(
      `http://localhost:5000/api/mail/${id}/send-mail`
    )

    setMessage(res.data.message)

    setReports(prev =>
      prev.map(r =>
        r._id === id
          ? { ...r, mailSent: true }
          : r
      )
    )
  } catch (error) {
    setMessage(
      error?.response?.data?.message || 'Error sending mail'
    )
  }
}

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

  return (
    <Bg>
      <div className="min-h-screen text-black">
        <div className="w-full px-5 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={assets.clogo}
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-xl font-bold text-white">
                Submissions
              </h1>
            </div>
<button
  onClick={() => navigate(-1)}
  className="px-4 py-2 border border-white rounded-lg text-sm font-semibold text-white hover:bg-white hover:text-black transition"
>
  ← Back
</button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white/95 rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Name or sport..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-black text-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-black bg-white text-black"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Sort
                </label>
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-black bg-white text-black"
                  >
                    <option value="createdAt">Date</option>
                    <option value="name">Name</option>
                    <option value="age">Age</option>
                    <option value="height">Height</option>
                    <option value="weight">Weight</option>
                    <option value="bmi">BMI</option>
                    <option value="experience">Experience</option>
                    <option value="status">Status</option>
                  </select>

                  <button
                    onClick={() =>
                      setOrder(prev =>
                        prev === 'asc' ? 'desc' : 'asc'
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-black hover:text-white transition text-sm font-bold"
                  >
                    {order === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className="mb-5 px-4 py-3 bg-white/95 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-black text-center text-sm font-medium">
                {message}
              </p>
            </div>
          )}

          {loading && (
            <div className="text-center py-10">
              <p className="text-white font-medium">
                Loading reports...
              </p>
            </div>
          )}

          {!loading && reports.length === 0 && (
            <div className="text-center py-12 bg-white/95 border border-gray-200 rounded-xl">
              <p className="text-gray-500">
                No reports found
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map(report => {
              const isFinal =
                report.status === 'Approved' ||
                report.status === 'Rejected'

            

              return (
                <div
                  key={report._id}
                  className="bg-white/95 border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-black truncate mr-2">
                      {report.name}
                    </h3>

                    <span
                      className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold whitespace-nowrap ${getStatusColor(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {report.image && (
                    <div className="mb-3 flex justify-center">
                      <img
                        src={report.image}
                        alt="Profile"
                        className="w-14 h-14 rounded-full border border-gray-200 object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-500 font-medium">
                        Sports
                      </span>
                      <span className="text-black text-right truncate">
                        {Array.isArray(report.sports)
                          ? report.sports.join(', ')
                          : report.sports}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-gray-500">Weight</p>
                        <p className="text-black font-semibold">
                          {report.weight}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Height</p>
                        <p className="text-black font-semibold">
                          {report.height}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">BMI</p>
                        <p className="text-black font-semibold">
                          {report.bmi}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500">Experience</p>
                        <p className="text-black font-semibold">
                          {report.experience}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500 font-medium">
                        BP
                      </span>
                      <span className="text-black">
                        {report.bloodPressure}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-500 font-medium">
                        Achievements
                      </p>
                      <p className="text-black mt-1 line-clamp-2">
                        {report.achievements || 'None'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateStatus(report._id, 'Approved')
                        }
                        disabled={isFinal}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isFinal
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {report.status === 'Approved'
                          ? 'Approved'
                          : 'Approve'}
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(report._id, 'Rejected')
                        }
                        disabled={isFinal}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isFinal
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {report.status === 'Rejected'
                          ? 'Rejected'
                          : 'Reject'}
                      </button>
                    </div>

                  <button
  onClick={() => sendMail(report._id)}
  disabled={report.mailSent}
  className={`w-full py-1.5 rounded-lg text-xs font-semibold transition ${
    report.mailSent
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : 'bg-black text-white hover:bg-gray-800'
  }`}
>
  {report.mailSent ? 'Mail Sent' : 'Send Mail'}
</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Bg>
  )
}

export default Submissions
