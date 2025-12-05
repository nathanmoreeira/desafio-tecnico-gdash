import { useEffect, useState } from 'react'
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

// Tipagem dos Logs (Dados Brutos)
interface WeatherLog {
  _id: string;
  city: string;
  temperature_c: number;
  weather_code: number;
  timestamp: number;
}

// Tipagem da IA (Dados Inteligentes)
interface InsightsData {
  city: string;
  latest_temp: number;
  average_10_readings: number;
  trend: string;
  alert: string;
  analysis_timestamp: string;
}

function App() {
  const [logs, setLogs] = useState<WeatherLog[]>([])
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(false)

  // Função unificada para atualizar tudo
  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Busca os Logs
      const resLogs = await fetch('http://localhost:3000/api/weather/logs')
      const dataLogs = await resLogs.json()
      setLogs(dataLogs)

      // 2. Busca os Insights da IA
      const resInsights = await fetch('http://localhost:3000/api/weather/logs/insights')
      const dataInsights = await resInsights.json()
      setInsights(dataInsights)
      
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  // NOVA FUNÇÃO: Gerar e Baixar CSV
  const downloadCSV = () => {
    if (!logs.length) return

    // 1. Cabeçalho do CSV
    const headers = ["Data/Hora,Cidade,Temperatura (C),Condicao WMO"]
    
    // 2. Transforma os dados em linhas de texto
    const rows = logs.map(log => {
      // Formata a data para ficar legível no Excel (pt-BR)
      const date = new Date(log.timestamp * 1000).toLocaleString('pt-BR').replace(',', '')
      return `${date},${log.city},${log.temperature_c},${log.weather_code}`
    })

    // 3. Junta tudo e cria o blob
    const csvContent = [headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    // 4. Criação do link invisível para download
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'relatorio_climatico_gdash.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Atualização automática ao iniciar
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">GDASH Weather</h1>
            <p className="text-slate-500">Monitoramento Climático Inteligente</p>
          </div>
          
          {/* Botões de Ação */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={downloadCSV} 
              disabled={logs.length === 0}
              className="border-slate-300 hover:bg-slate-100"
            >
              Baixar CSV 📥
            </Button>
            
            <Button onClick={fetchData} disabled={loading}>
              {loading ? 'Analisando...' : 'Atualizar Dados'}
            </Button>
          </div>
        </div>

        {/* --- SEÇÃO DE IA (INSIGHTS) --- */}
        {insights && (
          <Card className="border-l-4 border-l-indigo-500 shadow-md animate-in fade-in duration-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                ✨ Análise de IA em Tempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div>
                <p className="text-sm text-slate-500">Tendência Térmica</p>
                <p className="text-xl font-bold text-slate-800">{insights.trend}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Diagnóstico do Sistema</p>
                <p className={`text-xl font-bold ${insights.alert.includes('ALERTA') ? 'text-red-600' : 'text-green-600'}`}>
                  {insights.alert}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Média (Últimas 10)</p>
                <p className="text-xl font-bold text-slate-800">{insights.average_10_readings}°C</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards de Métricas Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Temperatura Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-900">
                {logs[0]?.temperature_c.toFixed(1)}°C
              </div>
              <p className="text-xs text-slate-500 mt-1">{logs[0]?.city}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Status da Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Operacional</div>
              <p className="text-xs text-slate-500 mt-1">RabbitMQ & Go Worker Ativos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Processado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{logs.length}</div>
              <p className="text-xs text-slate-500 mt-1">Registros no MongoDB</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Histórico */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Coleta</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Horário</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Temperatura</TableHead>
                  <TableHead>Código WMO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.slice(0, 10).map((log) => ( // Mostra Top 10
                  <TableRow key={log._id}>
                    <TableCell>
                      {new Date(log.timestamp * 1000).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{log.city}</TableCell>
                    <TableCell className="font-medium">{log.temperature_c}°C</TableCell>
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