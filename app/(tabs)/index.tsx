"use client"

import { Search } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase"; // Adjust the import path as necessary

interface Product {
  id: number
  producto_nombre: string
  producto_ubicacion: string
}

export default function BuscarScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Por favor ingresa un término de búsqueda")
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("Productos")
        .select("DESCRIPCION, PRODUCTO_UBICACION")
        .eq("CODIGO_ARTICULO", searchQuery.trim())
        .single()

      if (error) {
        //console.log("error", error)
        if (error.code === "PGRST116") {
          Alert.alert("No encontrado", "No se encontró ningún producto con ese código.")
          setProduct(null)
        } else {
          throw error
        }
      } else {
        setProduct({
          id: 0, // or another appropriate value if you have an id
          producto_nombre: data.DESCRIPCION,
          producto_ubicacion: data.PRODUCTO_UBICACION,
        })
      }
    } catch (error) {
      console.error("Error searching product:", error)
      Alert.alert("Error", "Ocurrió un error al buscar el producto. Por favor, inténtalo de nuevo más tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Buscar Producto</Text>

        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <Search size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Ingresa el código del producto"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.searchButtonText}>Buscar</Text>
            )}
          </TouchableOpacity>
        </View>

        {product && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Producto Encontrado</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nombre del Producto</Text>
              <View style={styles.fieldBox}>
                <Text style={styles.fieldValue}>{product.producto_nombre}</Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Ubicación</Text>
              <View style={styles.fieldBox}>
                <Text style={styles.fieldValue}>{product.producto_ubicacion}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 30,
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#111827",
  },
  searchButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  fieldBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  fieldValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
})
