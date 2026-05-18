import { supabase } from './client'

// Create a new AU
export async function createAu(auData) {
  const { data, error } = await supabase
    .from('au')
    .insert([
      {
        cp_id: auData.cp_id,
        name: auData.name,
        description: auData.description,
        world_setting: auData.worldSetting,
        era_background: auData.eraBackground,
        occupation_setting: auData.occupationSetting,
        atmosphere: auData.atmosphere,
        behavior_pattern: auData.behaviorPattern,
        writing_style: auData.writingStyle,
        worldview_memory: auData.worldviewMemory,
        atmosphere_memory: auData.atmosphereMemory,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating AU:', error)
    throw error
  }

  return data
}

// Get all AUs for a specific CP
export async function getAusByCpId(cpId) {
  const { data, error } = await supabase
    .from('au')
    .select('*')
    .eq('cp_id', cpId)
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
      world_setting: auData.worldSetting,
      era_background: auData.eraBackground,
      occupation_setting: auData.occupationSetting,
      atmosphere: auData.atmosphere,
      behavior_pattern: auData.behaviorPattern,
      writing_style: auData.writingStyle,
      worldview_memory: auData.worldviewMemory,
      atmosphere_memory: auData.atmosphereMemory,
    })
    .eq('id', id)
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

  if (error) {
    console.error('Error deleting AU:', error)
    throw error
  }

  return true
}
