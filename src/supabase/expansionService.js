import { supabase } from './client'

// Create a new expansion record
export async function createExpansion(expansionData) {
  const { data, error } = await supabase
    .from('expansion_history')
    .insert([
      {
        inspiration_id: expansionData.inspirationId,
        content: expansionData.content,
        style: expansionData.style,
        length: expansionData.length,
        pov: expansionData.pov,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating expansion:', error)
    throw error
  }

  return data
}

// Get all expansions for a specific inspiration
export async function getExpansionsByInspirationId(inspirationId) {
  const { data, error } = await supabase
    .from('expansion_history')
    .select('*')
    .eq('inspiration_id', inspirationId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching expansions:', error)
    throw error
  }

  return data
}

// Get a single expansion by ID
export async function getExpansionById(id) {
  const { data, error } = await supabase
    .from('expansion_history')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching expansion:', error)
    throw error
  }

  return data
}

// Delete an expansion
export async function deleteExpansion(id) {
  const { error } = await supabase
    .from('expansion_history')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting expansion:', error)
    throw error
  }

  return true
}

// Update an expansion's content
export async function updateExpansion(id, content) {
  const { data, error } = await supabase
    .from('expansion_history')
    .update({ content })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating expansion:', error)
    throw error
  }

  return data
}
