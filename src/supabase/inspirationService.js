import { supabase } from './client'

// Create a new inspiration
export async function createInspiration(inspirationData) {
  console.log('inspirationService - createInspiration called with:', inspirationData)

  const { data, error } = await supabase
    .from('inspiration')
    .insert([
      {
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
      is_favorite: inspirationData.is_favorite,
      is_pinned: inspirationData.is_pinned,
      pinned_at: inspirationData.is_pinned ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating inspiration:', error)
    throw error
  }

  return data
}

// Toggle favorite status
export async function toggleFavorite(id) {
  const { data: current } = await supabase
    .from('inspiration')
    .select('is_favorite')
    .eq('id', id)
    .single()

  if (!current) {
    throw new Error('Inspiration not found')
  }

  const { data, error } = await supabase
    .from('inspiration')
    .update({ is_favorite: !current.is_favorite })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error toggling favorite:', error)
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

// Get all favorite inspirations
export async function getFavoriteInspirations() {
  const { data, error } = await supabase
    .from('inspiration')
    .select('*')
    .eq('is_favorite', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorite inspirations:', error)
    throw error
  }

  return data
}

// Get inspirations for a specific CP with pin sorting
export async function getInspirationsByCpId(cpId) {
  const { data, error } = await supabase
    .from('inspiration')
    .select('*')
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

// Delete an inspiration
export async function deleteInspiration(id) {
  const { error } = await supabase
    .from('inspiration')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting inspiration:', error)
    throw error
  }

  return true
}
