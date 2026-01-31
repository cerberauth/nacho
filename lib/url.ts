const compressionEncoding = 'gzip';

// Version prefix for new encoding format (URL-safe base64)
const URL_ENCODING_VERSION = 'v2_'

async function compress(input: string): Promise<ArrayBuffer> {
  const cs = new CompressionStream(compressionEncoding)
  const writer = cs.writable.getWriter()
  const encoder = new TextEncoder()
  writer.write(encoder.encode(input))
  writer.close()
  const compressedData = await new Response(cs.readable).arrayBuffer()
  return compressedData as ArrayBuffer
}

async function decompress(input: BufferSource): Promise<string> {
  const ds = new DecompressionStream('gzip')
  const writer = ds.writable.getWriter()
  writer.write(input)
  writer.close()
  const decompressedData = await new Response(ds.readable).text()
  return decompressedData
}

// Convert ArrayBuffer to base64 string safely (handles large arrays)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 8192
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, Array.from(chunk))
  }
  return btoa(binary)
}

// Convert base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const buffer = new ArrayBuffer(binary.length)
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return buffer
}

// Make base64 URL-safe by replacing + with - and / with _
function toUrlSafeBase64(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Convert URL-safe base64 back to standard base64
function fromUrlSafeBase64(urlSafe: string): string {
  let base64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/')
  // Add padding if needed
  const padding = base64.length % 4
  if (padding) {
    base64 += '='.repeat(4 - padding)
  }
  return base64
}

export async function urlEncode(client: OAuth2Client): Promise<string> {
  const string = JSON.stringify(client)
  const compressed = await compress(string)
  const base64 = arrayBufferToBase64(compressed)
  const urlSafe = toUrlSafeBase64(base64)
  // Add version prefix for new format (no need for encodeURIComponent with URL-safe base64)
  return URL_ENCODING_VERSION + urlSafe
}

export function clientClientURLByEncodedClient(encodedClient: string): string {
  return `/clients/c?client=${encodedClient}`
}

export async function clientClientURLByOAuth2Client(client: OAuth2Client): Promise<string> {
  const encoded = await urlEncode(client)
  return clientClientURLByEncodedClient(encoded)
}

export async function urlDecode(encoded: string): Promise<OAuth2Client> {
  // Check if this is the new v2 format
  if (encoded.startsWith(URL_ENCODING_VERSION)) {
    const urlSafe = encoded.slice(URL_ENCODING_VERSION.length)
    const base64 = fromUrlSafeBase64(urlSafe)
    const byteArray = base64ToArrayBuffer(base64)
    const decompressed = await decompress(byteArray)
    return JSON.parse(decompressed)
  }

  // Legacy format: URL-encoded standard base64
  const decoded = decodeURIComponent(encoded)
  const byteArray = base64ToArrayBuffer(decoded)
  const decompressed = await decompress(byteArray)
  return JSON.parse(decompressed)
}
