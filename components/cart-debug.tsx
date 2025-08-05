"use client"

import { useCart } from "@/hooks/use-cart"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, FileText, Download } from "lucide-react"

export function CartDebug() {
  const { cart } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          <Eye className="h-4 w-4 mr-2" />
          Debug Cart
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md max-h-96 overflow-auto">
      <Card className="bg-white shadow-lg border-2 border-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-blue-700">Cart Debug Info</CardTitle>
            <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm" className="h-6 w-6 p-0">
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div>
            <strong>Total Items:</strong> {cart.length}
          </div>

          {cart.map((item, index) => (
            <div key={index} className="border rounded p-2 bg-gray-50">
              <div className="font-semibold text-blue-600 mb-1">
                Item {index + 1}: {item.name || "Unnamed Item"}
              </div>

              <div className="space-y-1">
                <div>
                  <strong>Quantity:</strong> {item.quantity}
                </div>
                <div>
                  <strong>Price:</strong> €{item.price}
                </div>

                {item.options && (
                  <div>
                    <strong>Options:</strong>
                    <div className="ml-2 text-gray-600">
                      {Object.entries(item.options).map(([key, value]) => (
                        <div key={key}>
                          {key}: {String(value)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.fileName && (
                  <div className="bg-yellow-50 p-2 rounded border">
                    <div className="flex items-center gap-1 mb-1">
                      <FileText className="h-3 w-3" />
                      <strong>File Info:</strong>
                    </div>
                    <div>
                      <strong>Name:</strong> {item.fileName}
                    </div>
                    {item.fileSize && (
                      <div>
                        <strong>Size:</strong> {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                      </div>
                    )}
                    {item.pageCount && (
                      <div>
                        <strong>Pages:</strong> {item.pageCount}
                      </div>
                    )}
                  </div>
                )}

                {item.fileUrl && (
                  <div className="bg-green-50 p-2 rounded border">
                    <div className="flex items-center gap-1 mb-1">
                      <Download className="h-3 w-3" />
                      <strong>File URL:</strong>
                    </div>
                    <div className="break-all text-green-700">{item.fileUrl}</div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      URL Present ✓
                    </Badge>
                  </div>
                )}

                {!item.fileUrl && item.fileName && (
                  <div className="bg-red-50 p-2 rounded border">
                    <Badge variant="destructive" className="text-xs">
                      ⚠️ File name present but URL missing
                    </Badge>
                  </div>
                )}

                {item.tempPath && (
                  <div className="bg-blue-50 p-2 rounded border">
                    <div className="flex items-center gap-1">
                      <strong>Temp Path:</strong> {item.tempPath}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {cart.length === 0 && <div className="text-gray-500 italic">Cart is empty</div>}

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("=== CART DEBUG ===")
              console.log(JSON.stringify(cart, null, 2))
            }}
            className="w-full mt-2"
          >
            Log Cart to Console
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
