import { supabase } from './client'

// Upsert expansion using inspiration_id as conflict target
export const upsertExpansion = async (payload) => {
  console.log('=== upsertExpansion START ===')

  const cleanPayload = {
    user_id: payload.user_id,
    inspiration_id: payload.inspiration_id,
    content: payload.content,
    style: payload.style,
    length: payload.length,
    pov: payload.pov,
    created_at: new Date().toISOString()
  }

  console.log('UPSERT PAYLOAD:', cleanPayload)

  const { data, error } = await supabase
    .from('expansion_history')
    .upsert(cleanPayload, {
      onConflict: 'inspiration_id'
    })
    .select()
    .maybeSingle()

  console.log('Supabase upsert result - data:', data)
  console.log('Supabase upsert result - error:', error)

  if (error) {
    console.error('Error upserting expansion:', error)
    throw error
  }

  console.log('=== upsertExpansion END ===')

  return data
}

// Get all expansions for a specific inspiration
export async function getExpansionsByInspirationId(inspirationId) {
  const { data, error } = await supabase
    .from('expansion_history')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .eq('inspiration_id', inspirationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching expansions:', error)
    throw error
  }

  return data
}

// Delete an expansion by inspiration_id
export async function deleteExpansion(inspirationId) {
  const { error } = await supabase
    .from('expansion_history')
    .delete()
    .eq('inspiration_id', inspirationId)
    .eq('user_id', window.CURRENT_USER_ID)

  if (error) {
    console.error('Error deleting expansion:', error)
    throw error
  }

  return true
}
