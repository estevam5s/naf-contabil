'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutNAF() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sobre o NAF
          </h1>
          <p className="text-gray-600 mt-2">
            Núcleo de Apoio Contábil e Fiscal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Missão</CardTitle>
              <CardDescription>Nosso propósito</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Prestar serviços gratuitos de orientação contábil e fiscal para microempreendedores e pequenas empresas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Serviços</CardTitle>
              <CardDescription>O que oferecemos</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Consultoria contábil</li>
                <li>• Orientação fiscal</li>
                <li>• Gestão empresarial</li>
                <li>• Planejamento tributário</li>
              </ul>
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
