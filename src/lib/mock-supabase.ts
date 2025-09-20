// Mock do Supabase para desenvolvimento local
interface MockData {
  chat_conversations: Map<string, any>
  chat_messages: Map<string, any[]>
  students: Map<string, any>
  student_performance: Map<string, any>
  student_activity_logs: Map<string, any>
}

class MockSupabaseClient {
  private data: MockData = {
    chat_conversations: new Map(),
    chat_messages: new Map(),
    students: new Map(),
    student_performance: new Map(),
    student_activity_logs: new Map()
  }

  constructor() {
    // Inicializar com alguns dados de teste
    this.data.chat_conversations.set('test-conversation-1', {
      id: 'test-conversation-1',
      user_id: 'user-123',
      user_name: 'Maria Silva',
      user_email: 'maria@email.com',
      status: 'active',
      human_requested: true,
      human_request_timestamp: new Date().toISOString(),
      chat_accepted_by: null,
      chat_accepted_at: null,
      coordinator_id: null,
      created_at: new Date().toISOString()
    })

    this.data.chat_messages.set('test-conversation-1', [
      {
        id: '1',
        conversation_id: 'test-conversation-1',
        content: 'Olá, preciso de ajuda com declaração de IR',
        sender_type: 'user',
        sender_id: 'user-123',
        sender_name: 'Maria Silva',
        is_ai_response: false,
        is_read: true,
        created_at: new Date().toISOString()
      }
    ])
  }

  from(table: string) {
    return new MockTable(table, this.data)
  }
}

class MockTable {
  constructor(private tableName: string, private data: MockData) {}

  select(columns?: string) {
    const query = new MockQuery(this.tableName, this.data, 'select', columns)
    return query
  }

  insert(data: any) {
    return new MockQuery(this.tableName, this.data, 'insert', undefined, data)
  }

  update(data: any) {
    return new MockQuery(this.tableName, this.data, 'update', undefined, data)
  }

  delete() {
    return new MockQuery(this.tableName, this.data, 'delete')
  }
}

class MockQuery {
  private filters: any[] = []
  private updateData: any = null
  private insertData: any = null
  private isSingle: boolean = false
  private orderBy: { column: string, ascending: boolean } | null = null
  private limitValue: number | null = null

