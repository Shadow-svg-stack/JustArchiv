import { supabase } from "./supabase"

// ==============================
// USER PROFILES
// ==============================
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single()
    if (error && error.code !== "PGRST116") throw error
    return data
  } catch (err) {
    console.error("dbHelpers.getUserProfile error:", err)
    return null
  }
}

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()
    if (error) throw error
    return data
  } catch (err) {
    console.error("dbHelpers.updateUserProfile error:", err)
    return null
  }
}

// ==============================
// ACTIVITY LOGS
// ==============================
export const logActivity = async (userId, action, details = {}) => {
  try {
    const { error } = await supabase.from("activity_logs").insert([
      {
        user_id: userId,
        action,
        details: Object.keys(details).length ? details : null,
        ip_address: null, // à remplir si tu récupères l'IP côté serveur
        user_agent: navigator.userAgent
      }
    ])
    if (error) throw error
  } catch (err) {
    console.error("dbHelpers.logActivity error:", err)
  }
}

// ==============================
// CATEGORIES
// ==============================
export const getCategories = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
    if (error) throw error
    return data
  } catch (err) {
    console.error("dbHelpers.getCategories error:", err)
    return []
  }
}

// ==============================
// TAGS
// ==============================
export const getTags = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("user_id", userId)
    if (error) throw error
    return data
  } catch (err) {
    console.error("dbHelpers.getTags error:", err)
    return []
  }
}

// ==============================
// DOCUMENTS
// ==============================
export const getDocuments = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
    if (error) throw error
    return data
  } catch (err) {
    console.error("dbHelpers.getDocuments error:", err)
    return []
  }
}

// ==============================
// DOCUMENT TAGS
// ==============================
export const getDocumentTags = async (documentId) => {
  try {
    const { data, error } = await supabase
      .from("document_tags")
      .select("*")
      .eq("document_id", documentId)
    if (error) throw error
    return data
  } catch (err) {
    console.error("dbHelpers.getDocumentTags error:", err)
    return []
  }
}
