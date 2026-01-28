import { type NextRequest, NextResponse } from "next/server"
import { GoogleStorageService } from "@/lib/google-storage"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest, { params }: { params: { orderId: string; itemId: string } }) {
  console.log("=== INICIO GENERACIÓN DE URL FIRMADA ===")
  console.log("Order ID:", params.orderId)
  console.log("Item ID:", params.itemId)

  try {
    const authHeader = request.headers.get("authorization") || ""
    const token = authHeader.replace("Bearer ", "").trim()

    if (token !== process.env.ADMIN_API_KEY) {
      console.warn("Token inválido:", token)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Obtener información del item del pedido
    const { data: orderItem, error: itemError } = await supabase
      .from("order_items")
      .select("file_name, file_url, temp_path")
      .eq("id", params.itemId)
      .eq("order_id", params.orderId)
      .single()

    if (itemError || !orderItem) {
      console.error("Error obteniendo order item:", itemError)
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 })
    }

    console.log("Order item encontrado:", {
      file_name: orderItem.file_name,
      file_url: orderItem.file_url ? "presente" : "ausente",
      temp_path: orderItem.temp_path ? "presente" : "ausente",
    })

    const { file_name, file_url, temp_path } = orderItem

    if (!file_name) {
      return NextResponse.json({ error: "Nombre de archivo no disponible" }, { status: 404 })
    }

    // Determinar la ruta correcta del archivo en Google Storage
    let filePath: string

    if (temp_path) {
      // Si tenemos temp_path, usarlo (formato: liberCopy/temp/userId/fileName o liberCopy/orders/orderId/fileName)
      filePath = temp_path
      console.log("Usando temp_path:", filePath)
    } else if (file_url) {
      // Si file_url es una ruta de Google Storage (gs://bucket/path), extraer la ruta
      if (file_url.startsWith("gs://")) {
        const urlParts = file_url.split("/")
        filePath = urlParts.slice(3).join("/") // Remover gs://bucket-name/
        console.log("Extraída ruta de gs:// URL:", filePath)
      } else if (file_url.includes("liberCopy/")) {
        // Si ya es una ruta relativa que contiene liberCopy
        filePath = file_url.includes("liberCopy/") ? file_url.substring(file_url.indexOf("liberCopy/")) : file_url
        console.log("Usando ruta relativa de file_url:", filePath)
      } else {
        // Asumir que es una ruta en la carpeta de pedidos
        filePath = `liberCopy/orders/${params.orderId}/${file_name}`
        console.log("Construida ruta de pedido:", filePath)
      }
    } else {
      // Fallback: construir ruta basada en el orderId y fileName
      filePath = `liberCopy/orders/${params.orderId}/${file_name}`
      console.log("Usando ruta fallback:", filePath)
    }

    console.log("Ruta final del archivo:", filePath)

    try {
      // Verificar que el archivo existe antes de generar la URL firmada
      console.log("Verificando existencia del archivo...")

      // Intentar generar URL firmada (válida por 15 minutos)
      const signedUrl = await GoogleStorageService.getSignedDownloadUrl(filePath, 0.25)

      console.log("URL firmada generada exitosamente")
      console.log("=== FIN GENERACIÓN EXITOSA ===")

      return NextResponse.json({
        url: signedUrl,
        name: file_name,
        path: filePath,
      })
    } catch (storageError) {
      console.error("Error con Google Storage:", storageError)

      // Si falla con la ruta principal, intentar rutas alternativas
      const alternativePaths = [
        `liberCopy/orders/${params.orderId}/${file_name}`,
        `liberCopy/temp/${params.orderId}/${file_name}`,
        file_name, // Solo el nombre del archivo
      ]

      for (const altPath of alternativePaths) {
        if (altPath === filePath) continue // Skip si ya lo intentamos

        try {
          console.log("Intentando ruta alternativa:", altPath)
          const signedUrl = await GoogleStorageService.getSignedDownloadUrl(altPath, 0.25)

          console.log("URL firmada generada con ruta alternativa:", altPath)
          return NextResponse.json({
            url: signedUrl,
            name: file_name,
            path: altPath,
          })
        } catch (altError) {
          console.log("Ruta alternativa falló:", altPath, altError.message)
          continue
        }
      }

      // Si todas las rutas fallan, devolver error detallado
      return NextResponse.json(
        {
          error: "Archivo no encontrado en Google Storage",
          details: {
            attempted_path: filePath,
            alternative_paths: alternativePaths,
            file_name,
            storage_error: storageError.message,
          },
        },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error("=== ERROR GENERAL ===")
    console.error("Error completo:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
