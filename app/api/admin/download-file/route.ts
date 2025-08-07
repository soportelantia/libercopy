import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { GoogleStorageService } from "@/lib/google-storage"

// Configuración de Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  console.log("=== ADMIN DOWNLOAD FILE ENDPOINT ===")

  try {
    const { orderId, itemId } = await request.json()

    console.log("Download request:", { orderId, itemId })

    if (!orderId || !itemId) {
      console.error("Missing required parameters:", { orderId: !!orderId, itemId: !!itemId })
      return NextResponse.json({ error: "Faltan parámetros requeridos" }, { status: 400 })
    }

    // Obtener información del item del pedido
    const { data: orderItem, error: itemError } = await supabase
      .from("order_items")
      .select("*")
      .eq("id", itemId)
      .eq("order_id", orderId)
      .single()

    if (itemError) {
      console.error("Error fetching order item:", itemError)
      return NextResponse.json({ error: "Error obteniendo información del archivo" }, { status: 500 })
    }

    if (!orderItem) {
      console.error("Order item not found:", { orderId, itemId })
      return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 })
    }

    console.log("Order item found:", orderItem)

    // Verificar que el archivo tenga un nombre
    if (!orderItem.file_name) {
      console.error("File name not found in order item")
      return NextResponse.json({ error: "Nombre de archivo no encontrado" }, { status: 404 })
    }

    // Determinar la ruta del archivo en Google Storage
    const filePath = ""

    // Intentar diferentes rutas posibles
    const possiblePaths = [
      // Usar temp_path si está disponible
      orderItem.temp_path,
      // Usar file_url si es una ruta relativa
      orderItem.file_url, // ← ahora se incluye siempre,
      // Construir ruta basada en order_id y file_name
      `orders/${orderId}/${orderItem.file_name}`,
      // Ruta alternativa con timestamp
      `temp/${orderId}/${orderItem.file_name}`,
      // Ruta directa con solo el nombre del archivo
      orderItem.file_name,
      // Ruta en carpeta uploads
      `uploads/${orderItem.file_name}`,
    ].filter(Boolean)

    console.log("Possible file paths to try:", possiblePaths)

    let signedUrl = ""
    let usedPath = ""

    // Intentar generar URL firmada con cada ruta posible
    for (const path of possiblePaths) {
      try {
        console.log(`Trying path: ${path}`)
        signedUrl = await GoogleStorageService.getSignedDownloadUrl(path, 0.25) // 15 minutos
        usedPath = path
        console.log(`Success with path: ${path}`)
        break
      } catch (error) {
        console.log(`Failed with path ${path}:`, error instanceof Error ? error.message : error)
        continue
      }
    }

    if (!signedUrl) {
      console.error("Could not generate signed URL for any path")
      console.error("Tried paths:", possiblePaths)
      return NextResponse.json(
        {
          error: "No se pudo generar la URL de descarga",
          details: `Rutas intentadas: ${possiblePaths.join(", ")}`,
        },
        { status: 404 },
      )
    }

    console.log("=== DOWNLOAD FILE SUCCESS ===")
    console.log("Used path:", usedPath)
    console.log("Generated signed URL successfully")

    return NextResponse.json({
      success: true,
      url: signedUrl,
      fileName: orderItem.file_name,
      filePath: usedPath,
    })
  } catch (error) {
    console.error("=== ADMIN DOWNLOAD FILE ERROR ===")
    console.error("Error:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
