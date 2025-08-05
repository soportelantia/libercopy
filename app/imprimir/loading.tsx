import Navbar from "@/components/navbar"

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex items-center justify-center" style={{ marginTop: "80px" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando página de impresión...</p>
        </div>
      </div>
    </main>
  )
}
