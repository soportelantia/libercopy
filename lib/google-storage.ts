import { Storage } from "@google-cloud/storage"

let storage: Storage | null = null
let bucketName: string | null = null
let initializationError: string | null = null

function initializeGoogleStorage(): { storage: Storage; bucketName: string } {
  // Si ya se inicializó correctamente, devolver la instancia
  if (storage && bucketName) {
    return { storage, bucketName }
  }

  // Si hubo un error previo, lanzarlo de nuevo
  if (initializationError) {
    throw new Error(initializationError)
  }

  console.log("=== INICIALIZANDO GOOGLE CLOUD STORAGE ===")

  try {
    // Verificar variables de entorno requeridas
    if (!process.env.GOOGLE_CLOUD_PROJECT_ID) {
      const error = "Variable de entorno GOOGLE_CLOUD_PROJECT_ID no configurada"
      initializationError = error
      throw new Error(error)
    }

    if (!process.env.GOOGLE_CLOUD_STORAGE_BUCKET) {
      const error = "Variable de entorno GOOGLE_CLOUD_STORAGE_BUCKET no configurada"
      initializationError = error
      throw new Error(error)
    }

    if (!process.env.GOOGLE_CLOUD_CREDENTIALS_JSON) {
      const error = "Variable de entorno GOOGLE_CLOUD_CREDENTIALS_JSON no configurada"
      initializationError = error
      throw new Error(error)
    }

    bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET

    console.log("Proyecto ID:", process.env.GOOGLE_CLOUD_PROJECT_ID)
    console.log("Bucket:", bucketName)

    // Parsear credenciales JSON
    let credentials: any
    try {
      credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS_JSON)
      console.log("Credenciales JSON parseadas correctamente")
      console.log("Service Account Email:", credentials.client_email)
      console.log("Project ID en credenciales:", credentials.project_id)
    } catch (parseError) {
      const error = `GOOGLE_CLOUD_CREDENTIALS_JSON no es un JSON válido: ${parseError instanceof Error ? parseError.message : String(parseError)}`
      initializationError = error
      throw new Error(error)
    }

    // Verificar que las credenciales tienen los campos necesarios
    if (!credentials.client_email || !credentials.private_key || !credentials.project_id) {
      const error = "Las credenciales JSON no contienen los campos requeridos (client_email, private_key, project_id)"
      initializationError = error
      throw new Error(error)
    }

    // Configuración del cliente de Storage - usar solo las propiedades necesarias
    const storageConfig = {
      projectId: credentials.project_id, // Usar el project_id de las credenciales
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    }

    console.log("Configuración de Storage:", {
      projectId: storageConfig.projectId,
      client_email: storageConfig.credentials.client_email,
      private_key_length: storageConfig.credentials.private_key?.length || 0,
    })

    storage = new Storage(storageConfig)
    console.log("Cliente de Google Storage creado exitosamente")

    return { storage, bucketName }
  } catch (error) {
    const errorMessage = `Error de configuración de Google Storage: ${error instanceof Error ? error.message : String(error)}`
    initializationError = errorMessage
    console.error("Error inicializando Google Cloud Storage:", error)
    throw new Error(errorMessage)
  }
}

export interface UploadResult {
  fileName: string
  fileUrl: string
  publicUrl: string
  tempPath: string
}

export class GoogleStorageService {
  /**
   * Prueba la conexión a Google Storage
   */
  static async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log("=== PROBANDO CONEXIÓN A GOOGLE STORAGE ===")

      const { storage, bucketName } = initializeGoogleStorage()
      const bucket = storage.bucket(bucketName)

      // Verificar que el bucket existe
      console.log("Verificando bucket...")
      const [exists] = await bucket.exists()
      if (!exists) {
        return {
          success: false,
          message: `El bucket '${bucketName}' no existe o no tienes permisos para acceder a él`,
          details: { bucketName, exists: false },
        }
      }

      console.log("Bucket verificado, intentando listar archivos...")
      // Intentar listar archivos
      const [files] = await bucket.getFiles({ maxResults: 1 })

