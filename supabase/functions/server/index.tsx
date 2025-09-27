import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Supabase client for server operations
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Health check endpoint
app.get("/make-server-450d4529/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize headmaster account (production initialization)
app.post("/make-server-450d4529/init-headmaster", async (c) => {
  try {
    const headmasterEmail = "carsonneil49@gmail.com";
    const headmasterPassword = "1976452006Neil@";

    // Check if headmaster already exists
    const existingProfiles = (await kv.getByPrefix("user_profile_")) || [];
    const headmasterExists = existingProfiles.some(
      (profile) =>
        profile.email === headmasterEmail && profile.role === "headmaster",
    );

    if (!headmasterExists) {
      try {
        const { data, error } = await supabase.auth.admin.createUser({
          email: headmasterEmail,
          password: headmasterPassword,
          user_metadata: { name: "Neil Carson - Headmaster" },
          email_confirm: true,
        });

        if (data?.user && !error) {
          const profile = {
            id: data.user.id,
            email: headmasterEmail,
            name: "Neil Carson - Headmaster",
            role: "headmaster",
            avatar_url: null,
            isActive: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            departement: "Administration",
          };

          await kv.set(`user_profile_${data.user.id}`, profile);
          console.log("Headmaster account initialized successfully");
        }
      } catch (error) {
        console.log("Headmaster account might already exist in auth:", error);
      }
    } else {
      console.log("Headmaster account already exists");
    }

    return c.json({ success: true, message: "Headmaster account initialized" });
  } catch (error) {
    console.error("Init headmaster error:", error);
    return c.json({ error: "Failed to initialize headmaster account" }, 500);
  }
});

// Auth endpoints
app.post("/make-server-450d4529/auth/signup", async (c) => {
  try {
    const { email, password, name, role = "reader" } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile
    const profile = {
      id: data.user.id,
      email: data.user.email,
      name: name,
      role: role,
      avatar_url: null,
      isActive: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      departement: "Non spécifié",
    };

    await kv.set(`user_profile_${data.user.id}`, profile);

    return c.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get user profile
app.get("/make-server-450d4529/user/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get profile from KV store
    const profile = await kv.get(`user_profile_${user.id}`);

    if (!profile) {
      // Create default profile if not exists
      const defaultProfile = {
        id: user.id,
        email: user.email || "",
        name:
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Utilisateur",
        role: "reader",
        avatar_url: null,
        isActive: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        departement: "Non spécifié",
      };

      await kv.set(`user_profile_${user.id}`, defaultProfile);
      return c.json({ profile: defaultProfile });
    }

    // Update last login
    profile.lastLogin = new Date().toISOString();
    await kv.set(`user_profile_${user.id}`, profile);

    return c.json({ profile });
  } catch (error) {
    console.error("Get user profile error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Get all users (admin only)
app.get("/make-server-450d4529/users", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check permissions
    const userProfile = await kv.get(`user_profile_${user.id}`);
    if (!userProfile || !["admin", "headmaster"].includes(userProfile.role)) {
      return c.json({ error: "Insufficient permissions" }, 403);
    }

    // Get all user profiles
    const profiles = (await kv.getByPrefix("user_profile_")) || [];

    return c.json({ users: profiles });
  } catch (error) {
    console.error("Get users error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update user (admin only)
app.put("/make-server-450d4529/users/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param("id");
    const updates = await c.req.json();

    // Check permissions
    const currentUserProfile = await kv.get(`user_profile_${user.id}`);
    if (
      !currentUserProfile ||
      !["admin", "headmaster"].includes(currentUserProfile.role)
    ) {
      return c.json({ error: "Insufficient permissions" }, 403);
    }

    // Get target profile
    const targetProfile = await kv.get(`user_profile_${userId}`);
    if (!targetProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    // Update profile
    const updatedProfile = {
      ...targetProfile,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    await kv.set(`user_profile_${userId}`, updatedProfile);
    return c.json({ user: updatedProfile });
  } catch (error) {
    console.error("Update user error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete user (admin only)
app.delete("/make-server-450d4529/users/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userId = c.req.param("id");

    // Check permissions
    const currentUserProfile = await kv.get(`user_profile_${user.id}`);
    if (
      !currentUserProfile ||
      !["admin", "headmaster"].includes(currentUserProfile.role)
    ) {
      return c.json({ error: "Insufficient permissions" }, 403);
    }

    // Cannot delete yourself
    if (userId === user.id) {
      return c.json({ error: "Cannot delete yourself" }, 400);
    }

    // Delete user profile
    await kv.del(`user_profile_${userId}`);

    // Try to delete auth user
    try {
      await supabase.auth.admin.deleteUser(userId);
    } catch (error) {
      console.log("Could not delete auth user:", error);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Documents endpoints
app.get("/make-server-450d4529/documents", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get documents from KV store
    const documents = (await kv.getByPrefix("document_")) || [];

    return c.json({ documents });
  } catch (error) {
    console.error("Get documents error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create document metadata
app.post("/make-server-450d4529/documents", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const documentData = await c.req.json();
    const documentId = `document_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const document = {
      id: documentId,
      ...documentData,
      uploadedBy: user.email,
      uploadedAt: new Date().toISOString(),
      userId: user.id,
    };

    await kv.set(documentId, document);

    return c.json({ document });
  } catch (error) {
    console.error("Create document error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Update document
app.put("/make-server-450d4529/documents/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const documentId = c.req.param("id");
    const updates = await c.req.json();

    const existingDocument = await kv.get(`document_${documentId}`);
    if (!existingDocument) {
      return c.json({ error: "Document not found" }, 404);
    }

    const updatedDocument = {
      ...existingDocument,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.email,
    };

    await kv.set(`document_${documentId}`, updatedDocument);

    return c.json({ document: updatedDocument });
  } catch (error) {
    console.error("Update document error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Delete document
app.delete("/make-server-450d4529/documents/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const documentId = c.req.param("id");
    await kv.del(`document_${documentId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete document error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Categories endpoints
app.get("/make-server-450d4529/categories", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const categories = (await kv.getByPrefix("category_")) || [];
    return c.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Create category
app.post("/make-server-450d4529/categories", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const categoryData = await c.req.json();
    const categoryId = `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const category = {
      id: categoryId,
      ...categoryData,
      createdBy: user.email,
      createdAt: new Date().toISOString(),
      documentCount: 0,
    };

    await kv.set(categoryId, category);

    return c.json({ category });
  } catch (error) {
    console.error("Create category error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Statistics endpoint
app.get("/make-server-450d4529/stats", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get all documents and calculate stats
    const documents = (await kv.getByPrefix("document_")) || [];
    const users = (await kv.getByPrefix("user_profile_")) || [];
    const categories = (await kv.getByPrefix("category_")) || [];

    const stats = {
      totalDocuments: documents.length,
      totalUsers: users.length,
      totalCategories: categories.length,
      totalStorage: documents.reduce(
        (sum: number, doc: any) => sum + (doc.size || 0),
        0,
      ),
      documentsThisMonth: documents.filter((doc: any) => {
        const docDate = new Date(doc.uploadedAt);
        const now = new Date();
        return (
          docDate.getMonth() === now.getMonth() &&
          docDate.getFullYear() === now.getFullYear()
        );
      }).length,
      activeUsers: users.filter((user: any) => user.isActive).length,
      lastBackup: new Date().toISOString(),
    };

    return c.json({ stats });
  } catch (error) {
    console.error("Get stats error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

Deno.serve(app.fetch);
