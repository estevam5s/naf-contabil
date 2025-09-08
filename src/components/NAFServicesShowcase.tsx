'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, FileText, Users, Phone, Shield, TrendingUp, Building, Globe, BookOpen, CreditCard } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  category: string
  isActive: boolean
}

export default function NAFServicesShowcase() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedServices()
  }, [])

  const loadFeaturedServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const allServices = await response.json()
        // Pegar apenas 6 serviços principais para showcase
        const featuredServices = allServices.slice(0, 6)
        setServices(featuredServices)
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'IMPOSTO_RENDA': return Calculator
      case 'CADASTROS_DOCUMENTOS': return FileText
      case 'ESOCIAL_TRABALHISTA': return Users
      case 'MEI_EMPRESAS': return Building
      case 'CERTIDOES_CONSULTAS': return Shield
      case 'PAGAMENTOS_PARCELAMENTOS': return CreditCard
      case 'COMERCIO_EXTERIOR': return Globe
      case 'ACESSO_DIGITAL': return Phone
      default: return BookOpen
    }
  }

  const getServiceColor = (category: string) => {
    switch (category) {
      case 'IMPOSTO_RENDA': return 'bg-blue-100 text-blue-600'
      case 'CADASTROS_DOCUMENTOS': return 'bg-green-100 text-green-600'
      case 'ESOCIAL_TRABALHISTA': return 'bg-purple-100 text-purple-600'
      case 'MEI_EMPRESAS': return 'bg-orange-100 text-orange-600'
      case 'CERTIDOES_CONSULTAS': return 'bg-red-100 text-red-600'
      case 'PAGAMENTOS_PARCELAMENTOS': return 'bg-indigo-100 text-indigo-600'
      case 'COMERCIO_EXTERIOR': return 'bg-cyan-100 text-cyan-600'
      case 'ACESSO_DIGITAL': return 'bg-pink-100 text-pink-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                <div className="w-16 h-5 bg-gray-200 rounded"></div>
              </div>
              <div className="w-3/4 h-5 bg-gray-200 rounded mb-2"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => {
        const IconComponent = getServiceIcon(service.category)
        const colorClass = getServiceColor(service.category)
        
        return (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                {service.isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Disponível
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <CardDescription className="line-clamp-2">{service.description}</CardDescription>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
