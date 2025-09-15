// src/lib/dbHelpers.js
import { supabase } from "./supabase";

/**
 * ==============================
 * USER HELPERS
 * ==============================
 */

// Récupérer le profil d'un utilisateur par son id
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error; // ignore not found
  return data;
};

// Mettre à jour le profil utilisateur
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ ...updates, updated_at: new Date() })
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Logger une activité utilisateur
export const logActivity = async (userId, action, details = {}) => {
  try {
    const { data, error } = await supabase.from("activity_logs").insert([
      {
        user_id: userId,
        action,
        details,
        ip_address: "", // optionnel, tu peux récupérer depuis frontend si besoin
        user_agent: navigator.userAgent,
      },
    ]);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Erreur logActivity:", err);
  }
};

/**
 * ==============================
 * DOCUMENT HELPERS
 * ==============================
 */

// Récupérer tous les documents de l'utilisateur
export const getDocuments = async (userId) => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
};

// Ajouter un document
export const addDocument = async (doc) => {
  const { data, error } = await supabase.from("documents").insert([doc]).select();
  if (error) throw error;
  return data;
};

// Supprimer un document
export const deleteDocument = async (docId) => {
  const { data, error } = await supabase.from("documents").delete().eq("id", docId);
  if (error) throw error;
  return data;
};

/**
 * ==============================
 * CATEGORIES HELPERS
 * ==============================
 */

export const getCategories = async (userId) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data;
};

export const addCategory = async (category) => {
  const { data, error } = await supabase.from("categories").insert([category]).select();
  if (error) throw error;
  return data;
};

/**
 * ==============================
 * TAGS HELPERS
 * ==============================
 */

export const getTags = async (userId) => {
  const { data, error } = await supabase.from("tags").select("*").eq("user_id", userId);
  if (error) throw error;
  return data;
};

export const addTag = async (tag) => {
  const { data, error } = await supabase.from("tags").insert([tag]).select();
  if (error) throw error;
  return data;
};

/**
 * ==============================
 * DOCUMENT TAGS HELPERS
 * ==============================
 */

export const addDocumentTag = async (documentId, tagId) => {
  const { data, error } = await supabase
    .from("document_tags")
    .insert([{ document_id: documentId, tag_id: tagId }])
    .select();
  if (error) throw error;
  return data;
};

export const removeDocumentTag = async (documentId, tagId) => {
  const { data, error } = await supabase
    .from("document_tags")
    .delete()
    .match({ document_id: documentId, tag_id: tagId });
  if (error) throw error;
  return data;
};
