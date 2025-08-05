import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET() {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      checks: {},
    }

    // 1. Verificar estructura de la tabla orders
    try {
      const { data: columns, error: columnsError } = await supabaseAdmin.rpc("get_table_columns", {
        table_name: "orders",
      })

      if (columnsError) {
        // Fallback: usar información_schema directamente
        const { data: columnsAlt, error: columnsAltError } = await supabaseAdmin
          .from("information_schema.columns")
          .select("column_name, data_type, is_nullable")
          .eq("table_name", "orders")
          .eq("table_schema", "public")

        results.checks.columns = {
          success: !columnsAltError,
          data: columnsAlt || [],
          error: columnsAltError?.message,
          method: "information_schema",
        }
      } else {
        results.checks.columns = {
          success: true,
          data: columns || [],
          method: "rpc",
        }
      }
    } catch (error) {
      results.checks.columns = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    // 2. Verificar que podemos leer de la tabla orders
    try {
      const { data: orderCount, error: countError } = await supabaseAdmin
        .from("orders")
        .select("id", { count: "exact", head: true })

      results.checks.read_access = {
        success: !countError,
        count: orderCount || 0,
        error: countError?.message,
      }
    } catch (error) {
      results.checks.read_access = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    // 3. Intentar obtener un pedido de ejemplo
    try {
      const { data: sampleOrder, error: sampleError } = await supabaseAdmin.from("orders").select("*").limit(1)

      results.checks.sample_order = {
        success: !sampleError,
        data: sampleOrder?.[0] || null,
        error: sampleError?.message,
      }
    } catch (error) {
      results.checks.sample_order = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }

    // 4. Verificar variables de entorno
    results.checks.environment = {
      has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      has_service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabase_url_preview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({
      error: "Failed to run diagnostics",
      details: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
