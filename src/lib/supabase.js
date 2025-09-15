import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export const dbHelpers = {
  // ================= USERS =================
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ================= DOCUMENTS =================
  async getUserDocuments(userId, { search, category, tags, sortBy, limit, offset } = {}) {
    let query = supabase
      .from('documents')
      .select(`
        *,
        categories(name, color),
        document_tags(tags(name, color))
      `)
      .eq('user_id', userId)

    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    if (category) query = query.eq('category_id', category)
    if (tags && tags.length > 0) query = query.in('document_tags.tag_id', tags)
    if (sortBy) {
      const [field, direction] = sortBy.split(':')
      query = query.order(field, { ascending: direction === 'asc' })
    } else {
      query = query.order('created_at', { ascending: false })
    }
    if (limit) query = query.limit(limit)
    if (offset) query = query.range(offset, offset + (limit || 10) - 1)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createDocument(documentData) {
    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateDocument(documentId, updates) {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteDocument(documentId) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
    if (error) throw error
  },

  // ================= CATEGORIES =================
  async getUserCategories(userId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name')
    if (error) throw error
    return data
  },

  async createCategory(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ================= TAGS =================
  async getUserTags(userId) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name')
    if (error) throw error
    return data
  },

  async createTag(tagData) {
    const { data, error } = await supabase
      .from('tags')
      .insert(tagData)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ================= ACTIVITY LOG =================
  async logActivity(userId, action, details = {}) {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        details,
        ip_address: await dbHelpers.getClientIP(),
        user_agent: navigator.userAgent
      })
    if (error) console.error('Failed to log activity:', error)
  },

  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return 'unknown'
    }
  },

  // ================= ADMIN =================
  async getAllUsers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getSystemStats() {
    const [usersResult, documentsResult, storageResult] = await Promise.all([
      supabase.from('user_profiles').select('id', { count: 'exact' }),
      supabase.from('documents').select('id, file_size', { count: 'exact' }),
      supabase.from('documents').select('file_size')
    ])

    const totalUsers = usersResult.count || 0
    const totalDocuments = documentsResult.count || 0
    const totalStorage = storageResult.data?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0

    return {
      totalUsers,
      totalDocuments,
      totalStorage,
      storageFormatted: dbHelpers.formatFileSize(totalStorage)
    }
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}
