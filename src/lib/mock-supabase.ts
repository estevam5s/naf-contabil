// Mock do Supabase para desenvolvimento local
interface MockData {
  chat_conversations: Map<string, any>
  chat_messages: Map<string, any[]>
  students: Map<string, any>
}

class MockSupabaseClient {
  private data: MockData = {
    chat_conversations: new Map(),
    chat_messages: new Map(),
    students: new Map()
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
    return new MockQuery(this.tableName, this.data, 'select', columns)
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

  single() {
    return this
  }

  async then() {
    try {
      if (this.tableName === 'chat_conversations') {
        return await this.handleChatConversations()
      } else if (this.tableName === 'chat_messages') {
        return await this.handleChatMessages()
      } else if (this.tableName === 'students') {
        return await this.handleStudents()
      }

      return { data: null, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  private async handleChatConversations() {
    if (this.operation === 'update') {
      // Simular update de conversa
      const idFilter = this.filters.find(f => f.column === 'id')
      if (idFilter) {
        const conversation = this.data.chat_conversations.get(idFilter.value)
        if (conversation) {
          const updated = { ...conversation, ...this.updateData }
          this.data.chat_conversations.set(idFilter.value, updated)
          return { data: updated, error: null }
        }
      }
      return { data: null, error: null }
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
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }

      this.data.chat_messages.get(conversationId)?.push(message)
      return { data: message, error: null }
    }

    return { data: null, error: null }
  }

  private async handleStudents() {
    return { data: null, error: null }
  }
}

export const mockSupabaseAdmin = new MockSupabaseClient()