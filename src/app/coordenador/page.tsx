import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PowerBIAdvanced from '@/components/PowerBIAdvanced'
import RelatorioCoordrenador from '@/components/RelatorioCoordrenador'
import NotificationSystem from '@/components/NotificationSystem'
import PerformanceAnalytics from '@/components/PerformanceAnalytics'
import SystemManagement from '@/components/SystemManagement'
import UserManagement from '@/components/UserManagement'
import { BarChart3, FileText, Users, TrendingUp, Zap, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard do Coordenador - NAF Contábil',
  description: 'Relatórios, análises e Power BI para coordenadores do NAF',
}

export default async function CoordenadorPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'COORDINATOR') {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard do Coordenador</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo, {session.user.name}! Aqui você tem acesso a relatórios completos e integração com Power BI.
          </p>
        </div>
        <NotificationSystem />
      </div>

      <Tabs defaultValue="powerbi" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="powerbi" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Dashboard Avançado
          </TabsTrigger>
          <TabsTrigger value="relatorio" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatório PDF
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gestão de Usuários
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics Avançado
          </TabsTrigger>
          <TabsTrigger value="sistema" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="powerbi" className="space-y-6">
          <PowerBIAdvanced />
        </TabsContent>

        <TabsContent value="relatorio" className="space-y-6">
          <RelatorioCoordrenador />
        </TabsContent>

        <TabsContent value="usuarios" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PerformanceAnalytics />
        </TabsContent>

        <TabsContent value="sistema" className="space-y-6">
          <SystemManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
