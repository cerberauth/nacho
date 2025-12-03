const compressionEncoding = 'gzip';

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

export async function urlEncode(client: OAuth2Client): Promise<string> {
  const string = JSON.stringify(client)
  const compressed = await compress(string)
  return encodeURIComponent(btoa(String.fromCharCode(...new Uint8Array(compressed))))
}

export function clientClientURLByEncodedClient(encodedClient: string): string {
  return `/clients/c?client=${encodedClient}`
}

export async function clientClientURLByOAuth2Client(client: OAuth2Client): Promise<string> {
  const encoded = await urlEncode(client)
  return clientClientURLByEncodedClient(encoded)
}

export async function urlDecode(encoded: string): Promise<OAuth2Client> {
  const byteArray = new Uint8Array(atob(decodeURIComponent(encoded)).split('').map((c: string) => c.charCodeAt(0)))
  const decompressed = await decompress(byteArray)
  return JSON.parse(decompressed)
}
