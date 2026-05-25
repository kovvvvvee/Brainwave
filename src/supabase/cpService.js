import { supabase } from './client'

// Create a new CP
export async function createCp(cpData) {
  const payload = {
    user_id: window.CURRENT_USER_ID,
    name: cpData.name,
    // New AI-friendly structure
    core_dynamic: cpData.core_dynamic || null,
    relationship_dynamic: cpData.relationship_dynamic || null,
    character_profiles: cpData.character_profiles || null,
    sexual_dynamic: cpData.sexual_dynamic || null,
    relationship_atmosphere: cpData.relationship_atmosphere || null,
    interaction_details: cpData.interaction_details || null,
    source_material: cpData.source_material || null,
    ooc_rules: cpData.ooc_rules || null,
    power_flow: cpData.power_flow || null,
    relationship_boundaries: cpData.relationship_boundaries || null,
    // Legacy fields for backward compatibility
    description: cpData.description || null,
    characters: cpData.characters || null,
    creative_notes: cpData.creative_notes || null,
  }

  console.log('CP insert payload:', payload)

  const { data, error } = await supabase
    .from('cp')
    .insert([payload])
    .select()
    .single()

  if (error) {
    console.error('Create CP full error:', error)
    console.error('Create CP details:', JSON.stringify(error, null, 2))
    throw error
  }

  return data
}

// Get all CPs
export async function getCps() {
  const { data, error } = await supabase
    .from('cp')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .order('is_pinned', { ascending: false })
    .order('pinned_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching CPs:', error)
    throw error
  }

  return data
}

// Get a single CP by ID
export async function getCpById(id) {
  const { data, error } = await supabase
    .from('cp')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching CP:', error)
    throw error
  }

  return data
}

// Update a CP
export async function updateCp(id, cpData) {
  console.log('updateCp - SAVE PAYLOAD:', cpData)

  const { data, error } = await supabase
    .from('cp')
    .update({
      name: cpData.name,
      // New AI-friendly structure - matching database field names
      core_dynamic: cpData.core_dynamic || null,
      relationship_dynamic: cpData.relationship_dynamic || null,
      character_profiles: cpData.character_profiles || null,
      sexual_dynamic: cpData.sexual_dynamic || null,
      relationship_atmosphere: cpData.relationship_atmosphere || null,
      interaction_details: cpData.interaction_details || null,
      source_material: cpData.source_material || null,
      ooc_rules: cpData.ooc_rules || null,
      power_flow: cpData.power_flow || null,
      relationship_boundaries: cpData.relationship_boundaries || null,
      // Legacy fields for backward compatibility
      description: cpData.description || null,
      characters: cpData.characters || null,
      creative_notes: cpData.creative_notes || null,
      is_pinned: cpData.is_pinned,
      pinned_at: cpData.is_pinned ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .select()
    .single()

  console.log('updateCp - Supabase return data:', data)
  console.log('updateCp - Supabase return error:', error)

  if (error) {
    console.error('Error updating CP:', error)
    throw error
  }

  return data
}

// Delete a CP
export async function deleteCp(id) {
  const { error } = await supabase
    .from('cp')
    .delete()
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)

  if (error) {
    console.error('Error deleting CP:', error)
    throw error
  }

  return true
}

// Toggle pin status for CP
export async function toggleCpPin(id) {
  const { data: current } = await supabase
    .from('cp')
    .select('is_pinned')
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .single()

  if (!current) {
    throw new Error('CP not found')
  }

  const { data, error } = await supabase
    .from('cp')
    .update({
      is_pinned: !current.is_pinned,
      pinned_at: !current.is_pinned ? new Date().toISOString() : null
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling CP pin:', error)
    throw error
  }

  return data
}
