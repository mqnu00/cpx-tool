/**
 * Simple EXIF data parser for JPEG images
 */

interface ExifData {
  focalLength?: number
  model?: string
  iso?: number
  aperture?: string
  shutterSpeed?: string
}

export async function parseExif(file: File): Promise<ExifData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer
        const view = new DataView(buffer)
        
        // Check JPEG signature
        if (view.getUint8(0) !== 0xff || view.getUint8(1) !== 0xd8) {
          resolve({})
          return
        }

        // Find EXIF marker
        let offset = 2
        while (offset < buffer.byteLength) {
          if (view.getUint8(offset) !== 0xff) {
            offset++
            continue
          }

          const marker = view.getUint8(offset + 1)
          
          // APP1 marker (EXIF)
          if (marker === 0xe1) {
            const exifStart = offset + 4
            
            // Check EXIF identifier
            const exifId = String.fromCharCode(
              view.getUint8(exifStart),
              view.getUint8(exifStart + 1),
              view.getUint8(exifStart + 2),
              view.getUint8(exifStart + 3),
              view.getUint8(exifStart + 4)
            )
            
            if (exifId === 'Exif\0') {
              const exifData = parseExifData(
                buffer,
                exifStart + 6
              )
              resolve(exifData)
              return
            }
          }
          
          offset += 2 + view.getUint16(offset + 2, false)
        }
        
        resolve({})
      } catch (err) {
        reject(err)
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file.slice(0, 100 * 1024)) // Read first 100KB
  })
}

function parseExifData(
  buffer: ArrayBuffer,
  start: number
): ExifData {
  const view = new DataView(buffer)
  
  // Check byte order (TIFF header)
  const byteOrder = view.getUint16(start, false)
  const littleEndian = byteOrder === 0x4949 // 'II'
  
  // Get offset to first IFD
  const ifdOffset = start + view.getUint32(start + 4, littleEndian)
  
  const exifData: ExifData = {}
  
  // Parse first IFD
  const numTags = view.getUint16(ifdOffset, littleEndian)
  
  for (let i = 0; i < numTags; i++) {
    const tagOffset = ifdOffset + 2 + i * 12
    
    const tag = view.getUint16(tagOffset, littleEndian)
    const valueOffset = tagOffset + 8
    
    try {
      let value: any
      
      switch (tag) {
        case 0x010f: // Make
        case 0x0110: // Model
          value = readString(view, valueOffset)
          if (tag === 0x0110) exifData.model = value
          break
          
        case 0x8827: // ISO
          value = view.getUint16(valueOffset, littleEndian)
          exifData.iso = value
          break
          
        case 0x920a: // Focal Length
          const numerator = view.getUint32(valueOffset, littleEndian)
          const denominator = view.getUint32(valueOffset + 4, littleEndian)
          if (denominator !== 0) {
            exifData.focalLength = Math.round((numerator / denominator) * 10) / 10
          }
          break
          
        case 0x9201: // Shutter Speed
          value = readRational(view, valueOffset, littleEndian)
          if (value) {
            exifData.shutterSpeed = formatShutterSpeed(value)
          }
          break
          
        case 0x9202: // Aperture
          value = readRational(view, valueOffset, littleEndian)
          if (value) {
            const fNumber = Math.pow(2, value / 2)
            exifData.aperture = `f/${fNumber.toFixed(1)}`
          }
          break
      }
    } catch (err) {
      // Skip malformed tags
      continue
    }
  }
  
  return exifData
}

function readString(
  view: DataView,
  offset: number
): string {
  let value = ''
  for (let i = 0; i < 4; i++) {
    const byte = view.getUint8(offset + i)
    if (byte === 0) break
    value += String.fromCharCode(byte)
  }
  return value
}

function readRational(
  view: DataView,
  offset: number,
  littleEndian: boolean
): number | null {
  const numerator = view.getUint32(offset, littleEndian)
  const denominator = view.getUint32(offset + 4, littleEndian)
  return denominator !== 0 ? numerator / denominator : null
}

function formatShutterSpeed(value: number): string {
  const shutter = Math.pow(2, -value)
  if (shutter >= 1) {
    return `${Math.round(shutter * 10) / 10}"`
  }
  const denominator = Math.round(1 / shutter)
  return `1/${denominator}`
}
