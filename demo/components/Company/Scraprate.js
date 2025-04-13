import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';

export default function ScrapRates() {
  const [scrapRates, setScrapRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScrapRates();
  }, []);

  const fetchScrapRates = async () => {
    try {
      const response = await fetch("http://10.10.49.163:5002/scraprates");
      const data = await response.json();
      if (response.ok) {
        setScrapRates(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to load scrap rates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scrap Rates</Text>
      {loading ? <ActivityIndicator size="large" color="#2e7d32" /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ScrollView>
        {scrapRates.map((item, index) => (
          <View key={index} style={styles.rateCard}>
            <Image source={{ uri: item.image }} style={styles.scrapImage} />
            <View>
              <Text style={styles.scrapType}>{item.type}</Text>
              <Text style={styles.price}>₹{item.price}/kg</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#e8f5e9' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#1b5e20', marginBottom: 20 },
  errorText: { textAlign: 'center', color: 'red', fontSize: 16, marginBottom: 10 },
  rateCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 15, marginVertical: 8, borderRadius: 12 },
  scrapImage: { width: 50, height: 50, marginRight: 15 },
  scrapType: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  price: { fontSize: 16, color: '#555' },
});