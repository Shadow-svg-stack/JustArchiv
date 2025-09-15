import React, { useState, useEffect } from 'react'
import { Cpu, HardDrive, Wifi, Users, TrendingUp, TrendingDown } from 'lucide-react'

const SystemMonitoring = () => {
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 62,
    disk: 78,
    network: 23,
    activeUsers: 12,
    requestsPerMinute: 156
  })

  const [realTimeData, setRealTimeData] = useState([])

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(0, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        requestsPerMinute: Math.max(0, prev.requestsPerMinute + Math.floor((Math.random() - 0.5) * 20))
      }))

      setRealTimeData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          cpu: metrics.cpu,
          memory: metrics.memory
        }].slice(-20)
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [metrics.cpu, metrics.memory])

  const getStatusColor = (value, thresholds = { warning: 70, critical: 90 }) => {
    if (value >= thresholds.critical) return 'text-red-600'
    if (value >= thresholds.warning) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getStatusBg = (value, thresholds = { warning: 70, critical: 90 }) => {
    if (value >= thresholds.critical) return 'bg-red-100'
    if (value >= thresholds.warning) return 'bg-yellow-100'
    return 'bg-green-100'
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Monitoring système en temps réel</h3>

      {/* System Metrics */}
      <div className="grid grid-2 md:grid-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getStatusBg(metrics.cpu)}`}>
                <Cpu className={getStatusColor(metrics.cpu)} size={20} />
              </div>
              <span className="font-medium">CPU</span>
            </div>
            <span className={`text-lg font-semibold ${getStatusColor(metrics.cpu)}`}>
              {metrics.cpu.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                metrics.cpu >= 90 ? 'bg-red-500' : 
                metrics.cpu >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${metrics.cpu}%` }}
            ></div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getStatusBg(metrics.memory)}`}>
                <HardDrive className={getStatusColor(metrics.memory)} size={20} />
              </div>
              <span className="font-medium">Mémoire</span>
            </div>
            <span className={`text-lg font-semibold ${getStatusColor(metrics.memory)}`}>
              {metrics.memory.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                metrics.memory >= 90 ? 'bg-red-500' : 
                metrics.memory >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${metrics.memory}%` }}
            ></div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getStatusBg(metrics.disk)}`}>
                <HardDrive className={getStatusColor(metrics.disk)} size={20} />
              </div>
              <span className="font-medium">Disque</span>
            </div>
            <span className={`text-lg font-semibold ${getStatusColor(metrics.disk)}`}>
              {metrics.disk}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                metrics.disk >= 90 ? 'bg-red-500' : 
                metrics.disk >= 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${metrics.disk}%` }}
            ></div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wifi className="text-blue-600" size={20} />
              </div>
              <span className="font-medium">Réseau</span>
            </div>
            <span className="text-lg font-semibold text-blue-600">
              {metrics.network.toFixed(1)} MB/s
            </span>
          </div>
          <div className="text-sm text-secondary">
            Trafic entrant/sortant
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={20} />
              </div>
              <span className="font-medium">Utilisateurs actifs</span>
            </div>
            <span className="text-lg font-semibold text-purple-600">
              {metrics.activeUsers}
            </span>
          </div>
          <div className="text-sm text-secondary">
            Connectés maintenant
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="text-orange-600" size={20} />
              </div>
              <span className="font-medium">Requêtes/min</span>
            </div>
            <span className="text-lg font-semibold text-orange-600">
              {metrics.requestsPerMinute}
            </span>
          </div>
          <div className="text-sm text-secondary">
            Charge serveur
          </div>
        </div>
      </div>

      {/* Real-time Chart */}
      <div className="card">
        <h4 className="font-medium mb-4">Performance en temps réel</h4>
        <div className="h-64 flex items-end justify-between gap-1">
          {realTimeData.map((data, index) => (
            <div key={index} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full flex flex-col gap-1">
                <div 
                  className="bg-blue-500 rounded-t"
                  style={{ height: `${(data.cpu / 100) * 100}px` }}
                  title={`CPU: ${data.cpu.toFixed(1)}%`}
                ></div>
                <div 
                  className="bg-green-500 rounded-b"
                  style={{ height: `${(data.memory / 100) * 100}px` }}
                  title={`Mémoire: ${data.memory.toFixed(1)}%`}
                ></div>
              </div>
              {index % 5 === 0 && (
                <span className="text-xs text-secondary transform rotate-45">
                  {data.time}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm">CPU</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm">Mémoire</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="card">
        <h4 className="font-medium mb-4">Alertes système</h4>
        <div className="space-y-3">
          {metrics.cpu > 80 && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="text-red-600" size={20} />
              <div>
                <p className="font-medium text-red-800">CPU élevé</p>
                <p className="text-sm text-red-700">
                  Utilisation CPU à {metrics.cpu.toFixed(1)}% - Surveillance recommandée
                </p>
              </div>
            </div>
          )}
          
          {metrics.memory > 85 && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={20} />
              <div>
                <p className="font-medium text-yellow-800">Mémoire élevée</p>
                <p className="text-sm text-yellow-700">
                  Utilisation mémoire à {metrics.memory.toFixed(1)}% - Nettoyage recommandé
                </p>
              </div>
            </div>
          )}
          
          {metrics.cpu <= 80 && metrics.memory <= 85 && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
              <div>
                <p className="font-medium text-green-800">Système stable</p>
                <p className="text-sm text-green-700">
                  Toutes les métriques sont dans les limites normales
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SystemMonitoring
