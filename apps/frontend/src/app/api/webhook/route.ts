export const runtime = 'edge'

export async function POST(request: Request) {
  // Log the incoming request
  console.log('Webhook request received:', new Date().toISOString())

  try {
    // Parse the request body
    const body = await request.json()
    console.log('Webhook request body:', JSON.stringify(body, null, 2))

    // Log headers
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })
    console.log('Webhook request headers:', JSON.stringify(headers, null, 2))

    // Return a success response
    return Response.json({ success: true, message: 'Webhook received' })
  } catch (error) {
    // Log and return error
    console.error('Error processing webhook:', error)
    return Response.json(
      { success: false, message: 'Error processing webhook' },
      { status: 400 },
    )
  }
}

// Also handle GET requests for testing purposes
export async function GET(request: Request) {
  console.log(
    'GET request received on webhook endpoint:',
    new Date().toISOString(),
  )

  // Log the URL and headers
  console.log('Request URL:', request.url)

  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })
  console.log('Request headers:', JSON.stringify(headers, null, 2))

  return Response.json({ success: true, message: 'Webhook endpoint is active' })
}
