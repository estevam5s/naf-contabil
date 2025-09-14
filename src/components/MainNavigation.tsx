'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  Users,
  BarChart3,
  BookOpen,
  Calendar,
  Settings,
  FileText,
  Building2,
  GraduationCap,
  UserCheck,
  Zap,
  Home,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'
import NotificationCenter from '@/components/notifications/NotificationCenter'

const MainNavigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [dropdowns, setDropdowns] = useState({
    portals: false,
    services: false,
    management: false
  })
  const pathname = usePathname()

  // Detectar scroll para fixar a navegação
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Não fechar se o clique foi dentro de um dropdown ou em um link
      if (target.closest('.nav-dropdown') || target.closest('.dropdown-trigger')) {
        return
      }
      setDropdowns({ portals: false, services: false, management: false })
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const toggleDropdown = (dropdown: keyof typeof dropdowns) => {
    setDropdowns(prev => ({
      portals: false,
      services: false,
      management: false,
      [dropdown]: !prev[dropdown]
    }))
  }

  const closeAllDropdowns = () => {
    setDropdowns({ portals: false, services: false, management: false })
  }

  // Rotas principais organizadas por categoria
  const navigationRoutes = {
    portals: [
      {
        href: '/student-portal',
        label: 'Portal do Estudante',
        icon: GraduationCap,
        description: 'Área do estudante NAF',
        badge: 'Estudante'
      },
      {
        href: '/coordinator-dashboard',
        label: 'Dashboard Coordenador',
        icon: BarChart3,
        description: 'Painel administrativo',
        badge: 'Admin'
      },
      {
        href: '/naf-management',
        label: 'Gestão NAF',
        icon: Building2,
        description: 'Controle de operações',
        badge: 'Gestão'
      }
    ],
    services: [
      {
        href: '/naf-scheduling',
        label: 'Agendamento',
        icon: Calendar,
        description: 'Agendar atendimentos'
      },
      {
        href: '/services',
        label: 'Serviços NAF',
        icon: FileText,
        description: 'Lista de serviços'
      },
      {
        href: '/fiscal-guides',
        label: 'Guias Fiscais',
        icon: BookOpen,
        description: 'Orientações e legislações'
      },
      {
        href: '/schedule',
        label: 'Agenda Geral',
        icon: Calendar,
        description: 'Visualizar agenda'
      }
    ],
    auth: [
      {
        href: '/student-login',
        label: 'Login Estudante',
        icon: UserCheck,
        description: 'Acesso estudantil'
      },
      {
        href: '/coordinator-login',
        label: 'Login Coordenador',
        icon: Settings,
        description: 'Acesso administrativo'
      },
      {
        href: '/naf-login',
        label: 'Login NAF',
        icon: Building2,
        description: 'Acesso gestão'
      },
      {
        href: '/student-register',
        label: 'Cadastro Estudante',
        icon: Users,
        description: 'Novo cadastro'
      }
    ]
  }

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav
      className={`w-full nav-transition z-50 ${
        isScrolled
          ? 'fixed top-0 bg-white/95 dark:bg-slate-900/95 nav-backdrop shadow-lg border-b dark:border-slate-800'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b dark:border-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg">
              <Calculator className="h-6 w-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">NAF Estácio Florianópolis</h1>
              <p className="text-xs text-gray-600 dark:text-gray-300">Núcleo de Apoio Fiscal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Home */}
            <Link href="/">
              <Button
                variant={isActiveRoute('/') && pathname === '/' ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Início
              </Button>
            </Link>

            {/* Portais Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDropdown('portals')
                }}
              >
                <Users className="h-4 w-4" />
                Portais
                <ChevronDown className={`h-3 w-3 transition-transform ${dropdowns.portals ? 'rotate-180' : ''}`} />
              </Button>

              {dropdowns.portals && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 py-2 z-50 nav-dropdown">
                  {navigationRoutes.portals.map((route) => {
                    const IconComponent = route.icon
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                          isActiveRoute(route.href) ? 'bg-blue-50 dark:bg-blue-900/50 border-r-2 border-blue-500 dark:border-blue-400' : ''
                        }`}
                        onClick={closeAllDropdowns}
                      >
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{route.label}</p>
                          <p className="text-xs text-gray-500">{route.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {route.badge}
                        </Badge>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Serviços Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDropdown('services')
                }}
              >
                <FileText className="h-4 w-4" />
                Serviços
                <ChevronDown className={`h-3 w-3 transition-transform ${dropdowns.services ? 'rotate-180' : ''}`} />
              </Button>

              {dropdowns.services && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border dark:border-slate-700 py-2 z-50 nav-dropdown">
                  {navigationRoutes.services.map((route) => {
                    const IconComponent = route.icon
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                          isActiveRoute(route.href) ? 'bg-blue-50 dark:bg-blue-900/50 border-r-2 border-blue-500 dark:border-blue-400' : ''
                        }`}
                        onClick={closeAllDropdowns}
                      >
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{route.label}</p>
                          <p className="text-xs text-gray-500">{route.description}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Login/Auth Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 dropdown-trigger"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleDropdown('management')
                }}
              >
                <UserCheck className="h-4 w-4" />
                Acesso
                <ChevronDown className={`h-3 w-3 transition-transform ${dropdowns.management ? 'rotate-180' : ''}`} />
              </Button>

              {dropdowns.management && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border py-2 z-50 nav-dropdown">
                  {navigationRoutes.auth.map((route) => {
                    const IconComponent = route.icon
                    return (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                          isActiveRoute(route.href) ? 'bg-blue-50 dark:bg-blue-900/50 border-r-2 border-blue-500 dark:border-blue-400' : ''
                        }`}
                        onClick={closeAllDropdowns}
                      >
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{route.label}</p>
                          <p className="text-xs text-gray-500">{route.description}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Notification Center */}
            <NotificationCenter userId="guest-user" userType="user" />

            {/* Quick Access Button */}
            <Link href="/naf-scheduling">
              <Button size="sm" className="hidden sm:flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agendar
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md mobile-menu-enter">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Home */}
              <Link href="/" onClick={() => {setIsMobileMenuOpen(false); closeAllDropdowns()}}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveRoute('/') && pathname === '/'
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}>
                  <Home className="h-4 w-4" />
                  Início
                </div>
              </Link>

              {/* Portais */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Portais
                </div>
                {navigationRoutes.portals.map((route) => {
                  const IconComponent = route.icon
                  return (
                    <Link key={route.href} href={route.href} onClick={() => {setIsMobileMenuOpen(false); closeAllDropdowns()}}>
                      <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                        isActiveRoute(route.href)
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                        {route.label}
                        {route.badge && (
                          <Badge variant="outline" className="ml-auto text-xs">
                            {route.badge}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Serviços */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Serviços
                </div>
                {navigationRoutes.services.map((route) => {
                  const IconComponent = route.icon
                  return (
                    <Link key={route.href} href={route.href} onClick={() => {setIsMobileMenuOpen(false); closeAllDropdowns()}}>
                      <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                        isActiveRoute(route.href)
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                        {route.label}
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Acesso */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acesso
                </div>
                {navigationRoutes.auth.map((route) => {
                  const IconComponent = route.icon
                  return (
                    <Link key={route.href} href={route.href} onClick={() => {setIsMobileMenuOpen(false); closeAllDropdowns()}}>
                      <div className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                        isActiveRoute(route.href)
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                        {route.label}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default MainNavigation