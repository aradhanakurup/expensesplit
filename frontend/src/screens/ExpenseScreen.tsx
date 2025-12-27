import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

interface Split {
  userId: string;
  userName: string;
  amount: number;
}

const ExpenseScreen: React.FC = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [splits, setSplits] = useState<Split[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddExpense = async () => {
    try {
      setLoading(true);
      const expense = {
        userId: '1',
        amount: parseFloat(amount),
        description,
        category,
        splits,
      };
      
      await axios.post('http://localhost:3000/api/expenses', expense);
      setSuccess(true);
      setDescription('');
      setAmount('');
      setSplits([]);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>Expense added successfully!</Text>}
      
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Dinner at restaurant"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categorySelector}>
            {['food', 'travel', 'entertainment', 'utilities'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  category === cat && styles.categoryButtonTextActive,
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleAddExpense}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding...' : 'Add Expense'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#2196F3',
  },
  categoryButtonText: {
    color: '#2196F3',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  success: {
    color: '#388e3c',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
});

export default ExpenseScreen;
