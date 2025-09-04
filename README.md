# NAF - Núcleo de Apoio Contábil Fiscal

Sistema web completo para gestão do Núcleo de Apoio Contábil Fiscal, desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Prisma.

## 🎯 Objetivo

O NAF é um sistema que facilita o cadastro, agendamento e gestão de serviços de orientação fiscal e contábil gratuitos oferecidos para pessoas físicas hipossuficientes, pequenos proprietários rurais, Microempreendedores Individuais e organizações da sociedade civil.

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js
- **UI Components**: Radix UI
- **Gráficos**: Chart.js, React Chart.js 2, Recharts
- **Email**: Nodemailer
- **Deploy**: Preparado para Netlify

## 📋 Funcionalidades Principais

### Para Usuários (Público Geral)
- ✅ Página inicial informativa
- ✅ Cadastro de usuários (Aluno, Professor, Coordenador)
- ✅ Login e autenticação
- ✅ Catálogo de serviços NAF
- 🔄 Agendamento de atendimentos
- 🔄 Acompanhamento de solicitações

### Para Alunos
- 🔄 Dashboard personalizado
- 🔄 Registro de atendimentos prestados
- 🔄 Consulta de agendamentos
- 🔄 Upload de documentos

### Para Professores
- 🔄 Supervisão de atendimentos
- 🔄 Validação de serviços prestados
- 🔄 Relatórios de atividades
- 🔄 Gestão de alunos

### Para Coordenadores
- 🔄 Dashboard executivo com gráficos
- 🔄 Estatísticas de cadastros e atendimentos
- 🔄 Relatórios gerenciais
- 🔄 Gestão completa do sistema
- 🔄 Configurações do sistema

### Serviços NAF Contemplados
- 📋 Cadastro de CPF e CNPJ
- 🏡 Cadastro de imóveis rurais
- 💼 CAEPF (Cadastro de Atividade Econômica PF)
- 🏗️ CNO (Cadastro Nacional de Obras)
- 💰 Orientação sobre Imposto de Renda PF
- 🌾 DITR (Declaração do ITR)
- 📄 Declaração de Benefícios Fiscais
- 🏪 Orientações para MEI
- 💳 Emissão de guias de tributos
- 🌐 Comércio exterior e bagagens
- 🔍 Pesquisa de débitos fiscais
- 📜 Certidões negativas
- 💸 Parcelamento de débitos
- E muitos outros...

## 🗃️ Estrutura do Banco de Dados

O sistema utiliza PostgreSQL com as seguintes entidades principais:

- **Users**: Gerencia usuários (alunos, professores, coordenadores)
- **Services**: Catálogo de serviços NAF
- **Appointments**: Agendamentos de atendimentos
- **Assistances**: Registro de assistências prestadas
- **BestPractices**: Registro de boas práticas
- **Settings**: Configurações do sistema

## 🛠️ Configuração do Desenvolvimento

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd NAF_Contabil
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/naf_contabil"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

4. **Configure o banco de dados**
```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# (Opcional) Popular banco com dados de exemplo
npx prisma db seed
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard dos usuários
│   ├── login/            # Página de login
│   ├── register/         # Página de cadastro
│   ├── services/         # Catálogo de serviços
│   └── schedule/         # Agendamento
├── components/           # Componentes React
│   └── ui/              # Componentes de interface
├── lib/                 # Utilitários e configurações
│   ├── prisma.ts        # Cliente Prisma
│   └── utils.ts         # Funções utilitárias
└── styles/              # Estilos globais

prisma/
└── schema.prisma        # Schema do banco de dados
```

## 🔄 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa o linter
npm run type-check   # Verifica tipos TypeScript
```

## 🚀 Deploy

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Configure o comando de build: `npm run build`
4. Configure o diretório de output: `.next`

### Banco de Dados
Recomendamos usar um serviço de PostgreSQL gerenciado como:
- **Supabase** (gratuito com bom tier gratuito)
- **Railway** 
- **Vercel Postgres**
- **PlanetScale** (MySQL)

## 📊 Integração com Office 365 Forms

O sistema integra com formulários do Office 365 para:
- **Ficha de Serviço Prestado**: https://forms.office.com/r/cP587keka4
- **Registro de Boas Práticas**: https://forms.office.com/r/vxrTv2CfbW

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- Email: contato@naf.edu.br
- Issues: [GitHub Issues](link-to-issues)

## 🗓️ Roadmap

### Próximas Implementações
- [ ] Sistema de autenticação completo
- [ ] Dashboard com gráficos e estatísticas
- [ ] Sistema de agendamento
- [ ] Integração com APIs da Receita Federal
- [ ] Sistema de notificações por email
- [ ] Módulo de relatórios
- [ ] App mobile (React Native)
- [ ] API pública para integração

---

Desenvolvido com ❤️ para o Núcleo de Apoio Contábil Fiscal
