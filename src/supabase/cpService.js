import { supabase } from './client'

// Create a new CP
export async function createCp(cpData) {
  const { data, error } = await supabase
    .from('cp')
    .insert([
      {
        user_id: window.CURRENT_USER_ID,
        name: cpData.name,
        description: cpData.description,
        characters: cpData.characters,
        keywords: cpData.keywords,
        emotional_tone: cpData.emotionalTone,
        relationship_core: cpData.relationshipCore,
        interaction_style: cpData.interactionStyle,
        ooc_rules: cpData.oocRules,
        writing_style: cpData.writingStyle,
        relationship_memory: cpData.relationshipMemory,
        speech_style_memory: cpData.speechStyleMemory,
        writing_style_memory: cpData.writingStyleMemory,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating CP:', error)
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
  const { data, error } = await supabase
    .from('cp')
    .update({
      name: cpData.name,
      description: cpData.description,
      characters: cpData.characters,
      keywords: cpData.keywords,
      emotional_tone: cpData.emotionalTone,
      relationship_core: cpData.relationshipCore,
      interaction_style: cpData.interactionStyle,
      ooc_rules: cpData.oocRules,
      writing_style: cpData.writingStyle,
      relationship_memory: cpData.relationshipMemory,
      speech_style_memory: cpData.speechStyleMemory,
      writing_style_memory: cpData.writingStyleMemory,
    })
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .select()
    .single()

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

  if (error) {
    console.error('Error deleting CP:', error)
    throw error
  }

  return true
}
