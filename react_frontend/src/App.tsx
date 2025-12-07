import { useEffect, useState } from 'react'
import { Login } from './components/Login'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Tipagem dos dados
interface WeatherLog {
  _id: string;
  city: string;
  temperature_c: number;
  weather_code: number;
  timestamp: number;
}

interface InsightsData {
  city: string;
  latest_temp: number;
  average_10_readings: number;
  trend: string;
  alert: string;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('gdash_token'));
  const [logs, setLogs] = useState<WeatherLog[]>([])
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(false)

  // Login com Sucesso
  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('gdash_token', newToken);
    setToken(newToken);
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('gdash_token');
    setToken(null);
    setLogs([]);
    setInsights(null);
  }

  // Buscar Dados (Protegido)
  const fetchData = async () => {
    if (!token) return;

    setLoading(true)
    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const resLogs = await fetch('http://localhost:3000/api/weather/logs', { headers })
      
      if (resLogs.status === 401) {
        handleLogout();
        return;
      }

      const dataLogs = await resLogs.json()
      setLogs(dataLogs)

      const resInsights = await fetch('http://localhost:3000/api/weather/logs/insights', { headers })
      if (resInsights.ok) {
        const dataInsights = await resInsights.json()
        setInsights(dataInsights)
      }
      
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    if (!logs.length) return

    const headers = ["Data/Hora,Cidade,Temperatura (C),Condicao WMO"]
    const rows = logs.map(log => {
      const date = new Date(log.timestamp * 1000).toLocaleString('pt-BR').replace(',', '')
      return `${date},${log.city},${log.temperature_c},${log.weather_code}`
    })

    const csvContent = [headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'relatorio_gdash.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    if (token) {
      fetchData()
      const interval = setInterval(fetchData, 5000)
      return () => clearInterval(interval)
    }
  }, [token])

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">GDASH Weather</h1>
            <p className="text-slate-500">Logado como Admin</p>
          </div>
          
          <div className="flex gap-3">
             {/* BOTÃO CSV */}
            <Button 
              variant="outline" 
              onClick={downloadCSV} 
              disabled={logs.length === 0}
              className="border-slate-300 hover:bg-slate-100 text-slate-700"
            >
              Baixar CSV 📥
            </Button>

            <Button onClick={fetchData} disabled={loading}>
              {loading ? 'Analisando...' : 'Atualizar'}
            </Button>

            <Button variant="destructive" onClick={handleLogout}>
              Sair 🚪
            </Button>
          </div>
        </div>

        {/* SEÇÃO DE IA */}
        {insights && (
          <Card className="border-l-4 border-l-indigo-500 shadow-md animate-in fade-in zoom-in duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-indigo-700">✨ Análise de IA em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div><p className="text-sm text-slate-500">Tendência</p><p className="text-xl font-bold">{insights.trend}</p></div>
              <div><p className="text-sm text-slate-500">Diagnóstico</p><p className={`text-xl font-bold ${insights.alert.includes('ALERTA') ? 'text-red-600' : 'text-green-600'}`}>{insights.alert}</p></div>
              <div><p className="text-sm text-slate-500">Média (10)</p><p className="text-xl font-bold">{insights.average_10_readings}°C</p></div>
            </CardContent>
          </Card>
        )}

        {/* Cards Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card><CardHeader><CardTitle>Temp. Atual</CardTitle></CardHeader><CardContent><div className="text-4xl font-bold">{logs[0]?.temperature_c.toFixed(1)}°C</div></CardContent></Card>
           <Card><CardHeader><CardTitle>Status</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">Online</div><p className="text-xs text-slate-500">RabbitMQ Connected</p></CardContent></Card>
           <Card><CardHeader><CardTitle>Total Processado</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{logs.length}</div></CardContent></Card>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader><CardTitle>Últimos Registros</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horário</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Temp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.slice(0, 10).map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>{new Date(log.timestamp * 1000).toLocaleTimeString()}</TableCell>
                    <TableCell>{log.city}</TableCell>
                    <TableCell>{log.temperature_c}°C</TableCell>
                    <TableCell>{log.weather_code}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default App