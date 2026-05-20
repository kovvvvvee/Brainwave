import { supabase } from './client'

// Create a new AU
export async function createAu(auData) {
  const payload = {
    user_id: window.CURRENT_USER_ID,
    cp_id: auData.cp_id,
    name: auData.name,
    description: auData.description,
    world_notes: auData.worldNotes,
    relationship_state: auData.relationshipState,
  }

  console.log('AU PAYLOAD:', payload)

  const { data, error } = await supabase
    .from('au')
    .insert([payload])
    .select()
    .single()

  if (error) {
    console.error('FULL AU ERROR:', error)
    console.error('AU ERROR DETAILS:', JSON.stringify(error, null, 2))
    throw error
  }

  return data
}

// Get all AUs for a specific CP
export async function getAusByCpId(cpId) {
  const { data, error } = await supabase
    .from('au')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .eq('cp_id', cpId)
    .order('is_pinned', { ascending: false })
    .order('pinned_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching AUs:', error)
    throw error
  }

  return data
}

// Get a single AU by ID
export async function getAuById(id) {
  const { data, error } = await supabase
    .from('au')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching AU:', error)
    throw error
  }

  return data
}

// Update an AU
export async function updateAu(id, auData) {
  const { data, error } = await supabase
    .from('au')
    .update({
      name: auData.name,
      description: auData.description,
      world_notes: auData.worldNotes,
      relationship_state: auData.relationshipState,
      is_pinned: auData.is_pinned,
      pinned_at: auData.is_pinned ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .select()
    .single()

  if (error) {
    console.error('Error updating AU:', error)
    throw error
  }

  return data
}

// Delete an AU
export async function deleteAu(id) {
  const { error } = await supabase
    .from('au')
    .delete()
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)

  if (error) {
    console.error('Error deleting AU:', error)
    throw error
  }

  return true
}

// Toggle pin status for AU
export async function toggleAuPin(id) {
  const { data: current } = await supabase
    .from('au')
    .select('is_pinned')
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .single()

  if (!current) {
    throw new Error('AU not found')
  }

  const { data, error } = await supabase
    .from('au')
    .update({
      is_pinned: !current.is_pinned,
      pinned_at: !current.is_pinned ? new Date().toISOString() : null
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling AU pin:', error)
    throw error
  }

  return data
}
