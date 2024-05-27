const compressionEncoding = 'gzip';

async function compress(input: string): Promise<ArrayBuffer> {
  const cs = new CompressionStream(compressionEncoding)
  const writer = cs.writable.getWriter()
  const encoder = new TextEncoder()
  writer.write(encoder.encode(input))
  writer.close()
  const compressedData = await new Response(cs.readable).arrayBuffer()
  return compressedData
}

async function decompress(input: ArrayBuffer): Promise<string> {
  const ds = new DecompressionStream('gzip')
  const writer = ds.writable.getWriter()
  const decoder = new TextDecoder()
  writer.write(input)
  writer.close()
  const decompressedData = await new Response(ds.readable).text()
  return decompressedData
}

export async function urlEncode(client: OAuthClient): Promise<string> {
  const string = JSON.stringify(client)
  const compressed = await compress(string)
  return encodeURIComponent(btoa(String.fromCharCode(...new Uint8Array(compressed))))
}

export async function urlDecode(encoded: string): Promise<OAuthClient> {
  const byteArray = new Uint8Array(atob(decodeURIComponent(encoded)).split('').map((c: string) => c.charCodeAt(0)))
  const decompressed = await decompress(byteArray)
  return JSON.parse(decompressed)
}
