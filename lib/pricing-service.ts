import { supabase } from "@/lib/supabase/client"

export interface PricingData {
  service_type: string
  option_key: string
  option_value: string
  price: number
}

export class PricingService {
  private static instance: PricingService
  private priceCache: Map<string, number> = new Map()
  private cacheExpiry = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

  static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService()
    }
    return PricingService.instance
  }

  private getCacheKey(serviceType: string, optionKey: string, optionValue: string): string {
    return `${serviceType}:${optionKey}:${optionValue}`
  }

  private async loadPrices(): Promise<void> {
    try {
      const { data, error } = await supabase.from("pricing").select("*").eq("service_type", "printing")

      if (error) {
        console.error("Error loading prices:", error)
        return
      }

      // Limpiar cache anterior
      this.priceCache.clear()

      // Cargar nuevos precios
      data?.forEach((item: PricingData) => {
        const key = this.getCacheKey(item.service_type, item.option_key, item.option_value)
        this.priceCache.set(key, item.price)
      })

      this.cacheExpiry = Date.now() + this.CACHE_DURATION
      console.log("Precios cargados desde la base de datos:", this.priceCache)
    } catch (error) {
      console.error("Error loading prices:", error)
    }
  }

  async getPrice(optionKey: string, optionValue: string): Promise<number> {
    // Verificar si el cache ha expirado
    if (Date.now() > this.cacheExpiry || this.priceCache.size === 0) {
      await this.loadPrices()
    }

    const key = this.getCacheKey("printing", optionKey, optionValue)
    return this.priceCache.get(key) || 0
  }

  async getAllPrices(): Promise<Map<string, number>> {
    if (Date.now() > this.cacheExpiry || this.priceCache.size === 0) {
      await this.loadPrices()
    }
    return new Map(this.priceCache)
  }

  // Método para invalidar el cache (útil si se actualizan precios)
  invalidateCache(): void {
    this.priceCache.clear()
    this.cacheExpiry = 0
  }
}

export const pricingService = PricingService.getInstance()
