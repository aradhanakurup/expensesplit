import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';

interface Balance {
  userId: string;
  owes: Array<{ to_user_id: string; total: number }>;
  owed: Array<{ from_user_id: string; total: number }>;
}

const BalanceScreen: React.FC = () => {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/balance/1');
      setBalance(response.data);
    } catch (error) {
      console.error('Failed to fetch balance', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBalance().then(() => setRefreshing(false));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settlement Summary</Text>
      
      {balance && (
        <View>
          <Text style={styles.sectionTitle}>You Owe:</Text>
          <FlatList
            data={balance.owes}
            keyExtractor={(item) => item.to_user_id}
            renderItem={({ item }) => (
              <View style={styles.debtCard}>
                <Text style={styles.debtAmount}>₹{item.total.toFixed(2)}</Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          
          <Text style={styles.sectionTitle}>You Are Owed:</Text>
          <FlatList
            data={balance.owed}
            keyExtractor={(item) => item.from_user_id}
            renderItem={({ item }) => (
              <View style={styles.creditCard}>
                <Text style={styles.creditAmount}>₹{item.total.toFixed(2)}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  debtCard: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  creditCard: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#388e3c',
  },
  creditAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388e3c',
  },
});

export default BalanceScreen;
