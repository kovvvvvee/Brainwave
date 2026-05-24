import { supabase } from './client'

// Create a new inspiration
export async function createInspiration(inspirationData) {
  console.log('inspirationService - createInspiration called with:', inspirationData)

  const { data, error } = await supabase
    .from('inspiration')
    .insert([
      {
        user_id: window.CURRENT_USER_ID,
        cp_id: inspirationData.cp_id,
        au_id: inspirationData.au_id || null,
        content: inspirationData.content,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating inspiration:', error)
    console.error('Error details:', error.message, error.details, error.hint)
    throw error
  }

  console.log('inspirationService - created inspiration:', data)
  return data
}


// Get a single inspiration by ID
export async function getInspirationById(id) {
  const { data, error } = await supabase
    .from('inspiration')
    .select('*')
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .single()

  if (error) {
    console.error('Error fetching inspiration:', error)
    throw error
  }

  return data
}

// Update an inspiration
export async function updateInspiration(id, inspirationData) {
  const { data, error } = await supabase
    .from('inspiration')
    .update({
      cp_id: inspirationData.cp_id,
      au_id: inspirationData.au_id || null,
      content: inspirationData.content,
      is_pinned: inspirationData.is_pinned,
      pinned_at: inspirationData.is_pinned ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .select()
    .single()

  if (error) {
    console.error('Error updating inspiration:', error)
    throw error
  }

  return data
}

// Toggle pin status
export async function togglePin(id) {
  const { data: current } = await supabase
    .from('inspiration')
    .select('is_pinned')
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .single()

  if (!current) {
    throw new Error('Inspiration not found')
  }

  const { data, error } = await supabase
    .from('inspiration')
    .update({ 
      is_pinned: !current.is_pinned,
      pinned_at: !current.is_pinned ? new Date().toISOString() : null
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling pin:', error)
    throw error
  }

  return data
}

// Get all recent inspirations for "continue writing" stream
export async function getRecentInspirations() {
  const { data, error } = await supabase
    .from('inspiration')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .order('is_pinned', { ascending: false })
    .order('pinned_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching recent inspirations:', error)
    throw error
  }

  return data
}

// Get inspirations for a specific CP with pin sorting
export async function getInspirationsByCpId(cpId) {
  const { data, error } = await supabase
    .from('inspiration')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .eq('cp_id', cpId)
    .order('is_pinned', { ascending: false })
    .order('pinned_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inspirations:', error)
    throw error
  }

  return data
}

// Get inspirations for a specific AU with pin sorting
export async function getInspirationsByAuId(auId) {
  const { data, error } = await supabase
    .from('inspiration')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .eq('au_id', auId)
    .order('is_pinned', { ascending: false })
    .order('pinned_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inspirations:', error)
    throw error
  }

  return data
}

// Get uncategorized inspirations for a specific CP with pin sorting
export async function getUncategorizedInspirationsByCpId(cpId) {
  const { data, error } = await supabase
    .from('inspiration')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .eq('cp_id', cpId)
    .is('au_id', null)
    .order('is_pinned', { ascending: false })
    .order('pinned_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching uncategorized inspirations:', error)
    throw error
  }

  return data
}

// Get all uncategorized inspirations (cp_id IS NULL AND au_id IS NULL)
export async function getAllUncategorizedInspirations() {
  const { data, error } = await supabase
    .from('inspiration')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .is('cp_id', null)
    .is('au_id', null)
    .order('is_pinned', { ascending: false })
    .order('pinned_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all uncategorized inspirations:', error)
    throw error
  }

  return data
}

// Get all inspirations (for the inspiration flow page)
export async function getAllInspirations() {
  const { data, error } = await supabase
    .from('inspiration')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .order('is_pinned', { ascending: false })
    .order('pinned_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all inspirations:', error)
    throw error
  }

  return data
}

// Delete an inspiration
export async function deleteInspiration(id) {
  const { error } = await supabase
    .from('inspiration')
    .delete()
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)

  if (error) {
    console.error('Error deleting inspiration:', error)
    throw error
  }

  return true
}

// ==================== Expansion History Functions ====================

// Create a new expansion version (insert, not upsert)
export async function createExpansion(expansionData) {
  console.log('inspirationService - createExpansion called with:', expansionData)

  const { data, error } = await supabase
    .from('expansion_history')
    .insert([
      {
        user_id: window.CURRENT_USER_ID,
        inspiration_id: expansionData.inspiration_id,
        content: expansionData.content,
        style: expansionData.style,
        length: expansionData.length,
        pov: expansionData.pov,
        version_name: expansionData.version_name || null,
        notes: expansionData.notes || null,
        is_favorite: expansionData.is_favorite || false,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating expansion:', error)
    throw error
  }

  console.log('inspirationService - created expansion:', data)
  return data
}

// Get all expansion versions for an inspiration
export async function getExpansionsByInspirationId(inspirationId) {
  const { data, error } = await supabase
    .from('expansion_history')
    .select('*')
    .eq('inspiration_id', inspirationId)
    .eq('user_id', window.CURRENT_USER_ID)
    .order('is_favorite', { ascending: false })
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
    .eq('user_id', window.CURRENT_USER_ID)
    .single()

  if (error) {
    console.error('Error fetching expansion:', error)
    throw error
  }

  return data
}

// Update an expansion (version_name, notes, is_favorite)
export async function updateExpansion(id, expansionData) {
  const { data, error } = await supabase
    .from('expansion_history')
    .update({
      version_name: expansionData.version_name,
      notes: expansionData.notes,
      is_favorite: expansionData.is_favorite,
    })
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .select()
    .single()

  if (error) {
    console.error('Error updating expansion:', error)
    throw error
  }

  return data
}

// Toggle favorite status of an expansion
export async function toggleExpansionFavorite(id) {
  const { data: current } = await supabase
    .from('expansion_history')
    .select('is_favorite')
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)
    .single()

  if (!current) {
    throw new Error('Expansion not found')
  }

  const { data, error } = await supabase
    .from('expansion_history')
    .update({ is_favorite: !current.is_favorite })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling expansion favorite:', error)
    throw error
  }

  return data
}

// Delete an expansion version
export async function deleteExpansion(id) {
  const { error } = await supabase
    .from('expansion_history')
    .delete()
    .eq('id', id)
    .eq('user_id', window.CURRENT_USER_ID)

  if (error) {
    console.error('Error deleting expansion:', error)
    throw error
  }

  return true
}

// Get favorite expansions for a user
export async function getFavoriteExpansions() {
  const { data, error } = await supabase
    .from('expansion_history')
    .select('*')
    .eq('user_id', window.CURRENT_USER_ID)
    .eq('is_favorite', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorite expansions:', error)
    throw error
  }

  return data
}
