import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("=== DEBUG CART DATA ===")
    console.log("Received cart data:", JSON.stringify(body, null, 2))

    if (body.cart && Array.isArray(body.cart)) {
      body.cart.forEach((item: any, index: number) => {
        console.log(`=== ITEM ${index} ===`)
        console.log("ID:", item.id)
        console.log("Name:", item.name || item.fileName)
        console.log("File URL:", item.fileUrl)
        console.log("File Size:", item.fileSize)
        console.log("Page Count:", item.pageCount)
        console.log("Has fileUrl:", !!item.fileUrl)
        console.log("Full item:", JSON.stringify(item, null, 2))
      })
    }

    return NextResponse.json({
      success: true,
      message: "Cart data logged successfully",
      itemCount: body.cart?.length || 0,
      itemsWithFileUrl: body.cart?.filter((item: any) => !!item.fileUrl).length || 0,
    })
  } catch (error) {
    console.error("Error in debug cart data:", error)
    return NextResponse.json({ error: "Failed to debug cart data" }, { status: 500 })
  }
}
