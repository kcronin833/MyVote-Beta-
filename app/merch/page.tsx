"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ShoppingCart, Plus, Minus, Package } from "lucide-react"
import { Logo } from "@/components/logo"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  sizes?: string[]
  colors?: string[]
  category: string
  approved: boolean
}

const products: Product[] = [
  {
    id: "1",
    name: "MyVote Classic Tee",
    description: "Soft cotton tee with the MyVote logo. Show your commitment to balanced civic engagement.",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["White", "Navy", "Red"],
    category: "Apparel",
    approved: true,
  },
  {
    id: "2",
    name: "Civic Duty Coffee Mug",
    description: "Start your morning with a reminder that every vote counts. 12oz ceramic mug.",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Drinkware",
    approved: true,
  },
  {
    id: "3",
    name: "I Voted Sticker Pack",
    description: "Pack of 25 patriotic stickers featuring the MyVote checkmark logo.",
    price: 7.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Accessories",
    approved: true,
  },
  {
    id: "4",
    name: "Balance is Power Hoodie",
    description: "Premium heavyweight hoodie. Stay warm while staying informed.",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=200",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Charcoal"],
    category: "Apparel",
    approved: true,
  },
  {
    id: "5",
    name: "MyVote Tote Bag",
    description: "Canvas tote bag for carrying your civic essentials. Durable and eco-friendly.",
    price: 18.99,
    image: "/placeholder.svg?height=200&width=200",
    colors: ["Natural", "Navy"],
    category: "Accessories",
    approved: true,
  },
  {
    id: "6",
    name: "Facts First Baseball Cap",
    description: "Structured cap with embroidered MyVote branding. Adjustable strap.",
    price: 22.99,
    image: "/placeholder.svg?height=200&width=200",
    colors: ["Navy", "Red", "White"],
    category: "Apparel",
    approved: true,
  },
]

interface CartItem {
  productId: string
  quantity: number
  size?: string
  color?: string
}

export default function MerchPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({})
  const [selectedColor, setSelectedColor] = useState<Record<string, string>>({})

  const addToCart = (product: Product) => {
    const size = selectedSize[product.id] || product.sizes?.[0]
    const color = selectedColor[product.id] || product.colors?.[0]
    const existing = cart.find(
      (item) => item.productId === product.id && item.size === size && item.color === color,
    )
    if (existing) {
      setCart(
        cart.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      )
    } else {
      setCart([...cart, { productId: product.id, quantity: 1, size, color }])
    }
  }

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)
    return sum + (product?.price || 0) * item.quantity
  }, 0)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <Logo size="md" />
            <div>
              <h1 className="text-2xl font-bold text-[#4A4A4A]">MyVote Merch Shop</h1>
              <p className="text-sm text-[#4A4A4A]/60">Show your civic pride</p>
            </div>
          </div>
          <Button variant="outline" className="relative border-[#1F3A93] text-[#1F3A93]">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart ({cartCount}) - ${cartTotal.toFixed(2)}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products
            .filter((p) => p.approved)
            .map((product) => (
              <Card key={product.id} className="border-[#E5E5E5] overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-[#E5E5E5]/50 flex items-center justify-center">
                  <Package className="w-16 h-16 text-[#4A4A4A]/30" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-[#4A4A4A]">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </div>
                    <Badge className="bg-[#1F3A93] text-white">${product.price}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.sizes && (
                    <div>
                      <label className="text-xs font-medium text-[#4A4A4A]">Size</label>
                      <Select
                        value={selectedSize[product.id] || product.sizes[0]}
                        onValueChange={(v) => setSelectedSize({ ...selectedSize, [product.id]: v })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {product.sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {product.colors && (
                    <div>
                      <label className="text-xs font-medium text-[#4A4A4A]">Color</label>
                      <Select
                        value={selectedColor[product.id] || product.colors[0]}
                        onValueChange={(v) => setSelectedColor({ ...selectedColor, [product.id]: v })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {product.colors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button
                    className="w-full bg-[#F39C12] hover:bg-[#E67E22] text-white"
                    onClick={() => addToCart(product)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Submit Product Idea */}
        <Card className="mt-12 border-[#E5E5E5]">
          <CardHeader className="text-center">
            <CardTitle className="text-[#4A4A4A]">Have a Product Idea?</CardTitle>
            <CardDescription>
              Submit your merch idea for review. All products require admin approval before being listed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/contact">
              <Button className="bg-[#1F3A93] hover:bg-[#1F3A93]/90 text-white">
                Submit Product Idea
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
