import axiosInstance from "@/utils/axiosInstance";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();

    const res = await axiosInstance.post("/chat", body);

    const data = res.data;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error posting data:", error);
    return new Response(JSON.stringify({ error: "Failed to submit data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
