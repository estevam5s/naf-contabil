'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NAFServices() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Serviços NAF
          </h1>
          <p className="text-gray-600 mt-2">
            Serviços do Núcleo de Apoio Contábil e Fiscal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultoria Especializada</CardTitle>
              <CardDescription>Orientação profissional</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Consultoria contábil e fiscal especializada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Atendimento Gratuito</CardTitle>
              <CardDescription>Serviços sem custo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Todos os serviços são oferecidos gratuitamente
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Voltar ao dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
