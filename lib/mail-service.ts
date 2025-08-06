import formData from "form-data"
import Mailgun from "mailgun.js"

// Variables de configuración - solo disponibles en el servidor
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY
const DOMAIN = process.env.MAILGUN_DOMAIN
const FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || "noreply@libercopy.es"
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

// Solo hacer debug en el servidor
const isServer = typeof window === "undefined"

if (isServer) {
  console.log("🔧 Mailgun configuration check (server-side):")
  console.log("- API Key:", MAILGUN_API_KEY ? `${MAILGUN_API_KEY.substring(0, 8)}...` : "NOT SET")
  console.log("- Domain:", DOMAIN || "NOT SET")
  console.log("- From Email:", FROM_EMAIL)
  console.log("- Environment:", process.env.NODE_ENV)
}

// Verificar si Mailgun está configurado (solo en servidor)
const isMailgunConfigured = isServer && Boolean(MAILGUN_API_KEY && DOMAIN)

if (isServer) {
  console.log("- Is Configured:", isMailgunConfigured)
}

// Inicializar Mailgun solo en el servidor
let mg: any = null
if (isServer && isMailgunConfigured) {
  try {
    console.log("🚀 Initializing Mailgun client...")
    const mailgun = new Mailgun(formData)
    mg = mailgun.client({
      username: "api",
      key: MAILGUN_API_KEY!,
      url: "https://api.eu.mailgun.net"
    })
    console.log("✅ Mailgun client initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing Mailgun:", error)
  }
} else if (isServer) {
  console.log("⚠️ Mailgun not configured - missing required environment variables")
}

