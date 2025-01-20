import axiosInstance from "@/utils/axiosInstance";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }
): Promise<Response> {
  try {
    const resolvedParams = await params;
    const { email } = resolvedParams;

    const res = await axiosInstance.get(`/chat/titles/${email}`);
    const data = res.data;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error Get Chat Titles:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get chat titles" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
