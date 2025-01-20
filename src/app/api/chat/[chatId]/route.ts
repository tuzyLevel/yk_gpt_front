import axiosInstance from "@/utils/axiosInstance";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }): Promise<NextResponse> {
  try {
    const { chatId } = params;

    const res = await axiosInstance.get(`/chat/${chatId}`);
    const data = res.data;

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      {
        status: 500,
      }
    );
  }
}