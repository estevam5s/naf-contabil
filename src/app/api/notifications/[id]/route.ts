import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// PATCH - Atualizar status da notificação
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status, action } = await request.json()

    if (!id) {
      return NextResponse.json({
        error: 'ID da notificação é obrigatório'
      }, { status: 400 })
    }

    let updateData: any = {}

    if (action === 'mark_read') {
      updateData = {
        status: 'read',
        read_at: new Date().toISOString()
      }
    } else if (action === 'mark_unread') {
      updateData = {
        status: 'unread',
        read_at: null
      }
    } else if (action === 'archive') {
      updateData = {
        status: 'archived',
        archived_at: new Date().toISOString()
      }
    } else if (action === 'dismiss') {
      updateData = {
        status: 'dismissed'
      }
    } else if (status) {
      updateData.status = status
      if (status === 'read' && !updateData.read_at) {
        updateData.read_at = new Date().toISOString()
      }
    } else {
      return NextResponse.json({
        error: 'Status ou action são obrigatórios'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating notification:', error)
      return NextResponse.json({
        error: 'Erro ao atualizar notificação'
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Notificação atualizada com sucesso',
      notification: data
    })

  } catch (error) {
    console.error('Error in notification PATCH:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// DELETE - Deletar notificação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({
        error: 'ID da notificação é obrigatório'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting notification:', error)
      return NextResponse.json({
        error: 'Erro ao deletar notificação'
      }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Notificação deletada com sucesso'
    })

  } catch (error) {
    console.error('Error in notification DELETE:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

// GET - Buscar notificação específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({
        error: 'ID da notificação é obrigatório'
      }, { status: 400 })
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching notification:', error)
      return NextResponse.json({
        error: 'Notificação não encontrada'
      }, { status: 404 })
    }

    return NextResponse.json({
      notification
    })

  } catch (error) {
    console.error('Error in notification GET:', error)
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}