      return {
        success: true,
        message: "Conexión a Google Storage exitosa",
        details: {
          bucketName,
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          filesInBucket: files.length,
          bucketExists: true,
        },
      }
    } catch (error) {
      console.error("Error probando conexión:", error)
      return {
        success: false,
        message: `Error conectando a Google Storage: ${error instanceof Error ? error.message : String(error)}`,
        details: {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
      }
    }
  }

  /**
   * Sube archivos grandes usando chunked upload optimizado (para archivos > 10MB)
   */
  static async uploadToTempChunked(file: File, fileName: string, userId: string): Promise<UploadResult> {
    console.log("=== INICIO CHUNKED UPLOAD PARA ARCHIVO GRANDE ===")
    console.log("Archivo:", fileName)
    console.log("Usuario/ID temporal:", userId)
    console.log("Tamaño del archivo:", file.size)

    try {
      const { storage, bucketName } = initializeGoogleStorage()

      // Ruta temporal: liberCopy/temp/userId/fileName
      const tempPath = `liberCopy/temp/${userId}/${fileName}`
      console.log("Ruta temporal:", tempPath)

      // Obtener referencia al bucket
      const bucket = storage.bucket(bucketName)
      console.log("Bucket obtenido:", bucketName)

      // Crear archivo en el bucket
      const fileRef = bucket.file(tempPath)

      console.log("Iniciando chunked upload optimizado...")

      // Configuración optimizada para archivos grandes
      const writeStream = fileRef.createWriteStream({
        metadata: {
          contentType: "application/pdf",
          cacheControl: "public, max-age=31536000",
          metadata: {
            userId,
            uploadedAt: new Date().toISOString(),
            originalFileName: fileName,
            location: "temp",
            userType: userId.startsWith("temp_") ? "anonymous" : "authenticated",
            fileSize: file.size.toString(),
          },
        },
        public: false,
        validation: "md5",
        resumable: true, // Crucial para archivos grandes
        chunkSize: 1024 * 1024, // 1MB chunks para mejor rendimiento
        timeout: 300000, // 5 minutos de timeout
        retryDelayMultiplier: 2,
        maxRetryDelay: 60000,
        maxRetries: 3,
      })

      // Convertir el archivo a ArrayBuffer y procesarlo por chunks
      console.log("Convirtiendo archivo a ArrayBuffer...")
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      console.log("Procesando archivo por chunks...")

      // Promesa para manejar la subida
      const uploadPromise = new Promise<void>((resolve, reject) => {
        let uploadedBytes = 0

        writeStream.on("error", (error) => {
          console.error("Error en writeStream:", error)
          reject(error)
        })

        writeStream.on("progress", (bytesWritten) => {
          uploadedBytes = bytesWritten
          const progress = ((uploadedBytes / file.size) * 100).toFixed(1)
          console.log(`Progreso de subida: ${progress}% (${uploadedBytes}/${file.size} bytes)`)
        })

        writeStream.on("finish", () => {
          console.log("Chunked upload finalizado exitosamente")
          resolve()
        })
      })

      // Escribir el buffer completo (Google Storage maneja el chunking internamente)
      writeStream.end(buffer)

      // Esperar a que termine la subida con timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Upload timeout after 5 minutes")), 300000)
      })

      await Promise.race([uploadPromise, timeoutPromise])

      console.log("Archivo subido exitosamente con chunked upload")

      // Verificar que el archivo se subió correctamente
      const [fileExists] = await fileRef.exists()
      if (!fileExists) {
        throw new Error("El archivo no se pudo verificar después de la subida")
      }
      console.log("Archivo verificado en Google Storage")

      // Generar URL firmada para acceso
      let signedUrl: string
      try {
        console.log("Generando URL firmada...")
        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
        })
        signedUrl = url
        console.log("URL firmada generada exitosamente")
      } catch (urlError) {
        console.error("Error generando URL firmada:", urlError)
        signedUrl = `gs://${bucketName}/${tempPath}`
      }

      const result: UploadResult = {
        fileName: fileName,
        fileUrl: signedUrl,
        publicUrl: `gs://${bucketName}/${tempPath}`,
        tempPath: tempPath,
      }

      console.log("=== FIN CHUNKED UPLOAD EXITOSO ===")
      return result
    } catch (error) {
      console.error("=== ERROR EN CHUNKED UPLOAD ===")
      console.error("Error completo:", error)
      throw new Error(`Error en chunked upload: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Sube un archivo usando streaming (mejor para archivos medianos <= 10MB)
   */
  static async uploadToTempStream(file: File, fileName: string, userId: string): Promise<UploadResult> {
    console.log("=== INICIO UPLOAD STREAMING A CARPETA TEMPORAL ===")
    console.log("Archivo:", fileName)
    console.log("Usuario/ID temporal:", userId)
    console.log("Tamaño del archivo:", file.size)

    try {
      const { storage, bucketName } = initializeGoogleStorage()

      // Ruta temporal: liberCopy/temp/userId/fileName
      const tempPath = `liberCopy/temp/${userId}/${fileName}`
      console.log("Ruta temporal:", tempPath)

      // Obtener referencia al bucket
      const bucket = storage.bucket(bucketName)
      console.log("Bucket obtenido:", bucketName)

      // Crear archivo en el bucket
      const fileRef = bucket.file(tempPath)

      console.log("Iniciando subida con streaming...")

      // Crear un stream de escritura
      const writeStream = fileRef.createWriteStream({
        metadata: {
          contentType: "application/pdf",
          cacheControl: "public, max-age=31536000",
          metadata: {
            userId,
            uploadedAt: new Date().toISOString(),
            originalFileName: fileName,
            location: "temp",
            userType: userId.startsWith("temp_") ? "anonymous" : "authenticated",
          },
        },
        public: false,
        validation: "md5",
        resumable: true,
      })

      // Convertir el archivo a stream
      const fileStream = file.stream()
      const reader = fileStream.getReader()

      // Promesa para manejar la subida
      const uploadPromise = new Promise<void>((resolve, reject) => {
        writeStream.on("error", (error) => {
          console.error("Error en writeStream:", error)
          reject(error)
        })

        writeStream.on("finish", () => {
          console.log("Stream de escritura finalizado")
          resolve()
        })
      })

      // Leer y escribir el archivo por chunks
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          writeStream.write(Buffer.from(value))
        }
        writeStream.end()
      } catch (streamError) {
        console.error("Error leyendo stream:", streamError)
        writeStream.destroy()
        throw streamError
      }

      // Esperar a que termine la subida
      await uploadPromise

      console.log("Archivo subido exitosamente con streaming")

      // Verificar que el archivo se subió correctamente
      const [fileExists] = await fileRef.exists()
      if (!fileExists) {
        throw new Error("El archivo no se pudo verificar después de la subida")
      }
      console.log("Archivo verificado en Google Storage")

      // Generar URL firmada para acceso
      let signedUrl: string
      try {
        console.log("Generando URL firmada...")
        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
        })
        signedUrl = url
        console.log("URL firmada generada exitosamente")
      } catch (urlError) {
        console.error("Error generando URL firmada:", urlError)
        signedUrl = `gs://${bucketName}/${tempPath}`
      }

      const result: UploadResult = {
        fileName: fileName,
        fileUrl: signedUrl,
        publicUrl: `gs://${bucketName}/${tempPath}`,
        tempPath: tempPath,
      }

      console.log("=== FIN UPLOAD STREAMING EXITOSO ===")
      return result
    } catch (error) {
      console.error("=== ERROR EN UPLOAD STREAMING ===")
      console.error("Error completo:", error)
      throw new Error(`Error subiendo archivo con streaming: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Sube un archivo a la carpeta temporal liberCopy/temp (método original con buffer)
   */
  static async uploadToTemp(file: Buffer | Uint8Array, fileName: string, userId: string): Promise<UploadResult> {
    console.log("=== INICIO UPLOAD A CARPETA TEMPORAL ===")
    console.log("Archivo:", fileName)
    console.log("Usuario/ID temporal:", userId)
    console.log("Tamaño del buffer:", file.length)

    try {
      const { storage, bucketName } = initializeGoogleStorage()

      // Ruta temporal: liberCopy/temp/userId/fileName
      const tempPath = `liberCopy/temp/${userId}/${fileName}`
      console.log("Ruta temporal:", tempPath)

      // Obtener referencia al bucket
      const bucket = storage.bucket(bucketName)
      console.log("Bucket obtenido:", bucketName)

      // Crear archivo en el bucket
      const fileRef = bucket.file(tempPath)

      console.log("Iniciando subida del archivo...")

      // Configurar opciones de subida
      const uploadOptions = {
        metadata: {
          contentType: "application/pdf",
          cacheControl: "public, max-age=31536000",
          metadata: {
            userId,
            uploadedAt: new Date().toISOString(),
            originalFileName: fileName,
            location: "temp",
            userType: userId.startsWith("temp_") ? "anonymous" : "authenticated",
          },
        },
        public: false,
        validation: "md5" as const,
        resumable: false,
      }

      // Subir el archivo
      await fileRef.save(file, uploadOptions)
      console.log("Archivo subido exitosamente a carpeta temporal")

      // Verificar que el archivo se subió correctamente
      const [fileExists] = await fileRef.exists()
      if (!fileExists) {
        throw new Error("El archivo no se pudo verificar después de la subida")
      }
      console.log("Archivo verificado en Google Storage")

      // Generar URL firmada para acceso
      let signedUrl: string
      try {
        console.log("Generando URL firmada...")
        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
        })
        signedUrl = url
        console.log("URL firmada generada exitosamente")
      } catch (urlError) {
        console.error("Error generando URL firmada:", urlError)
        signedUrl = `gs://${bucketName}/${tempPath}`
      }

      const result: UploadResult = {
        fileName: fileName,
        fileUrl: signedUrl,
        publicUrl: `gs://${bucketName}/${tempPath}`,
        tempPath: tempPath,
      }

      console.log("=== FIN UPLOAD TEMPORAL EXITOSO ===")
      return result
    } catch (error) {
      console.error("=== ERROR EN UPLOAD TEMPORAL ===")
      console.error("Error completo:", error)
      throw new Error(
        `Error subiendo archivo a carpeta temporal: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Mueve archivos de carpeta temporal a pedidos
   */
  static async moveToOrder(tempPath: string, orderId: string): Promise<string> {
    console.log("=== MOVIENDO ARCHIVO A CARPETA DE PEDIDO ===")
    console.log("Ruta temporal:", tempPath)
    console.log("ID del pedido:", orderId)

    try {
      const { storage, bucketName } = initializeGoogleStorage()
      const bucket = storage.bucket(bucketName)

      // Archivo origen (temporal)
      const sourceFile = bucket.file(tempPath)

      // Verificar que el archivo temporal existe
      const [exists] = await sourceFile.exists()
      if (!exists) {
        throw new Error(`El archivo temporal '${tempPath}' no existe`)
      }

      // Extraer el nombre del archivo de la ruta temporal
      const fileName = tempPath.split("/").pop()
      if (!fileName) {
        throw new Error("No se pudo extraer el nombre del archivo de la ruta temporal")
      }

      // Ruta de destino: liberCopy/orders/orderId/fileName
      const orderPath = `liberCopy/orders/${orderId}/${fileName}`
      console.log("Ruta de destino:", orderPath)

      // Archivo destino
      const destinationFile = bucket.file(orderPath)

      // Copiar archivo a la nueva ubicación
      console.log("Copiando archivo...")
      await sourceFile.copy(destinationFile)

      // Actualizar metadatos del archivo en la nueva ubicación
      await destinationFile.setMetadata({
        metadata: {
          orderId,
          movedAt: new Date().toISOString(),
          location: "orders",
        },
      })

      // Eliminar archivo temporal
      console.log("Eliminando archivo temporal...")
      await sourceFile.delete()

      console.log("Archivo movido exitosamente a carpeta de pedidos")
      console.log("=== FIN MOVIMIENTO EXITOSO ===")

      return orderPath
    } catch (error) {
      console.error("=== ERROR MOVIENDO ARCHIVO ===")
      console.error("Error completo:", error)
      throw new Error(
        `Error moviendo archivo a carpeta de pedidos: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  /**
   * Mueve archivos por ID temporal (para usuarios no autenticados)
   */
  static async moveTempFilesToOrder(tempUserId: string, orderId: string): Promise<string[]> {
    console.log("=== MOVIENDO ARCHIVOS TEMPORALES A PEDIDO ===")
    console.log("ID temporal:", tempUserId)
    console.log("Pedido:", orderId)

    try {
      // Listar archivos temporales del usuario temporal
      const tempFiles = await this.listTempFiles(tempUserId)
      console.log("Archivos temporales encontrados:", tempFiles.length)

      const movedFiles: string[] = []

      // Mover cada archivo
      for (const tempPath of tempFiles) {
        try {
          const orderPath = await this.moveToOrder(tempPath, orderId)
          movedFiles.push(orderPath)
          console.log(`Archivo movido: ${tempPath} -> ${orderPath}`)
        } catch (error) {
          console.error(`Error moviendo archivo ${tempPath}:`, error)
          // Continuar con los demás archivos
        }
      }

      console.log(`=== MOVIMIENTO COMPLETADO: ${movedFiles.length}/${tempFiles.length} archivos ===`)
      return movedFiles
    } catch (error) {
      console.error("=== ERROR MOVIENDO ARCHIVOS TEMPORALES ===")
      console.error("Error completo:", error)
      throw new Error(`Error moviendo archivos temporales: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Lista archivos en la carpeta temporal de un usuario (autenticado o temporal)
   */
  static async listTempFiles(userId: string): Promise<string[]> {
    try {
      const { storage, bucketName } = initializeGoogleStorage()
      const bucket = storage.bucket(bucketName)

      const [files] = await bucket.getFiles({
        prefix: `liberCopy/temp/${userId}/`,
      })

      return files.map((file) => file.name)
    } catch (error) {
      console.error("Error listando archivos temporales:", error)
      throw new Error(`Error listando archivos temporales: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Descarga un archivo de Google Cloud Storage
   */
  static async downloadFile(filePath: string): Promise<Buffer> {
    console.log("=== INICIO DESCARGA DE GOOGLE STORAGE ===")
    console.log("Archivo:", filePath)

    try {
      const { storage, bucketName } = initializeGoogleStorage()
      const bucket = storage.bucket(bucketName)
      const file = bucket.file(filePath)

      // Verificar que el archivo existe
      const [exists] = await file.exists()
      if (!exists) {
        throw new Error(`El archivo '${filePath}' no existe en Google Storage`)
      }

      // Descargar el archivo
      const [buffer] = await file.download()
      console.log("Archivo descargado exitosamente, tamaño:", buffer.length)
      console.log("=== FIN DESCARGA EXITOSA ===")

      return buffer
    } catch (error) {
      console.error("=== ERROR EN DESCARGA DE GOOGLE STORAGE ===")
      console.error("Error completo:", error)
      throw new Error(`Error descargando archivo: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Genera una URL firmada para descargar un archivo
   */
  static async getSignedDownloadUrl(filePath: string, expiresInHours = 24): Promise<string> {
    try {
      const { storage, bucketName } = initializeGoogleStorage()
      const bucket = storage.bucket(bucketName)
      const file = bucket.file(filePath)

      const [exists] = await file.exists()
      if (!exists) {
        throw new Error(`El archivo '${filePath}' no existe`)
      }

      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + expiresInHours * 60 * 60 * 1000,
      })

      return signedUrl
    } catch (error) {
      console.error("Error generando URL firmada:", error)
      throw new Error(`Error generando URL firmada: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Elimina un archivo de Google Cloud Storage
   */
  static async deleteFile(filePath: string): Promise<void> {
    try {
      const { storage, bucketName } = initializeGoogleStorage()
      const bucket = storage.bucket(bucketName)
      const file = bucket.file(filePath)

      const [exists] = await file.exists()
      if (!exists) {
        console.log("El archivo no existe, no es necesario eliminarlo")
        return
      }

      await file.delete()
      console.log("Archivo eliminado exitosamente")
    } catch (error) {
      console.error("Error eliminando archivo:", error)
      throw new Error(`Error eliminando archivo: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
