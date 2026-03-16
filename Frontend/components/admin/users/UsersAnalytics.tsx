import React from 'react'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-slate-900 mb-1">{`District: ${label}`}</p>
        <p className="text-blue-600 font-medium">{`${payload[0].value} Users`}</p>
      </div>
    )
  }
  return null
}

export default function UsersAnalytics({ usersByDistrict, monthlyUsers, userRoleDistribution }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Users by District</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={usersByDistrict} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis stroke="#94a3b8" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fontSize: 10 }} />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={1000} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Monthly Users Count</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyUsers}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
            <Bar dataKey="users" fill="#16a34a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">User Role Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={userRoleDistribution} cx="50%" cy="50%" dataKey="value" labelLine={false} label={({ name, value }: any) => `${name}: ${value}`} outerRadius={100}>
              {userRoleDistribution.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
