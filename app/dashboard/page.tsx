'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// Chart
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [score, setScore] = useState(5)
  const [msg, setMsg] = useState('')
  const [logs, setLogs] = useState<any[]>([])
  const [userId, setUserId] = useState('')
  const [feedback, setFeedback] = useState('')

  // 🔐 Auth + fetch
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setEmail(user.email || '')
      setUserId(user.id)

      await fetchLogs(user.id)
    }

    init()
  }, [])

  // 📥 Fetch logs
  async function fetchLogs(uid: string) {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    if (!error) setLogs(data || [])
  }

  // 🧠 Feedback logic
  function generateFeedback(score: number) {
    if (score <= 3)
      return "😔 Tough day. Try a short walk or breathing."
    if (score <= 6)
      return "🙂 You're okay. Relax or talk to someone."
    if (score <= 8)
      return "😊 Nice balance. Keep it going!"
    return "🔥 Amazing energy today!"
  }

  // 💾 Save mood
  async function handleSave() {
    if (!userId) return

    const { error } = await supabase
      .from('mood_logs')
      .insert([{ user_id: userId, score }])

    if (error) {
      setMsg(error.message)
      setFeedback('')
    } else {
      setMsg('Mood saved ✅')
      setFeedback(generateFeedback(score))
      await fetchLogs(userId)
    }
  }

  // 📊 Stats
  const avgMood =
    logs.length > 0
      ? (
          logs.reduce((sum, log) => sum + log.score, 0) /
          logs.length
        ).toFixed(1)
      : null

  const latestMood = logs.length > 0 ? logs[0].score : null

  // 📈 Chart data (last 7 entries)
  const chartData = {
    labels: logs
      .slice(0, 7)
      .map((log) =>
        new Date(log.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
      .reverse(),

    datasets: [
      {
        label: 'Mood',
        data: logs.slice(0, 7).map((log) => log.score).reverse(),
        borderWidth: 3,
        tension: 0.4,
        borderColor: '#4ade80',
        backgroundColor: '#4ade80',
      },
    ],
  }

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: 'auto' }}>
      <h1>Dashboard</h1>
      <p>Welcome: {email}</p>

      {/* 📊 Stats */}
      <div style={{ display: 'flex', gap: 30, marginBottom: 20 }}>
        {latestMood && (
          <div>
            <p>🟢 Latest</p>
            <h2>{latestMood}</h2>
          </div>
        )}

        {avgMood && (
          <div>
            <p>📊 Average</p>
            <h2>{avgMood}</h2>
          </div>
        )}
      </div>

      <h3>How are you feeling today? (1–10)</h3>

      <input
        type="number"
        min="1"
        max="10"
        value={score}
        placeholder="Enter mood (1–10)"
        onChange={(e) => setScore(Number(e.target.value))}
      />

      <br /><br />

      <button onClick={handleSave}>Save Mood</button>

      <p style={{ color: 'lightgreen' }}>{msg}</p>

      {/* 💡 Feedback */}
      {feedback && (
        <p style={{ marginTop: 10, fontWeight: 'bold' }}>
          {feedback}
        </p>
      )}

      <hr />

      {/* 📈 GRAPH */}
      <h2>Mood Trend</h2>

      {logs.length > 0 ? (
        <div
          style={{
            maxWidth: 600,
            background: '#111',
            padding: 20,
            borderRadius: 12,
          }}
        >
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true },
              },
              scales: {
                y: {
                  min: 1,
                  max: 10,
                  ticks: { stepSize: 1 },
                },
              },
            }}
          />
        </div>
      ) : (
        <p>No data for graph</p>
      )}

      <hr />

      {/* 📜 HISTORY */}
      <h2>Your Mood History</h2>

      {logs.length === 0 ? (
        <p>No data yet</p>
      ) : (
        logs.map((log) => (
          <div
            key={log.id}
            style={{
              background: '#111',
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <p>
              Score: <b>{log.score}</b>
            </p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              {new Date(log.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  )
}  