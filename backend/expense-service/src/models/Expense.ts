import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  // description: { type: String, required: true }, // New field for description
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  date: { type: Date, default: Date.now },
  // icon: { type: String }, // Optional: Store an icon if needed per transaction
  // Add additional fields as needed, such as notes or tags
});

export default mongoose.model('Expense', ExpenseSchema);