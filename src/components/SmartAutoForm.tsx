'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock, User, Phone, Mail, FileText, Calendar } from 'lucide-react'

interface AutoFormProps {
  serviceId: string
  serviceName: string
  onSubmit: (data: any) => void
  onCancel: () => void
}

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  address: string
}

interface PreFillData {
  userData: UserData
  recentDemands: any[]
  similarServices: any[]
  completionRate: {
    total: number
    completed: number
  }
}

export default function SmartAutoForm({ serviceId, serviceName, onSubmit, onCancel }: AutoFormProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [preFillData, setPreFillData] = useState<PreFillData | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    additionalInfo: '',
    urgency: 'MEDIUM'
  })
  const [editMode, setEditMode] = useState(false)
  const [confirming, setConfirming] = useState(false)

  // Buscar dados para pré-preenchimento
  useEffect(() => {
    const fetchPreFillData = async () => {
      if (!session?.user?.email) return

      try {
        const response = await fetch(`/api/user/auto-request?serviceId=${serviceId}`)
        const data = await response.json()
        
        if (data.success) {
          setPreFillData(data)
          setFormData(prev => ({
            ...prev,
            name: data.userData.name || '',
            email: data.userData.email || '',
            phone: data.userData.phone || '',
            cpf: data.userData.cpf || '',
            address: data.userData.address || ''
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }

    fetchPreFillData()
  }, [serviceId, session])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getFieldStatus = (field: string, value: string) => {
    const originalValue = preFillData?.userData[field as keyof UserData] || ''
    
    if (!value) return { icon: AlertCircle, color: 'text-red-500', text: 'Obrigatório' }
    if (value === originalValue) return { icon: CheckCircle, color: 'text-green-500', text: 'Preenchido automaticamente' }
    return { icon: CheckCircle, color: 'text-blue-500', text: 'Atualizado' }
  }

  const validateForm = () => {
    return formData.name && formData.email && formData.phone && formData.cpf
  }

  const handleConfirm = async () => {
    if (!validateForm()) return

    setConfirming(true)
    try {
      const response = await fetch('/api/user/auto-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          additionalInfo: formData.additionalInfo,
          urgency: formData.urgency
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Atualizar perfil se dados foram alterados
        const hasChanges = Object.keys(formData).some(key => {
          if (key === 'additionalInfo' || key === 'urgency') return false
          return formData[key as keyof typeof formData] !== (preFillData?.userData[key as keyof UserData] || '')
        })

        if (hasChanges) {
          await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              phone: formData.phone,
              cpf: formData.cpf,
              address: formData.address
            })
          })
        }

        onSubmit(result.demand)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Erro ao criar solicitação:', error)
      alert('Erro ao criar solicitação. Tente novamente.')
    } finally {
      setConfirming(false)
    }
  }

  if (!preFillData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 animate-spin" />
            <CardTitle>Carregando dados...</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Buscando suas informações para agilizar o processo...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span>Solicitação Inteligente: {serviceName}</span>
        </CardTitle>
        <CardDescription>
          Seus dados foram pré-preenchidos automaticamente. Verifique e confirme se estão corretos.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Estatísticas do usuário */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total de Solicitações</p>
                <p className="text-2xl font-bold">{preFillData.completionRate.total}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Concluídas</p>
                <p className="text-2xl font-bold">{preFillData.completionRate.completed}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Taxa de Sucesso</p>
                <p className="text-2xl font-bold">
                  {preFillData.completionRate.total > 0 
                    ? Math.round((preFillData.completionRate.completed / preFillData.completionRate.total) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Histórico de serviços similares */}
        {preFillData.similarServices.length > 0 && (
          <Card className="p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Histórico deste Serviço</h3>
            <div className="space-y-2">
              {preFillData.similarServices.map((service: any) => (
                <div key={service.id} className="flex items-center justify-between text-sm">
                  <span>Protocolo: {service.protocol}</span>
                  <Badge variant={service.attendances[0]?.status === 'COMPLETED' ? 'default' : 'secondary'}>
                    {service.attendances[0]?.status === 'COMPLETED' ? 'Concluído' : 'Em andamento'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Formulário */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Dados Pessoais</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancelar Edição' : 'Editar Dados'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome Completo</label>
              <div className="relative">
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!editMode}
                  className={formData.name ? 'border-green-300' : 'border-red-300'}
                />
                <div className="absolute right-2 top-2.5">
                  {(() => {
                    const status = getFieldStatus('name', formData.name)
                    return <status.icon className={`h-4 w-4 ${status.color}`} />
                  })()}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {getFieldStatus('name', formData.name).text}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={true}
                  className="border-green-300"
                />
                <div className="absolute right-2 top-2.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <p className="text-xs text-green-600">Email da conta autenticada</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <div className="relative">
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!editMode}
                  placeholder="(11) 99999-9999"
                  className={formData.phone ? 'border-green-300' : 'border-red-300'}
                />
                <div className="absolute right-2 top-2.5">
                  {(() => {
                    const status = getFieldStatus('phone', formData.phone)
                    return <status.icon className={`h-4 w-4 ${status.color}`} />
                  })()}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {getFieldStatus('phone', formData.phone).text}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">CPF</label>
              <div className="relative">
                <Input
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  disabled={!editMode}
                  placeholder="000.000.000-00"
                  className={formData.cpf ? 'border-green-300' : 'border-red-300'}
                />
                <div className="absolute right-2 top-2.5">
                  {(() => {
                    const status = getFieldStatus('cpf', formData.cpf)
                    return <status.icon className={`h-4 w-4 ${status.color}`} />
                  })()}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {getFieldStatus('cpf', formData.cpf).text}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Endereço</label>
            <div className="relative">
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!editMode}
                placeholder="Rua, número, bairro, cidade - CEP"
              />
              <div className="absolute right-2 top-2.5">
                {(() => {
                  const status = getFieldStatus('address', formData.address)
                  return <status.icon className={`h-4 w-4 ${status.color}`} />
                })()}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {getFieldStatus('address', formData.address).text}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Informações Adicionais</label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              className="w-full p-3 border rounded-md"
              rows={3}
              placeholder="Descreva detalhes específicos para esta solicitação..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Urgência</label>
            <select
              value={formData.urgency}
              onChange={(e) => handleInputChange('urgency', e.target.value)}
              className="w-full p-3 border rounded-md"
            >
              <option value="LOW">Baixa - Não há pressa</option>
              <option value="MEDIUM">Média - Prazo normal</option>
              <option value="HIGH">Alta - Urgente</option>
            </select>
          </div>
        </div>

        {/* Confirmação */}
        <Card className="p-4 bg-gray-50">
          <h3 className="font-semibold mb-3">✅ Confirmar Solicitação</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Serviço:</strong> {serviceName}</p>
            <p><strong>Solicitante:</strong> {formData.name || 'Nome obrigatório'}</p>
            <p><strong>Contato:</strong> {formData.phone || 'Telefone obrigatório'}</p>
            <p><strong>Urgência:</strong> {
              formData.urgency === 'HIGH' ? 'Alta' : 
              formData.urgency === 'MEDIUM' ? 'Média' : 'Baixa'
            }</p>
          </div>
        </Card>

        {/* Botões */}
        <div className="flex space-x-4">
          <Button
            onClick={handleConfirm}
            disabled={!validateForm() || confirming}
            className="flex-1"
            size="lg"
          >
            {confirming ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Criando Solicitação...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar e Criar Solicitação
              </>
            )}
          </Button>
          
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={confirming}
            size="lg"
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
