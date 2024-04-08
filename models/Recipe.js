import { model, Schema } from 'mongoose'

const recipeSchema = new Schema({
  id: { type: 'UUID', unique: true },
  userId: String,
  title: String,
  ingredients: [
    {
      foodId: Number,
      name: String,
      image: String,
      units: {
        base: String,
        short: String,
        long: String
      },
      possibleUnits: [String],
      nutrition: [
        {
          name: String,
          amount: Number,
          unit: String,
          percentOfDailyNeeds: Number
        }
      ],
      estimatedCost: Number,
      caloricBreakdown: {
        calories: {
          percent: Number,
          value: Number
        },
        protein: {
          percent: Number,
          value: Number
        },
        carbs: {
          percent: Number,
          value: Number
        },
        fat: {
          percent: Number,
          value: Number
        }
      },
      aisle: [String]
    }
  ],
  macros: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  totalEstimatedCost: Number,
  instructions: [String],
  cookingMethod: String,
  allergies: [String],
  category: { categoryId: String, label: String },
  rating: Number,
  difficulty: Number,
  tags: [String],
  author: {
    name: String,
    authorId: String,
    rating: Number,
    difficulty: Number
  },
  image: String,
  interactions: {
    ratings: [
      {
        user: {
          id: String,
          name: String,
          email: String
        },
        score: Number,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    comments: [
      {
        user: {
          id: String,
          name: String,
          email: String
        },
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
})

export default model('Recipe', recipeSchema)