// Función para calcular el total del pedido correctamente
function calculateOrderTotal(orderData: any): number {
  // Si ya existe total_amount y es mayor que 0, usarlo
  if (orderData.total_amount && orderData.total_amount > 0) {
    return orderData.total_amount
  }

  // Si no, calcular desde los items + gastos de envío
  const itemsTotal =
    orderData.order_items?.reduce((sum: number, item: any) => {
      return sum + (item.price || 0)
    }, 0) || 0

  const shippingCost = orderData.shipping_cost || 0
  return itemsTotal + shippingCost
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  // Esta función solo debe ejecutarse en el servidor
  if (!isServer) {
    console.error("❌ sendEmail called on client side - this should only run on server")
    return { success: false, error: "Email can only be sent from server" }
  }

  console.log("📧 sendEmail called with:", { to, subject: subject.substring(0, 50) + "..." })
  console.log("📧 isMailgunConfigured:", isMailgunConfigured)
  console.log("📧 mg client exists:", !!mg)

  // Si Mailgun no está configurado, solo logear y continuar
  if (!isMailgunConfigured) {
    console.log("📧 Email would be sent (Mailgun not configured):")
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log("HTML content:", html.substring(0, 200) + "...")
    return { success: false, error: "Mailgun not configured" }
  }

  if (!mg) {
    console.error("❌ Mailgun client not initialized")
    return { success: false, error: "Mailgun client not initialized" }
  }

  try {
    console.log("🚀 Sending email via Mailgun...")
    console.log("- Domain:", DOMAIN)
    console.log("- From:", FROM_EMAIL)
    console.log("- To:", to)

    const result = await mg.messages.create(DOMAIN!, {
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Fallback text version
    })

    console.log("✅ Email sent successfully:", { to, subject, messageId: result.id })
    return { success: true, result }
  } catch (error) {
    console.error("❌ Error sending email:", error)
    console.error("❌ Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    })
    return { success: false, error }
  }
}

// Función helper para verificar si el email está configurado
export function isEmailConfigured(): boolean {
  return isServer && isMailgunConfigured && mg !== null
}

// Función para obtener el estado de configuración
export function getMailgunStatus() {
  if (!isServer) {
    return {
      isConfigured: false,
      hasClient: false,
      domain: "N/A (client-side)",
      fromEmail: "N/A (client-side)",
      apiKeySet: false,
    }
  }

  return {
    isConfigured: isMailgunConfigured,
    hasClient: !!mg,
    domain: DOMAIN,
    fromEmail: FROM_EMAIL,
    apiKeySet: !!MAILGUN_API_KEY,
  }
}

// Plantilla base para emails
function getEmailTemplate(title: string, content: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">LiberCopy</h1>
      </div>
      
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2>${title}</h2>
        ${content}
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        <p>© ${new Date().getFullYear()} LiberCopy. Todos los derechos reservados.</p>
        <p>Si tienes alguna pregunta, contáctanos respondiendo a este email.</p>
      </div>
    </div>
  `
}

// Plantilla de bienvenida para nuevos usuarios
export function getWelcomeEmail(firstName: string, url: string) {
  const content = `
    <p>¡Hola ${firstName}!</p>

    <p>Gracias por registrarte en <strong>LiberCopy</strong>. Antes de empezar a usar tu cuenta, necesitamos que confirmes tu dirección de correo electrónico.</p>

    <p>Haz clic en el siguiente botón para verificar tu cuenta:</p>

    <p style="margin: 30px 0;">
      <a href="${url}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
        Verificar cuenta
      </a>
    </p>

    <p>Si no te registraste en LiberCopy, puedes ignorar este mensaje.</p>

    <hr />

    <p>Una vez verifiques tu cuenta, podrás:</p>
    <ul>
      <li>Subir y imprimir tus documentos</li>
      <li>Elegir entre diferentes opciones de encuadernación</li>
      <li>Hacer seguimiento de tus pedidos</li>
      <li>Gestionar tus direcciones de envío</li>
    </ul>

    <p>¡Gracias por confiar en nosotros!</p>
    <p>El equipo de LiberCopy</p>
  `

  return {
    subject: "LiberCopy - Confirma tu cuenta",
    html: getEmailTemplate("Confirma tu cuenta", content),
  }
}


// Plantilla de recuperación de contraseña
export function getPasswordResetEmail(resetUrl: string, email?: string) {
  const content = `
    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en LiberCopy.</p>
    
    <p>Si has sido tú, haz clic en el siguiente enlace para crear una nueva contraseña:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        Restablecer contraseña
      </a>
    </div>
    
    <p><strong>Este enlace expirará en 1 hora por seguridad.</strong></p>
    
    <p>Si no has solicitado este cambio, puedes ignorar este email. Tu contraseña no se modificará.</p>
    
    <p>Por seguridad, nunca compartas este enlace con nadie.</p>
    
    <p>También puedes copiar y pegar este enlace en tu navegador:</p>
    <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">${resetUrl}</p>
    
    <p>Saludos,<br>El equipo de LiberCopy</p>
  `

  return {
    subject: "LiberCopy - Restablece tu contraseña",
    html: getEmailTemplate("Restablece tu contraseña", content),
  }
}

// Plantilla de confirmación de pedido (mejorada)
export function getOrderConfirmationEmail(orderData: any) {
  console.log("📧 getOrderConfirmationEmail called with data:", {
    orderId: orderData.id,
    hasOrderItems: !!orderData.order_items?.length,
    orderItemsCount: orderData.order_items?.length || 0,
    hasShippingAddresses: !!orderData.order_shipping_addresses?.length,
    shippingAddressesCount: orderData.order_shipping_addresses?.length || 0,
    shippingAddressesData: orderData.order_shipping_addresses,
    hasLegacyShippingAddress: !!orderData.shipping_address,
  })

  // DEBUG DETALLADO de los datos recibidos
  console.log("🔍 DETAILED DEBUG - Order data structure:")
  console.log("- orderData keys:", Object.keys(orderData))
  console.log("- orderData.order_shipping_addresses:", orderData.order_shipping_addresses)
  console.log("- orderData.order_shipping_addresses type:", typeof orderData.order_shipping_addresses)
  console.log("- orderData.order_shipping_addresses length:", orderData.order_shipping_addresses?.length)

  if (orderData.order_shipping_addresses && orderData.order_shipping_addresses.length > 0) {
    console.log("- First shipping address:", orderData.order_shipping_addresses[0])
    console.log("- First shipping address keys:", Object.keys(orderData.order_shipping_addresses[0]))
  }

  // También verificar si hay datos en shipping_address (legacy)
  console.log("- orderData.shipping_address:", orderData.shipping_address)

  const { id, shipping_address, status, order_items } = orderData

  const isPaid = status === "completed" || status === "processing"
  const statusText = isPaid ? "Pagado" : "Pendiente de pago"

  // Función para obtener el nombre legible de las opciones
  const getReadableOption = (key: string, value: string) => {
    const options: Record<string, Record<string, string>> = {
      paper_size: { a4: "A4", a3: "A3" },
      paper_type: { normal: "Normal", cardstock: "Cartulina", photo: "Fotográfico" },
      paper_weight: {
        "80gsm": "80 g/m²",
        "90gsm": "90 g/m²",
        "100gsm": "100 g/m²",
        "120gsm": "120 g/m²",
        "160gsm": "160 g/m²",
        "200gsm": "200 g/m²",
        "250gsm": "250 g/m²",
        "300gsm": "300 g/m²",
      },
      print_type: { bw: "Blanco y negro", color: "Color", colorPro: "Color PRO" },
      print_form: { oneSided: "Una cara", doubleSided: "Doble cara" },
      orientation: { portrait: "Vertical", landscape: "Horizontal" },
      pages_per_side: { one: "Una página por cara", multiple: "Múltiples páginas por cara" },
      finishing: {
        none: "Sin acabado",
        stapled: "Grapado",
        twoHoles: "Dos taladros",
        laminated: "Plastificado",
        bound: "Encuadernado",
        fourHoles: "Cuatro taladros",
      },
    }

    return options[key]?.[value] || value
  }

  // Obtener información de dirección de envío mejorada - CON DEBUG
  let addressInfo = ""

  console.log("🏠 Processing shipping address data...")
  console.log("🏠 orderData.order_shipping_addresses:", orderData.order_shipping_addresses)

  // Primero intentar con order_shipping_addresses (nueva estructura)
  if (
    orderData.order_shipping_addresses &&
    Array.isArray(orderData.order_shipping_addresses) &&
    orderData.order_shipping_addresses.length > 0
  ) {
    const shippingAddr = orderData.order_shipping_addresses[0]
    console.log("✅ Using order_shipping_addresses data:", shippingAddr)

    addressInfo = `
  <div style="background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2563eb;">
    <h4 style="margin: 0 0 10px 0; color: #2563eb;">📍 Dirección de entrega</h4>
    <p style="margin: 5px 0;"><strong>${shippingAddr.recipient_name || ""}</strong></p>
    ${shippingAddr.company ? `<p style="margin: 5px 0; color: #666;">${shippingAddr.company}</p>` : ""}
    <p style="margin: 5px 0;">${shippingAddr.address_line_1 || ""}</p>
    ${shippingAddr.address_line_2 ? `<p style="margin: 5px 0; color: #666;">${shippingAddr.address_line_2}</p>` : ""}
    <p style="margin: 5px 0;"><strong>${shippingAddr.postal_code || ""}</strong> ${shippingAddr.city || ""}</p>
    <p style="margin: 5px 0;">${shippingAddr.province || ""}, ${shippingAddr.country || "España"}</p>
    ${shippingAddr.phone ? `<p style="margin: 5px 0; color: #666;">📞 ${shippingAddr.phone}</p>` : ""}
    ${shippingAddr.email ? `<p style="margin: 5px 0; color: #666;">✉️ ${shippingAddr.email}</p>` : ""}
    ${shippingAddr.delivery_notes ? `<p style="margin: 10px 0 5px 0; padding: 8px; background-color: #fff3cd; border-radius: 4px; font-size: 14px;"><strong>Notas de entrega:</strong> ${shippingAddr.delivery_notes}</p>` : ""}
  </div>
`
  }
  // Fallback a shipping_address si existe (legacy)
  else if (orderData.shipping_address) {
    console.log("⚠️ Using legacy shipping_address data:", orderData.shipping_address)
    const shipping_address = orderData.shipping_address
    addressInfo = `
  <div style="background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2563eb;">
    <h4 style="margin: 0 0 10px 0; color: #2563eb;">📍 Dirección de entrega</h4>
    <p style="margin: 5px 0;"><strong>${shipping_address.recipient_name || ""}</strong></p>
    ${shipping_address.company ? `<p style="margin: 5px 0; color: #666;">${shipping_address.company}</p>` : ""}
    <p style="margin: 5px 0;">${shipping_address.address_line_1 || ""}</p>
    ${shipping_address.address_line_2 ? `<p style="margin: 5px 0; color: #666;">${shipping_address.address_line_2}</p>` : ""}
    <p style="margin: 5px 0;"><strong>${shipping_address.postal_code || ""}</strong> ${shipping_address.city || ""}</p>
    <p style="margin: 5px 0;">${shipping_address.province || ""}, ${shipping_address.country || "España"}</p>
    ${shipping_address.phone ? `<p style="margin: 5px 0; color: #666;">📞 ${shipping_address.phone}</p>` : ""}
    ${shipping_address.email ? `<p style="margin: 5px 0; color: #666;">✉️ ${shipping_address.email}</p>` : ""}
  </div>
`
  } else {
    console.log("❌ No shipping address data found!")
    addressInfo = `
  <div style="background-color: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
    <h4 style="margin: 0 0 10px 0; color: #2563eb;">⚠️ Dirección de entrega</h4>
    <p style="margin: 5px 0; color: #2563eb;">No se encontró información de dirección de entrega para este pedido.</p>
  </div>
`
  }

  console.log("🏠 Address info generated:", addressInfo ? "✅ Generated" : "❌ Empty")

  // Lista de elementos del pedido con todas las características
  const itemsList =
    order_items
      ?.map(
        (item: any) => `
    <tr>
      <td style="padding: 15px; border-bottom: 2px solid #f0f0f0; vertical-align: top;">
        <div style="margin-bottom: 8px;">
          <strong style="color: #2563eb; font-size: 16px;">📄 ${item.file_name || "Documento"}</strong>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; margin: 8px 0;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
            <div><strong>📊 Páginas:</strong> ${item.page_count || 0}</div>
            <div><strong>📋 Copias:</strong> ${item.copies || 1}</div>
            <div><strong>📏 Tamaño:</strong> ${getReadableOption("paper_size", item.paper_size)}</div>
            <div><strong>📄 Papel:</strong> ${getReadableOption("paper_type", item.paper_type)}</div>
            ${item.paper_weight ? `<div><strong>⚖️ Grosor:</strong> ${getReadableOption("paper_weight", item.paper_weight)}</div>` : ""}
            <div><strong>🎨 Impresión:</strong> ${getReadableOption("print_type", item.print_type)}</div>
            <div><strong>📑 Caras:</strong> ${getReadableOption("print_form", item.print_form)}</div>
            <div><strong>🔄 Orientación:</strong> ${getReadableOption("orientation", item.orientation)}</div>
            <div><strong>📖 Pág/cara:</strong> ${getReadableOption("pages_per_side", item.pages_per_side)}</div>
            <div><strong>✨ Acabado:</strong> ${getReadableOption("finishing", item.finishing)}</div>
          </div>
          
          ${
            item.comments
              ? `
            <div style="margin-top: 10px; padding: 8px; background-color: #fff3cd; border-radius: 4px; border-left: 3px solid #ffc107;">
              <strong style="color: #2563eb;">💬 Comentarios:</strong>
              <div style="color: #856404; font-size: 13px; margin-top: 4px;">${item.comments}</div>
            </div>
          `
              : ""
          }
        </div>
        
        <div style="font-size: 12px; color: #666; margin-top: 8px;">
          💾 Tamaño del archivo: ${item.file_size ? `${(item.file_size / 1024 / 1024).toFixed(2)} MB` : "N/A"}
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 2px solid #f0f0f0; text-align: right; vertical-align: top;">
        <div style="font-size: 18px; font-weight: bold; color: #2563eb;">
          ${((item.price || 0) * (item.copies || 1)).toFixed(2)}€
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">
          ${(item.price || 0).toFixed(2)}€ × ${item.copies || 1}
        </div>
      </td>
    </tr>
  `,
      )
      .join("") || ""

  const content = `
    <p>¡Gracias por tu pedido!</p>
    
    <p>Hemos recibido tu pedido correctamente. A continuación te mostramos los detalles:</p>
    
    <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; border: 2px solid #e9ecef;">
      <h3 style="margin: 0 0 15px 0; color: #2563eb;">📋 Resumen del pedido</h3>
      <p style="margin: 8px 0;"><strong>Número de pedido:</strong> <span style="font-family: monospace; background-color: #e9ecef; padding: 4px 8px; border-radius: 4px;">#${id.substring(0, 8)}</span></p>
      <p style="margin: 8px 0;"><strong>Estado:</strong> <span style="color: ${isPaid ? "#22c55e" : "#f59e0b"}; font-weight: bold;">${statusText}</span></p>
      <p style="margin: 8px 0;"><strong>Total:</strong> <span style="font-size: 18px; font-weight: bold; color: #2563eb;">${calculateOrderTotal(orderData).toFixed(2)}€</span> <span style="font-size: 12px; color: #666;">(IVA incluido)</span></p>
    </div>
    
    ${addressInfo}
    
    ${
      itemsList
        ? `
    <div style="margin: 25px 0;">
      <h3 style="color: #2563eb; margin-bottom: 15px;">🛍️ Elementos del pedido</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
        ${itemsList}
        ${
          orderData.shipping_cost > 0
            ? `
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 15px; border-bottom: 1px solid #e9ecef;">
            <strong>🚚 Gastos de envío</strong>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #e9ecef; text-align: right;">
            <strong>${orderData.shipping_cost.toFixed(2)}€</strong>
          </td>
        </tr>
        `
            : ""
        }
        <tr style="background-color: #2563eb; color: white;">
          <td style="padding: 20px; font-weight: bold; font-size: 16px;">💰 TOTAL</td>
          <td style="padding: 20px; text-align: right; font-weight: bold; font-size: 18px;">
            ${calculateOrderTotal(orderData).toFixed(2)}€
          </td>
        </tr>
      </table>
    </div>
    `
        : ""
    }
    
    <p>Puedes consultar el estado de tu pedido en cualquier momento desde tu cuenta en nuestra web:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account/orders" 
         style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
        👤 Ver mis pedidos
      </a>
    </div>
    
    ${
      !isPaid
        ? `
    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #856404;"><strong>⚠️ Importante:</strong> Tu pedido está pendiente de pago. Por favor, completa el pago para que podamos procesarlo.</p>
    </div>
    `
        : `
    <div style="background-color: #d1edff; border: 1px solid #74b9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #0984e3;"><strong>✅ ¡Perfecto!</strong> Tu pedido ha sido pagado y está siendo procesado. Te mantendremos informado del estado.</p>
    </div>
    `
    }
    
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    
    <p>Saludos,<br>El equipo de LiberCopy</p>
  `

  return {
    subject: `LiberCopy - Confirmación de pedido #${id.substring(0, 8)}`,
    html: getEmailTemplate("Confirmación de pedido", content),
  }
}
