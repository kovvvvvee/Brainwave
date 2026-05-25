import { supabase } from './client'

// Create a new AU
export async function createAu(auData) {
  const payload = {
    user_id: window.CURRENT_USER_ID,
    cp_id: auData.cp_id,
    name: auData.name,
    description: auData.description || null,
    // Core AU fields
    core_atmosphere: auData.core_atmosphere || null,
    // World rules (as individual TEXT fields)
    social_rules: auData.social_rules || null,
    life_rules: auData.life_rules || null,
    body_rules: auData.body_rules || null,
    // Relationship and desire mechanisms
    desire_mechanism: auData.desire_mechanism || null,
    relationship_pressure: auData.relationship_pressure || null,
    emotional_consequences: auData.emotional_consequences || null,
    physical_consequences: auData.physical_consequences || null,
    // AI expansion enhancement
    au_amplification: auData.au_amplification || null,
    interaction_logic: auData.interaction_logic || null,
    intimacy_logic: auData.intimacy_logic || null,
    emotional_logic: auData.emotional_logic || null,
    // Advanced settings
    power_system: auData.power_system || null,
    taboo_rules: auData.taboo_rules || null,
    instability_factors: auData.instability_factors || null,
    // Relationship state fields
    relationship_surface_layer: auData.relationship_surface_layer || null,
    relationship_actual_state: auData.relationship_actual_state || null,
    relationship_conflict: auData.relationship_conflict || null,
    relationship_triggers: auData.relationship_triggers || null,
    ooc_rules: auData.ooc_rules || null,
    // Legacy fields
    world_notes: auData.world_notes || null,
    relationship_state: auData.relationship_state || null,
  }

  console.log('AU PAYLOAD:', payload)
  console.log('AU CREATE PAYLOAD KEYS:', Object.keys(payload))

  const { data, error } = await supabase
    .from('au')
    .insert([payload])
    .select()
    .single()

  if (error) {
    console.error('AU CREATE ERROR:', error)
    console.error('AU ERROR DETAILS:', JSON.stringify(error, null, 2))
    throw error
  }

  console.log('AU CREATE RESPONSE:', data)
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
  const payload = {
    name: auData.name,
    description: auData.description || null,
    // Core AU fields
    core_atmosphere: auData.core_atmosphere || null,
    // World rules (as individual TEXT fields)
    social_rules: auData.social_rules || null,
    life_rules: auData.life_rules || null,
    body_rules: auData.body_rules || null,
    // Relationship and desire mechanisms
    desire_mechanism: auData.desire_mechanism || null,
    relationship_pressure: auData.relationship_pressure || null,
    emotional_consequences: auData.emotional_consequences || null,
    physical_consequences: auData.physical_consequences || null,
    // AI expansion enhancement
    au_amplification: auData.au_amplification || null,
    interaction_logic: auData.interaction_logic || null,
    intimacy_logic: auData.intimacy_logic || null,
    emotional_logic: auData.emotional_logic || null,
    // Advanced settings
    power_system: auData.power_system || null,
    taboo_rules: auData.taboo_rules || null,
    instability_factors: auData.instability_factors || null,
    // Relationship state fields
    relationship_surface_layer: auData.relationship_surface_layer || null,
    relationship_actual_state: auData.relationship_actual_state || null,
    relationship_conflict: auData.relationship_conflict || null,
    relationship_triggers: auData.relationship_triggers || null,
    ooc_rules: auData.ooc_rules || null,
    // Legacy fields
    world_notes: auData.world_notes || null,
    relationship_state: auData.relationship_state || null,
    // Metadata
    is_pinned: auData.is_pinned,
    pinned_at: auData.is_pinned ? new Date().toISOString() : null,
  }

  console.log('AU PAYLOAD:', payload)
  console.log('AU UPDATE PAYLOAD KEYS:', Object.keys(payload))

  const { data, error } = await supabase
    .from('au')
    .update(payload)
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .select()
    .single()

  if (error) {
    console.error('AU UPDATE ERROR:', error)
    console.error('AU UPDATE ERROR DETAILS:', JSON.stringify(error, null, 2))
    throw error
  }

  console.log('AU UPDATE RESPONSE:', data)
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
