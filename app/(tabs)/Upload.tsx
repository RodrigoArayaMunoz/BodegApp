"use client"

import { supabase } from "@/lib/supabase";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Activity } from "lucide-react-native";
import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as XLSX from "xlsx";



export default function Upload() {
const [excelData, setExcelData] = React.useState(null);
const [isProcessing, setIsProcessing] = React.useState(false);
const [modalVisible, setModalVisible] = React.useState(false);
const [statusMessage, setStatusMessage] = React.useState("");

const handledPickExcel = async () => {
  try {
        const result = await DocumentPicker.getDocumentAsync({
          type:
            ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", //. archivo en formato XLSX]
            "application/vnd.ms-excel", // archivo en formato XLS
            ],
          copyToCacheDirectory: true,
        });

    if (result.canceled || !result.assets || !result.assets[0]) {
      console.log("Datos del archivo Excel:");
      return;
    }

    const fileUri = result.assets[0].uri

    //Leer el archivo como base64
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });


    //Procesar archivo excel
    const workbook = XLSX.read(base64, { type: "base64" });

    const sheetName = workbook.SheetNames[0]; // Obtener el nombre de la primera hoja
    const worksheet = workbook.Sheets[sheetName]; // Obtener la primera hoja del libro de trabajo

    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1, // Leer los datos como un array de arrays 
      });

      //Comenzar carga de excel
      setIsProcessing(true);
      setModalVisible(true);
      setStatusMessage("Procesando archivo...");

      //Convertir data y enviar a supabase o donde sea necesario
      const headers = data[0] as string[]; // Asumimos que la primera fila contiene los encabezados
      const rows = data.slice(1); // El resto son los datos
      
      for (const row of rows) {
        const rowArray = row as any[];
        const rowData: Record<string, any> = {};
        headers.forEach((header, i) => {
          rowData[header] = rowArray[i];
        });

           const { error } = await supabase.from("Productos").insert(rowData);
        if (error) throw error;
      }

            // Éxito
      setStatusMessage("CARGA DE INVENTARIO EXITOSA");

      setTimeout(() => {
        setModalVisible(false);
        setIsProcessing(false);
        setStatusMessage("");
      }, 2000); // Oculta después de 3 segundos

    setExcelData(data as any); // Guardar los datos en el estado

    console.log("Datos del archivo Excel:", data);
  } catch (error) {
    console.error("Error al procesar el archivo Excel:", error);
          setStatusMessage("ERROR EN LA CARGA");
      setTimeout(() => {
        setModalVisible(false);
        setIsProcessing(false);
        setStatusMessage("");
      }, 3000);
  }
};


  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Carga de Inventario</Text>

        <View style={styles.searchContainer}>


          <TouchableOpacity style={styles.searchButton} onPress={handledPickExcel}>
 
              <Text style={styles.searchButtonText}>Cargar Archivo</Text>
            
          </TouchableOpacity>
        </View>


      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              {isProcessing && <Activity size={24} color="#2563eb" />}
              <Text style = {styles.ModalText}>{statusMessage}</Text>
            </View>
            </View>
        </Modal>
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

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBox: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    },
  ModalText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
})
