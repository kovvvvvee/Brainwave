import { supabase } from './client'

// Create a new tag
export async function createTag(tagData) {
  const { data, error } = await supabase
    .from('tags')
    .insert([
      {
        name: tagData.name,
        category: tagData.category,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating tag:', error)
    throw error
  }

  return data
}

// Get all tags
export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tags:', error)
    throw error
  }

  return data
}

// Get tags by category
export async function getTagsByCategory(category) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tags by category:', error)
    throw error
  }

  return data
}

// Get a single tag by ID
export async function getTagById(id) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching tag:', error)
    throw error
  }

  return data
}

// Update a tag
export async function updateTag(id, tagData) {
  const { data, error } = await supabase
    .from('tags')
    .update({
      name: tagData.name,
      category: tagData.category,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating tag:', error)
    throw error
  }

  return data
}

// Delete a tag
export async function deleteTag(id) {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting tag:', error)
    throw error
  }

  return true
}

// Add tag to inspiration
export async function addTagToInspiration(inspirationId, tagId) {
  const { data, error } = await supabase
    .from('inspiration_tags')
    .insert([
      {
        inspiration_id: inspirationId,
        tag_id: tagId,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error adding tag to inspiration:', error)
    throw error
  }

  return data
}

// Remove tag from inspiration
export async function removeTagFromInspiration(inspirationId, tagId) {
  const { error } = await supabase
    .from('inspiration_tags')
    .delete()
    .eq('inspiration_id', inspirationId)
    .eq('tag_id', tagId)

  if (error) {
    console.error('Error removing tag from inspiration:', error)
    throw error
  }

  return true
}

// Get tags for an inspiration
export async function getTagsForInspiration(inspirationId) {
  const { data, error } = await supabase
    .from('inspiration_tags')
    .select('tags(*)')
    .eq('inspiration_id', inspirationId)

  if (error) {
    console.error('Error fetching tags for inspiration:', error)
    throw error
  }

  return data.map(item => item.tags)
}

// Get inspirations by tag
export async function getInspirationsByTag(tagId) {
  const { data, error } = await supabase
    .from('inspiration_tags')
    .select('inspiration(*)')
    .eq('tag_id', tagId)

  if (error) {
    console.error('Error fetching inspirations by tag:', error)
    throw error
  }

  return data.map(item => item.inspiration)
}
