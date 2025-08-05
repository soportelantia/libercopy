// Servicio temporal de almacenamiento de archivos en memoria
// Esto es solo para desarrollo - en producción debes usar Google Storage

interface StoredFile {
  buffer: Buffer
  originalName: string
  mimeType: string
  uploadedAt: Date
  userId: string
  orderId?: string
}

class SimpleFileStorageService {
  private files: Map<string, StoredFile> = new Map()

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    originalName: string,
    userId: string,
    orderId?: string,
  ): Promise<{ fileName: string; fileUrl: string }> {
    try {
      console.log("=== UPLOAD CON ALMACENAMIENTO TEMPORAL ===")
      console.log("Archivo:", fileName)
      console.log("Usuario:", userId)
      console.log("Tamaño:", buffer.length)

      // Simular estructura de Google Storage
      const filePath = orderId ? `libercopy/orders/${orderId}/${fileName}` : `libercopy/temp/${userId}/${fileName}`

      // Guardar en memoria (temporal)
      this.files.set(filePath, {
        buffer,
        originalName,
        mimeType: "application/pdf",
        uploadedAt: new Date(),
        userId,
        orderId,
      })

      console.log("Archivo guardado temporalmente:", filePath)
      console.log("Total archivos en memoria:", this.files.size)

      return {
        fileName: filePath,
        fileUrl: filePath,
      }
    } catch (error) {
      console.error("Error en almacenamiento temporal:", error)
      throw error
    }
  }

  async downloadFile(filePath: string): Promise<Buffer> {
    const file = this.files.get(filePath)
    if (!file) {
      throw new Error(`Archivo no encontrado: ${filePath}`)
    }
    return file.buffer
  }

  async deleteFile(filePath: string): Promise<void> {
    this.files.delete(filePath)
  }

  async listFiles(): Promise<string[]> {
    return Array.from(this.files.keys())
  }

  getFileInfo(filePath: string): StoredFile | undefined {
    return this.files.get(filePath)
  }
}

export const SimpleFileStorage = new SimpleFileStorageService()