  constructor(
    private tableName: string,
    private data: MockData,
    private operation: string,
    private columns?: string,
    private operationData?: any
  ) {
    if (operation === 'insert') {
      this.insertData = operationData
    } else if (operation === 'update') {
      this.updateData = operationData
    }
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value })
    return this
  }

  is(column: string, value: any) {
    this.filters.push({ type: 'is', column, value })
    return this
  }

  select(columns?: string) {
    this.columns = columns
    return this
  }

  single() {
    this.isSingle = true
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy = {
      column,
      ascending: options?.ascending !== false
    }
    return this
  }

  limit(count: number) {
    this.limitValue = count
    return this
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected)
  }

  private async execute() {
    try {
      if (this.tableName === 'chat_conversations') {
        return await this.handleChatConversations()
      } else if (this.tableName === 'chat_messages') {
        return await this.handleChatMessages()
      } else if (this.tableName === 'students') {
        return await this.handleStudents()
      } else if (this.tableName === 'student_performance') {
        return await this.handleStudentPerformance()
      } else if (this.tableName === 'student_activity_logs') {
        return await this.handleStudentActivityLogs()
      }

      return { data: null, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  private async handleChatConversations() {
    if (this.operation === 'insert') {
      // Criar nova conversa
      const conversationId = `conversation-${Date.now()}`
      const conversation = {
        ...this.insertData,
        id: conversationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active'
      }

      this.data.chat_conversations.set(conversationId, conversation)
      this.data.chat_messages.set(conversationId, [])
      return { data: conversation, error: null }
    }

    if (this.operation === 'update') {
      // Simular update de conversa
      const idFilter = this.filters.find(f => f.column === 'id')
      if (idFilter) {
        const conversation = this.data.chat_conversations.get(idFilter.value)
        if (conversation) {
          const updated = {
            ...conversation,
            ...this.updateData,
            updated_at: new Date().toISOString()
          }
          this.data.chat_conversations.set(idFilter.value, updated)
          return { data: updated, error: null }
        }
      }
      return { data: null, error: null }
    }

    if (this.operation === 'select') {
      // Buscar conversas
      const userIdFilter = this.filters.find(f => f.column === 'user_id')
      const coordinatorIdFilter = this.filters.find(f => f.column === 'coordinator_id')
      const statusFilter = this.filters.find(f => f.column === 'status')
      const humanRequestedFilter = this.filters.find(f => f.column === 'human_requested')

      let conversations = Array.from(this.data.chat_conversations.values())

      // Aplicar filtros
      if (userIdFilter) {
        conversations = conversations.filter(c => c.user_id === userIdFilter.value)
      }
      if (coordinatorIdFilter) {
        conversations = conversations.filter(c => c.coordinator_id === coordinatorIdFilter.value)
      }
      if (statusFilter) {
        conversations = conversations.filter(c => c.status === statusFilter.value)
      }
      if (humanRequestedFilter) {
        conversations = conversations.filter(c => c.human_requested === humanRequestedFilter.value)
      }

      // Se tem select específico com mensagens, incluir mensagens
      if (this.columns && this.columns.includes('messages')) {
        conversations = conversations.map(conv => ({
          ...conv,
          messages: this.data.chat_messages.get(conv.id) || []
        }))
      }

      // Aplicar ordenação
      if (this.orderBy) {
        conversations.sort((a, b) => {
          const aVal = a[this.orderBy!.column]
          const bVal = b[this.orderBy!.column]

          if (aVal < bVal) return this.orderBy!.ascending ? -1 : 1
          if (aVal > bVal) return this.orderBy!.ascending ? 1 : -1
          return 0
        })
      }

      // Aplicar limite
      if (this.limitValue) {
        conversations = conversations.slice(0, this.limitValue)
      }

      return { data: this.isSingle ? conversations[0] || null : conversations, error: null }
    }

    return { data: null, error: null }
  }

  private async handleChatMessages() {
    if (this.operation === 'insert') {
      // Simular insert de mensagem
      const conversationId = this.insertData.conversation_id
      if (!this.data.chat_messages.has(conversationId)) {
        this.data.chat_messages.set(conversationId, [])
      }

      const message = {
        ...this.insertData,
        id: `message-${Date.now()}`,
        created_at: new Date().toISOString()
      }

      this.data.chat_messages.get(conversationId)?.push(message)

      // Atualizar timestamp da conversa
      const conversation = this.data.chat_conversations.get(conversationId)
      if (conversation) {
        conversation.updated_at = new Date().toISOString()
      }

      return { data: message, error: null }
    }

    if (this.operation === 'select') {
      // Buscar mensagens
      const conversationIdFilter = this.filters.find(f => f.column === 'conversation_id')

      if (conversationIdFilter) {
        const messages = this.data.chat_messages.get(conversationIdFilter.value) || []
        return { data: messages, error: null }
      }

      // Buscar todas as mensagens se não tem filtro específico
      const allMessages: any[] = []
      const messagesCollections = Array.from(this.data.chat_messages.values())
      for (const messages of messagesCollections) {
        allMessages.push(...messages)
      }
      return { data: allMessages, error: null }
    }

    if (this.operation === 'update') {
      // Atualizar mensagem (ex: marcar como lida)
      const idFilter = this.filters.find(f => f.column === 'id')
      if (idFilter) {
        const messagesCollections = Array.from(this.data.chat_messages.values())
        for (const messages of messagesCollections) {
          const messageIndex = messages.findIndex((m: any) => m.id === idFilter.value)
          if (messageIndex !== -1) {
            messages[messageIndex] = { ...messages[messageIndex], ...this.updateData }
            return { data: messages[messageIndex], error: null }
          }
        }
      }
      return { data: null, error: null }
    }

    return { data: null, error: null }
  }

  private async handleStudents() {
    if (this.operation === 'insert') {
      // Simular insert de estudante
      const studentId = `student-${Date.now()}`
      const student = {
        ...this.insertData,
        id: studentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Verificar se email já existe
      const studentsArray = Array.from(this.data.students.values())
      if (studentsArray.find(s => s.email === student.email)) {
        return { data: null, error: { message: 'Email já cadastrado' } }
      }

      // Verificar se CPF já existe (se fornecido)
      if (student.document) {
        const cleanDocument = student.document.replace(/\D/g, '')
        if (studentsArray.find(s => s.document === cleanDocument)) {
          return { data: null, error: { message: 'CPF já cadastrado' } }
        }
      }

      // Verificar se matrícula já existe (se fornecida)
      if (student.registration_number) {
        if (studentsArray.find(s => s.registration_number === student.registration_number)) {
          return { data: null, error: { message: 'Número de matrícula já cadastrado' } }
        }
      }

      this.data.students.set(studentId, student)
      return { data: student, error: null }
    }

    if (this.operation === 'select') {
      // Buscar estudante existente
      const emailFilter = this.filters.find(f => f.column === 'email')
      const documentFilter = this.filters.find(f => f.column === 'document')
      const registrationFilter = this.filters.find(f => f.column === 'registration_number')

      if (emailFilter) {
        const studentsArray = Array.from(this.data.students.values())
        const student = studentsArray.find(s => s.email === emailFilter.value)
        if (student) {
          return { data: student, error: null }
        }
      }

      if (documentFilter) {
        const studentsArray = Array.from(this.data.students.values())
        const student = studentsArray.find(s => s.document === documentFilter.value)
        if (student) {
          return { data: student, error: null }
        }
      }

      if (registrationFilter) {
        const studentsArray = Array.from(this.data.students.values())
        const student = studentsArray.find(s => s.registration_number === registrationFilter.value)
        if (student) {
          return { data: student, error: null }
        }
      }

      return { data: null, error: null }
    }

    return { data: null, error: null }
  }

  private async handleStudentPerformance() {
    if (this.operation === 'insert') {
      // Simular insert de performance do estudante
      const performanceId = `performance-${Date.now()}`
      const performance = {
        ...this.insertData,
        id: performanceId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      this.data.student_performance.set(performanceId, performance)
      return { data: performance, error: null }
    }

    return { data: null, error: null }
  }

  private async handleStudentActivityLogs() {
    if (this.operation === 'insert') {
      // Simular insert de log de atividade
      const logId = `log-${Date.now()}`
      const log = {
        ...this.insertData,
        id: logId,
        created_at: new Date().toISOString()
      }

      this.data.student_activity_logs.set(logId, log)
      return { data: log, error: null }
    }

    return { data: null, error: null }
  }
}

export const mockSupabaseAdmin = new MockSupabaseClient()