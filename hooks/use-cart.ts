// Este archivo es un re-export del hook useCart desde el contexto del carrito
// para mantener compatibilidad con el código existente

import { useCart as useCartFromContext } from "@/contexts/cart-context"

export const useCart = useCartFromContext
