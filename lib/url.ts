const compressionEncoding = 'gzip';

async function compress(string: string): Promise<ArrayBuffer> {
  const byteArray: Uint8Array = new TextEncoder().encode(string)
  const cs: CompressionStream = new CompressionStream(compressionEncoding)
  await cs.writable.getWriter().write(byteArray)
  return new Response(cs.readable).arrayBuffer()
}

async function decompress(byteArray: Uint8Array): Promise<string> {
  const cs: DecompressionStream = new DecompressionStream(compressionEncoding)
  await cs.writable.getWriter().write(byteArray)
  return new Response(cs.readable).arrayBuffer().then((arrayBuffer: ArrayBuffer) => new TextDecoder().decode(arrayBuffer))
}

export async function urlEncode(client: OAuthClient): Promise<string> {
  const string = JSON.stringify(client)
  const compressed = await compress(string)
  return btoa(String.fromCharCode(...new Uint8Array(compressed)))
}

export async function urlDecode(encoded: string): Promise<OAuthClient> {
  const byteArray = new Uint8Array(atob(encoded).split('').map((c: string) => c.charCodeAt(0)))
  const decompressed = await decompress(byteArray)
  return JSON.parse(decompressed)
}
