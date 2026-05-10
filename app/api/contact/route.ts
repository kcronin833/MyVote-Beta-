import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, category, message } = body

    if (!name?.trim() || !email?.trim() || !category || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    if (!["business", "suggestion", "general"].includes(category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category,
      message: message.trim(),
    })

    if (error) {
      console.error("[contact] insert error:", error)
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[contact] unexpected error:", err)
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 })
  }
}
