"use client"

import type React from "react"
import Navbar from "@/components/navbar"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Clock, Send, MessageSquare, HelpCircle, Printer, BookOpen, CheckCircle } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    

    

    // Aquí puedes enviar el token y formData al backend si lo deseas

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Nuestra Oficina",
      content: "Plaza Magdalena 9, 3º Planta",
      subtitle: "41001 Sevilla, España",
      action: "Ver en Google Maps",
      href: "https://maps.google.com/?q=Plaza+Magdalena+9,+Sevilla",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@libercopy.es",
      subtitle: "Respuesta en 24 horas",
      action: "Enviar email",
      href: "mailto:info@libercopy.es",
    },
    {
      icon: Clock,
      title: "Horarios",
      content: "Lunes a Viernes: 9:00 - 18:00",
      action: null,
      href: null,
    },
  ]

  const quickLinks = [
    {
      icon: HelpCircle,
      title: "Preguntas Frecuentes",
      description: "Encuentra respuestas rápidas",
      href: "/faq",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: Printer,
      title: "Servicios de Impresión",
      description: "Conoce nuestros servicios",
      href: "/imprimir",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: BookOpen,
      title: "Encuadernación",
      description: "Opciones de acabado",
      href: "/encuadernar",
      color: "from-purple-500 to-violet-600",
    },
  ]

  const reasons = [
    {
      icon: CheckCircle,
      title: "Atención Personalizada",
      description: "Cada proyecto es único y merece atención especializada",
    },
    {
      icon: CheckCircle,
      title: "Respuesta Rápida",
      description: "Contestamos todas las consultas en menos de 24 horas",
    },
    {
      icon: CheckCircle,
      title: "Asesoramiento Experto",
      description: "Te ayudamos a elegir la mejor opción para tu proyecto",
    },
  ]

  return (
   <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
    
        <section className="relative py-20 md:py-32 overflow-hidden" style={{paddingBottom: "4rem"}}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="container mx-auto px-4 relative">
            <div className="container mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contacto
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  ¿Necesitas ayuda?
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Estamos aquí para ayudarte con cualquier consulta sobre nuestros servicios de impresión y encuadernación.
                  Contáctanos y te responderemos lo antes posible.
                </p>
              </div>
            </div>
          </div>
        </section>
       
        <section className="relative py-20 overflow-hidden" style={{paddingBottom: '0px'}}>
        <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h2>

            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-gray-700 font-medium">{info.content}</p>
                        <p className="text-sm text-gray-500">{info.subtitle}</p>
                        {info.action && info.href && (
                          <a
                            href={info.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {info.action}
                            <Send className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Why Contact Us */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">¿Por qué contactarnos?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reasons.map((reason, index) => {
                  const Icon = reason.icon
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{reason.title}</h4>
                        <p className="text-xs text-gray-600">{reason.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-2 border-gray-100">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center">
                    <Send className="w-6 h-6 mr-3" />
                    Envíanos un mensaje
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Completa el formulario y nos pondremos en contacto contigo
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Mensaje enviado!</h3>
                      <p className="text-gray-600">Te responderemos lo antes posible.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                          <Input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                          <Input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                          <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Asunto *</label>
                        <Input id="subject" name="subject" type="text" required value={formData.subject} onChange={handleInputChange} />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mensaje *</label>
                        <Textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleInputChange} />
                      </div>
                      
                      <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar mensaje
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
          </div>
        </div>
        </div>
        </section>
        <section className="relative py-20 overflow-hidden" style={{paddingTop: '0px'},{paddingBottom: '0px'}}>
        {/* Quick Links */}
        <div className="container mx-auto px-4 relative">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Enlaces rápidos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <Link key={index} href={link.href}>
                  <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 hover:border-blue-200 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${link.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{link.title}</h3>
                      <p className="text-gray-600 text-sm">{link.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
        </div>
        </section>
        {/* Map Section */}
        <section className="relative py-20 overflow-hidden" style={{paddingTop: '0px'},{paddingBottom: '0px'}}>
        <div className="container mx-auto px-4 relative">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Visítanos</h2>
            <p className="text-blue-100 mb-4">
              Estamos ubicados en el centro de Sevilla, en Plaza Magdalena 9, 3º Planta
            </p>
            <a
              href="https://maps.google.com/?q=Plaza+Magdalena+9,+Sevilla"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Ver en Google Maps
            </a>
          </CardContent>
        </Card>
        </div>
        </section>
   
    {/* Footer */}
      <Footer />
    </main>
  )
}
