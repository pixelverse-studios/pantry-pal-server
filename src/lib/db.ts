import { createClient } from '@supabase/supabase-js'

import 'dotenv/config'

const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''

// Initialize the Supabase client
export const db = createClient(SUPABASE_URL, SUPABASE_KEY)

export const TABLES = {
  CATEGORIES: 'categories',
  RECIPES: {
    ALLERGIES: 'recipe_allergies',
    COMMENTS: 'recipe_comments',
    FAVORITES: 'recipe_favorites',
    INGREDIENTS: 'recipe_ingredients',
    NOTES: 'recipe_notes',
    RATINGS: 'recipe_ratings',
    TAGS: 'recipe_tags'
  },
  USERS: 'users'
}

export const VIEWS = {
  RECIPE_DETAILS: 'recipe_details'
}
