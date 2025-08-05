"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle, Clock, FileText, Truck, Users, ChevronLeft, ChevronRight, Quote, Star, Award,BookOpen } from "lucide-react"
import Footer from "@/components/footer"
export default function EncuadernarPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      name: "Laura Martínez",
      role: "Estudiante de Derecho",
      text: "Imprimí y encuaderné mi TFG con ellos y quedó perfecto. El servicio fue rápido y el acabado muy profesional. Totalmente recomendable para trabajos académicos.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Arquitecto",
      text: "Utilizo sus servicios para imprimir presentaciones con grapado. La calidad es excelente y siempre cumplen con los plazos. Mis clientes quedan impresionados con el resultado.",
      rating: 5,
    },
    {
      name: "Elena Gómez",
      role: "Profesora universitaria",
      text: "Recomiendo Liberiscopy a todos mis alumnos para sus trabajos. El servicio online es muy intuitivo y los resultados son siempre profesionales.",
      rating: 5,
    },
    {
      name: "Miguel Sánchez",
      role: "Estudiante de Ingeniería",
      text: "La encuadernación en espiral es perfecta para mis apuntes. Puedo abrir completamente el documento y es muy resistente. Además, el precio es muy competitivo.",
      rating: 5,
    },
    {
      name: "Ana Fernández",
      role: "Diseñadora gráfica",
      text: "Como profesional del diseño, valoro mucho la calidad de impresión y acabado. Liberiscopy siempre cumple con mis expectativas y los plazos de entrega son inmejorables.",
      rating: 5,
    },
    {
      name: "Javier López",
      role: "Abogado",
      text: "Para documentos legales, la presentación es fundamental. El servicio de encuadernación profesional me ha ayudado a dar una imagen seria y de calidad a mis clientes.",
      rating: 5,
    },
  ]

  const maxIndex = testimonials.length - 3

  const nextTestimonial = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevTestimonial = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentIndex * 33.33}%)`
    }
  }, [currentIndex])

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />

      {/* Hero section */}
      <section className="relative py-20 md:py-32 overflow-hidden" style={{paddingBottom: "4rem"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Encuadernación profesional
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6">
              <span className="gradient-text">Encuadernación</span> profesional
              <br />
              para tus apuntes y documentos
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Dale un acabado profesional a tus trabajos, tesis, proyectos y apuntes con nuestro servicio de
              encuadernación de calidad premium.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Acabado profesional</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Entrega rápida</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Award className="h-5 w-5 text-purple-500" />
                <span>Calidad garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de encuadernación */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tipos de encuadernación</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos diferentes opciones de acabado para adaptarnos a tus necesidades, desde trabajos académicos
              hasta presentaciones profesionales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-xl card-hover">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center rounded-t-xl">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <FileText className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Encuadernado</h3>
                <p className="text-gray-600 mb-6">
                  Ideal para apuntes, manuales y documentos de uso frecuente. Permite abrir completamente el documento y
                  mantenerlo plano con una encuadernación en espiral.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span>Disponible en varios colores</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span>Tamaño A4</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span>Hasta 300 páginas</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">Desde 2,50€</span>
                  <Link href="/?finishing=bound">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl card-hover">
              <div className="h-48 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center rounded-t-xl">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <FileText className="h-10 w-10 text-white" />
                </div>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Grapado</h3>
                <p className="text-gray-600 mb-6">
                  Solución económica y práctica para documentos de pocas páginas. Ideal para folletos, presentaciones
                  breves y documentos de uso temporal.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span>Rápido y económico</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span>Tamaño A4</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span>Hasta 60 páginas</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">Desde 0,50€</span>
                  <Link href="/?finishing=stapled">
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl">
                      Ver detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </section>

      {/* Proceso de encuadernación */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cómo funciona</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Imprimir y encuadernar tus documentos con nosotros es rápido y sencillo. Sigue estos pasos para obtener un
              acabado profesional.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sube tu documento</h3>
              <p className="text-gray-600">
                Sube tu PDF a través de nuestra plataforma online o tráelo a nuestra tienda física.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Elige tus opciones</h3>
              <p className="text-gray-600">
                Selecciona el tipo de impresión (B/N o color), una o doble cara, y el acabado que prefieras.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Procesamos tu pedido</h3>
              <p className="text-gray-600">
                Nuestro equipo profesional imprime y aplica el acabado seleccionado con la máxima calidad.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Recibe tu trabajo</h3>
              <p className="text-gray-600">Recógelo en tienda o recíbelo cómodamente en tu domicilio en 24-48 horas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Miles de estudiantes y profesionales confían en nuestro servicio de impresión y acabados.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  ref={carouselRef}
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-1/3 flex-shrink-0 px-4">
                      <Card className="border-0 shadow-xl h-80 flex flex-col">
                        <CardContent className="p-8 flex flex-col h-full">
                          <Quote className="h-8 w-8 text-blue-600 opacity-20 mb-4 flex-shrink-0" />
                          <div className="flex-grow overflow-y-auto mb-6">
                            <p className="text-gray-600 italic">"{testimonial.text}"</p>
                          </div>
                          <div className="mt-auto">
                            <div className="flex items-center mb-2">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-12 h-12 bg-transparent"
                  onClick={prevTestimonial}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className={`h-6 w-6 ${currentIndex === 0 ? "text-gray-300" : ""}`} />
                </Button>

                <div className="flex space-x-2">
                  {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-12 h-12 bg-transparent"
                  onClick={nextTestimonial}
                  disabled={currentIndex === maxIndex}
                >
                  <ChevronRight className={`h-6 w-6 ${currentIndex === maxIndex ? "text-gray-300" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para imprimir y encuadernar tus documentos?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Consigue un acabado profesional para tus trabajos académicos, proyectos o presentaciones con nuestras
            opciones de impresión y acabado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold">
                Comenzar ahora
              </Button>
            </Link>
            <Link href="/contacto">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-semibold bg-transparent"
              >
                Contactar por email
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
