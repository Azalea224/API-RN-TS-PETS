import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPets } from "../api/pets";
import { AddPetModal } from "../components/AddPetModal";
import { PetCard } from "../components/PetCard";
import { Pet } from "../data/pets";

export default function Index() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPets();
      setPets(data);
    } catch (err) {
      setError("Failed to load pets");
      console.error("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handlePetPress = (id: number) => {
    router.push(`/${id}`);
  };

  const handleAddPet = (newPet: Pet) => {
    setPets([newPet, ...pets]);
  };

  return (
    <>
      <View style={styles.headerButtons}>
        <TouchableOpacity
          onPress={fetchPets}
          style={[styles.headerButton, styles.refreshButton]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.headerButtonText}>Refresh</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Add Pet</Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loading && pets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color="#6200EE" />
              <Text style={styles.emptyText}>Loading pets...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Error: {error}</Text>
              <TouchableOpacity onPress={fetchPets} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : pets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No pets yet!</Text>
              <Text style={styles.emptySubtext}>Start by adding a new pet</Text>
            </View>
          ) : (
            pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onPress={() => handlePetPress(pet.id)}
              />
            ))
          )}
        </ScrollView>
        <AddPetModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddPet}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  headerButton: {
    flex: 1,
    margin: 0,
    borderRadius: 8,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  refreshButton: {
    backgroundColor: "#03DAC6",
  },
  headerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "300",
    marginTop: -2,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#6200EE",
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
