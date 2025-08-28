"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, X, FileText, File, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export type FileWithPages = {
  name: string
  type: string
  size: number
  pageCount?: number
  isProcessing?: boolean
  pageCountIsReal?: boolean
  fileUrl?: string
  tempPath?: string
  tempUserId?: string
  originalFile?: File
  arrayBuffer: () => Promise<ArrayBuffer>
  slice: (start?: number, end?: number, contentType?: string) => Blob
  stream: () => ReadableStream
  text: () => Promise<string>
}

type FileUploaderProps = {
  files: FileWithPages[]
  onUpdateFiles: (files: FileWithPages[]) => void
  onUpdatePageCount: (fileName: string, pageCount: number) => void
  disabled?: boolean
}

// Solo permitir archivos PDF
const ALLOWED_FILE_TYPES = ["application/pdf"]

// Tamaño máximo en bytes (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024

// Umbrales para diferentes métodos de upload - MUY CONSERVADORES para evitar 413
const CHUNK_UPLOAD_THRESHOLD = 3 * 1024 * 1024 // 3MB - usar chunks para todo lo que sea > 3MB
const SERVER_UPLOAD_THRESHOLD = 2 * 1024 * 1024 // 2MB

function FileUploader({ files, onUpdateFiles, onUpdatePageCount, disabled = false }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localFiles, setLocalFiles] = useState<FileWithPages[]>([])

  // Sincronizar los archivos locales con los props
  useEffect(() => {
    if (Array.isArray(files)) {
      const currentFileIds = localFiles.map((f) => f.name + f.size).join(",")
      const newFileIds = files.map((f) => f.name + f.size).join(",")

      if (currentFileIds !== newFileIds) {
        setLocalFiles(files)
      }
    }
  }, [files])

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    if (disabled) return
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFile = e.dataTransfer.files[0]
      handleFiles([newFile])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0]
      handleFiles([newFile])

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const validateFile = (file: File): { valid: boolean; errorMessage?: string } => {
    if (!file) return { valid: false, errorMessage: "Archivo inválido" }

    const fileName = file.name || ""
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (extension === "pdf" || file.type === "application/pdf") {
      if (file.size > MAX_FILE_SIZE) {
        return {
          valid: false,
          errorMessage: `El archivo "${fileName}" excede el tamaño máximo permitido de 50MB. Tu archivo tiene ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
        }
      }
      return { valid: true }
    }

    if (extension === "doc" || extension === "docx") {
      return {
        valid: false,
        errorMessage: `Los archivos DOC y DOCX no están soportados. Por favor, convierte "${fileName}" a PDF.`,
      }
    }

    return {
      valid: false,
      errorMessage: `El archivo "${fileName}" no es un formato permitido. Solo se aceptan archivos PDF.`,
    }
  }

  // Upload tradicional para archivos muy pequeños (≤2MB)
  const uploadTraditional = async (
    file: File,
  ): Promise<{ fileName: string; fileUrl: string; tempPath: string; tempUserId: string }> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploadStatus("uploading")
      setIsUploading(true)

      // Simular progreso para archivos pequeños
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 90) {
            return prev + Math.random() * 15
          }
          return prev
        })
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const responseText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { error: responseText || `Error ${response.status}` }
        }

        const userFriendlyError = errorData.error || `Error ${response.status}`
        setUploadStatus("error")
        throw new Error(userFriendlyError)
      }

      const result = await response.json()
      setUploadStatus("success")

      return {
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        tempPath: result.tempPath,
        tempUserId: result.tempUserId,
      }
    } catch (error) {
      setUploadStatus("error")
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // Upload del servidor para archivos pequeños (2-3MB)
  const uploadServer = async (
    file: File,
  ): Promise<{ fileName: string; fileUrl: string; tempPath: string; tempUserId: string }> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploadStatus("uploading")
      setIsUploading(true)
      setUploadProgress(0)

      // Simular progreso para archivos medianos
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev < 85) {
            return prev + Math.random() * 10
          }
          return prev
        })
      }, 500)

      const response = await fetch("/api/upload-server", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }

      const result = await response.json()
      setUploadStatus("success")

      return {
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        tempPath: result.tempPath,
        tempUserId: result.tempUserId,
      }
    } catch (error) {
      setUploadStatus("error")
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // Upload por chunks para archivos grandes (>3MB)
  const uploadChunks = async (
    file: File,
  ): Promise<{ fileName: string; fileUrl: string; tempPath: string; tempUserId: string }> => {
    try {
      setUploadStatus("uploading")
      setIsUploading(true)
      setUploadProgress(0)

      const chunkSize = 2 * 1024 * 1024 // 2MB por chunk para estar muy seguros
      const totalChunks = Math.ceil(file.size / chunkSize)
      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

      console.log(`Iniciando upload por chunks: ${totalChunks} chunks de ${chunkSize / (1024 * 1024)}MB cada uno`)

      let uploadedChunks = 0

      // Subir cada chunk
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)

        console.log(`Subiendo chunk ${i + 1}/${totalChunks} (${start}-${end})`)

        const formData = new FormData()
        formData.append("chunk", chunk)
        formData.append("chunkIndex", i.toString())
        formData.append("totalChunks", totalChunks.toString())
        formData.append("fileName", file.name)
        formData.append("uploadId", uploadId)

        const response = await fetch("/api/upload-chunk", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error subiendo chunk ${i + 1}`)
        }

        const result = await response.json()
        uploadedChunks++

        // Actualizar progreso
        const progress = (uploadedChunks / totalChunks) * 100
        setUploadProgress(progress)

        console.log(`Chunk ${i + 1} subido exitosamente. Progreso: ${progress.toFixed(1)}%`)

        // Si es el último chunk, el servidor devuelve el resultado final
        if (result.isComplete) {
          setUploadStatus("success")
          console.log("Upload por chunks completado exitosamente")

          return {
            fileName: result.fileName,
            fileUrl: result.fileUrl,
            tempPath: result.tempPath,
            tempUserId: result.tempUserId,
          }
        }
      }

      throw new Error("Error al subir el archivo. Vuelva a intentarlo en unos segundos.")
    } catch (error) {
      setUploadStatus("error")
      console.error("Error en upload por chunks:", error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // Función principal que decide qué método usar
  const uploadToGoogleStorage = async (
    file: File,
  ): Promise<{ fileName: string; fileUrl: string; tempPath: string; tempUserId: string }> => {
    const fileSizeMB = file.size / (1024 * 1024)

    console.log(`=== UPLOAD DECISION ===`)
    console.log(`Archivo: ${file.name}`)
    console.log(`Tamaño: ${fileSizeMB.toFixed(2)}MB (${file.size} bytes)`)
    console.log(`Límite chunks: ${CHUNK_UPLOAD_THRESHOLD / (1024 * 1024)}MB`)
    console.log(`Límite servidor: ${SERVER_UPLOAD_THRESHOLD / (1024 * 1024)}MB`)

    let method = "chunks" // Por defecto usar chunks para evitar 413
    if (file.size <= SERVER_UPLOAD_THRESHOLD) {
      method = "tradicional"
      console.log("✅ Usando upload TRADICIONAL (archivo ≤ 2MB)")
    } else if (file.size <= CHUNK_UPLOAD_THRESHOLD) {
      method = "servidor"
      console.log("✅ Usando upload por SERVIDOR (archivo 2-3MB)")
    } else {
      console.log("✅ Usando upload por CHUNKS (archivo > 3MB)")
    }

    try {
      if (method === "chunks") {
        return await uploadChunks(file)
      } else if (method === "servidor") {
        return await uploadServer(file)
      } else {
        return await uploadTraditional(file)
      }
    } catch (error) {
      console.error(`❌ Error con método ${method}:`, error)
      // Fallback: siempre usar chunks si falla cualquier otro método
      if (method !== "chunks") {
        console.log("🔄 Fallback: intentando con chunks...")
        return await uploadChunks(file)
      }
      throw error
    }
  }

  const handleFiles = async (newFiles: File[]) => {
    if (disabled) return
    if (!Array.isArray(newFiles) || newFiles.length === 0) return

    // Limpiar errores previos
    setUploadError(null)
    setUploadStatus("idle")
    setUploadProgress(0)

    const validFiles: { file: File; enhancedFile: FileWithPages }[] = []
    const errorMessages: string[] = []

    newFiles.forEach((file) => {
      if (!file) return

      const validation = validateFile(file)

      if (validation.valid) {
        const fileName = file.name || "archivo.pdf"
        const fileType = file.type || "application/pdf"
        const fileSize = file.size || 0

        const enhancedFile: FileWithPages = {
          name: fileName,
          type: fileType,
          size: fileSize,
          isProcessing: true,
          originalFile: file,
          arrayBuffer: () => file.arrayBuffer(),
          slice: (start?: number, end?: number, contentType?: string) => file.slice(start, end, contentType),
          stream: () => file.stream(),
          text: () => file.text(),
        }

        validFiles.push({ file, enhancedFile })
      } else if (validation.errorMessage) {
        errorMessages.push(validation.errorMessage)
      }
    })

    if (errorMessages.length > 0) {
      setUploadError(errorMessages[0])
      setUploadStatus("error")
      return
    }

    if (validFiles.length === 0) return

    const { file, enhancedFile } = validFiles[0]

    try {
      const uploadResult = await uploadToGoogleStorage(file)

      const updatedFile: FileWithPages = {
        ...enhancedFile,
        fileUrl: uploadResult.fileUrl,
        tempPath: uploadResult.tempPath,
        tempUserId: uploadResult.tempUserId,
        isProcessing: true,
      }

      const updatedFiles = [updatedFile]
      setLocalFiles(updatedFiles)
      onUpdateFiles(updatedFiles)

      countPdfPages(updatedFile, updatedFiles)

      toast({
        title: "¡Archivo subido exitosamente!",
        description: `${file.name} se ha subido correctamente.`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setUploadError(errorMessage)
      setUploadStatus("error")

      toast({
        title: "Error al subir archivo",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const countPdfPages = async (file: FileWithPages, currentFiles: FileWithPages[]) => {
    if (!file || !file.name) return

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pageCount = await getPdfPageCount(arrayBuffer)

      const updatedFiles = currentFiles.map((f) => {
        if (f && file.name && f.name === file.name) {
          const updatedFile = {
            ...f,
            pageCount,
            isProcessing: false,
            pageCountIsReal: true,
          }

          return updatedFile
        }
        return f
      })

      setLocalFiles(updatedFiles)
      onUpdateFiles(updatedFiles)
      onUpdatePageCount(file.name, pageCount)
    } catch (error) {
      const fileSize = file.size || 0
      const estimatedPages = Math.max(1, Math.round(fileSize / 100000))

      const updatedFiles = currentFiles.map((f) => {
        if (f && file.name && f.name === file.name) {
          return {
            ...f,
            pageCount: estimatedPages,
            isProcessing: false,
            pageCountIsReal: false,
          }
        }
        return f
      })

      setLocalFiles(updatedFiles)
      onUpdateFiles(updatedFiles)
      onUpdatePageCount(file.name, estimatedPages)
    }
  }

  const getPdfPageCount = async (arrayBuffer: ArrayBuffer): Promise<number> => {
    const uint8Array = new Uint8Array(arrayBuffer)
    const pdfText = new TextDecoder("utf-8").decode(uint8Array)

    // Estrategia 1: Buscar objetos de tipo Page (más específico)
    const pageObjectRegex = /\/Type\s*\/Page(?!\w)/gi
    const pageMatches = pdfText.match(pageObjectRegex)
    if (pageMatches && pageMatches.length > 0) {
      console.log(`[PDF] Páginas encontradas con regex de objetos Page: ${pageMatches.length}`)
      return pageMatches.length
    }

    // Estrategia 2: Buscar en el catálogo de páginas (/Count)
    const countRegex = /\/Count\s+(\d+)/gi
    let maxCount = 0
    let match
    while ((match = countRegex.exec(pdfText)) !== null) {
      const count = Number.parseInt(match[1], 10)
      if (count > maxCount) {
        maxCount = count
      }
    }
    if (maxCount > 0) {
      console.log(`[PDF] Páginas encontradas con /Count: ${maxCount}`)
      return maxCount
    }

    // Estrategia 3: Buscar referencias a páginas (más amplio)
    const pageRefRegex = /\/Page\s+\d+\s+\d+\s+R/gi
    const pageRefMatches = pdfText.match(pageRefRegex)
    if (pageRefMatches && pageRefMatches.length > 0) {
      console.log(`[PDF] Referencias de páginas encontradas: ${pageRefMatches.length}`)
      return pageRefMatches.length
    }

    // Estrategia 4: Buscar en el árbol de páginas (/Kids)
    const kidsRegex = /\/Kids\s*\[\s*([^\]]+)\]/gi
    const kidsMatches = pdfText.match(kidsRegex)
    if (kidsMatches && kidsMatches.length > 0) {
      let totalKids = 0
      kidsMatches.forEach((match) => {
        // Contar referencias de objetos en el array /Kids
        const objRefs = match.match(/\d+\s+\d+\s+R/g)
        if (objRefs) {
          totalKids += objRefs.length
        }
      })
      if (totalKids > 0) {
        console.log(`[PDF] Páginas encontradas en /Kids: ${totalKids}`)
        return totalKids
      }
    }

    // Estrategia 5: Buscar patrones de contenido de página
    const contentStreamRegex = /stream\s*\n.*?endstream/gis
    const contentMatches = pdfText.match(contentStreamRegex)
    if (contentMatches && contentMatches.length > 0) {
      // Filtrar streams que probablemente sean contenido de página
      const pageContentStreams = contentMatches.filter((stream) => {
        return stream.includes("BT") && stream.includes("ET") // Begin/End Text
      })
      if (pageContentStreams.length > 0) {
        console.log(`[PDF] Páginas estimadas por streams de contenido: ${pageContentStreams.length}`)
        return pageContentStreams.length
      }
    }

    // Estrategia 6: Análisis binario más preciso
    try {
      // Buscar el trailer y xref para obtener información más precisa
      const trailerRegex = /trailer\s*<<[^>]*\/Size\s+(\d+)/gi
      const trailerMatch = trailerRegex.exec(pdfText)
      if (trailerMatch) {
        const totalObjects = Number.parseInt(trailerMatch[1], 10)
        // Estimar páginas basándose en el número total de objetos
        // Típicamente hay entre 5-15 objetos por página
        const estimatedPages = Math.max(1, Math.round(totalObjects / 10))
        console.log(`[PDF] Páginas estimadas por objetos totales (${totalObjects}): ${estimatedPages}`)
        return estimatedPages
      }
    } catch (error) {
      console.warn("[PDF] Error en análisis binario:", error)
    }

    // Fallback mejorado: estimación por tamaño más precisa
    const fileSizeKB = arrayBuffer.byteLength / 1024
    let estimatedPages

    if (fileSizeKB < 100) {
      estimatedPages = 1
    } else if (fileSizeKB < 500) {
      estimatedPages = Math.round(fileSizeKB / 50) // ~50KB por página
    } else if (fileSizeKB < 2000) {
      estimatedPages = Math.round(fileSizeKB / 80) // ~80KB por página
    } else {
      estimatedPages = Math.round(fileSizeKB / 100) // ~100KB por página para archivos grandes
    }

    console.log(`[PDF] Páginas estimadas por tamaño (${fileSizeKB.toFixed(1)}KB): ${estimatedPages}`)
    return Math.max(1, estimatedPages)
  }

  const removeFile = (index: number) => {
    if (disabled) return
    if (!Array.isArray(localFiles) || localFiles.length === 0) return

    setUploadError(null)
    setUploadStatus("idle")
    setUploadProgress(0)
    setLocalFiles([])
    onUpdateFiles([])
  }

  const getFileIcon = (file: FileWithPages) => {
    if (!file) return <File className="h-6 w-6 text-gray-500" />
    return <FileText className="h-6 w-6 text-[#8b2131]" />
  }

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Error Alert */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{uploadError}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setUploadError(null)
                setUploadStatus("idle")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? "border-[#8b2131] bg-[#f8e9ec]" : "border-gray-300 hover:border-[#f47d30]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${
          uploadStatus === "error" ? "border-red-300 bg-red-50" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={disabled ? undefined : () => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          accept=".pdf,application/pdf"
          disabled={disabled || isUploading}
        />

        <div className="flex flex-col items-center">
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-blue-500 mx-auto mb-2 animate-spin" />
          ) : (
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          )}

          <p className="text-sm text-gray-600 mb-1">
            {disabled
              ? "Archivo cargado (no se puede cambiar en modo edición)"
              : isUploading
                ? "Subiendo archivo..."
                : "Arrastra y suelta tu archivo PDF aquí o haz clic para seleccionarlo"}
          </p>

          {!disabled && !isUploading && (
            <Button variant="outline" size="sm" type="button">
              Seleccionar archivo PDF
            </Button>
          )}
        </div>

        {/* Progress Bar Global */}
        {isUploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">{Math.round(uploadProgress)}% completado</p>
          </div>
        )}
      </div>

      {/* File List */}
      {Array.isArray(localFiles) && localFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-[#8b2131] flex items-center gap-2">
            Archivo seleccionado
            {getStatusIcon()}
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {localFiles.map((file, index) => (
              <div key={`file-${index}`} className="flex items-center p-3 bg-gray-50 rounded-md">
                {getFileIcon(file)}
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file?.name || "Archivo sin nombre"}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">PDF</span>
                    <p className="text-xs text-gray-500">
                      {(() => {
                        const size = file && typeof file.size === "number" && !isNaN(file.size) ? file.size : 0
                        if (size < 1024) {
                          return `${size} B`
                        } else if (size < 1024 * 1024) {
                          return `${(size / 1024).toFixed(2)} KB`
                        } else {
                          return `${(size / (1024 * 1024)).toFixed(2)} MB`
                        }
                      })()}
                    </p>
                    {isUploading ? (
                      <p className="text-xs text-blue-500 flex items-center">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Subiendo...
                      </p>
                    ) : file?.fileUrl ? (
                      <p className="text-xs text-green-500 flex items-center">✓ Subido</p>
                    ) : file?.isProcessing ? (
                      <p className="text-xs text-orange-500 flex items-center">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Analizando páginas...
                      </p>
                    ) : file?.pageCount !== undefined ? (
                      <p className="text-xs text-[#8b2131] flex items-center">
                        {file.pageCount} {file.pageCount === 1 ? "página" : "páginas"}
                        {!file.pageCountIsReal && <span className="text-gray-500 ml-1">(est.)</span>}
                      </p>
                    ) : null}
                  </div>
                </div>
                {!disabled && (
                  <button
                    className="ml-2 text-gray-400 hover:text-[#8b2131] transition"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-500 mt-2 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-[#8b2131] mt-0.5 flex-shrink-0" />
        <div>
          <p>Formato soportado: PDF</p>
          <p>Tamaño máximo por archivo: 50MB</p>
          {disabled && <p className="text-orange-600 font-medium">Modo edición: No se puede cambiar el archivo</p>}
        </div>
      </div>
    </div>
  )
}

// Export both default and named export
export default FileUploader
export { FileUploader }
