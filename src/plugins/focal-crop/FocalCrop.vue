<template>
  <div class="focal-crop-plugin">
    <div class="plugin-container">
      <div class="upload-section">
        <h3>Upload Image</h3>
        <div class="upload-area" @dragover.prevent @drop="handleDrop">
          <input
            type="file"
            ref="fileInput"
            accept="image/jpeg"
            @change="handleFileSelect"
            style="display: none"
          />
          <button @click="(fileInput as any)?.click()" class="upload-btn">
            Click to upload or drag JPEG image
          </button>
        </div>
      </div>

      <div v-if="imageInfo" class="info-section">
        <h3>Image Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Focal Length:</span>
            <span class="value">{{ imageInfo.focalLength || 'Not available' }} mm</span>
          </div>
          <div class="info-item">
            <span class="label">Camera Model:</span>
            <span class="value">{{ imageInfo.model || 'Not available' }}</span>
          </div>
          <div class="info-item">
            <span class="label">ISO:</span>
            <span class="value">{{ imageInfo.iso || 'Not available' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Aperture:</span>
            <span class="value">{{ imageInfo.aperture || 'Not available' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Shutter Speed:</span>
            <span class="value">{{ imageInfo.shutterSpeed || 'Not available' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Original Dimensions:</span>
            <span class="value">{{ imageInfo.width }} × {{ imageInfo.height }} px</span>
          </div>
        </div>
      </div>

      <div v-if="originalImage" class="crop-section">
        <h3>Crop by Focal Length</h3>
        
        <div class="controls">
          <label>
            Select Focal Length:
            <input
              v-model.number="selectedFocalLength"
              type="number"
              min="1"
              step="0.1"
              class="focal-input"
            />
            mm
          </label>
        </div>

        <div class="preview-container">
          <div class="preview-wrapper">
            <p class="preview-label">Original</p>
            <div class="image-preview">
              <img :src="originalImage" alt="Original" />
            </div>
          </div>

          <div class="preview-wrapper">
            <p class="preview-label">Cropped ({{ selectedFocalLength }} mm)</p>
            <div class="image-preview">
              <canvas ref="croppedCanvas" />
            </div>
          </div>
        </div>

        <div class="download-section">
          <button @click="downloadCropped" class="download-btn">
            Download Cropped Image
          </button>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { parseExif } from './exif'

interface ImageInfo {
  focalLength?: number
  model?: string
  iso?: number
  aperture?: string
  shutterSpeed?: string
  width: number
  height: number
}

const fileInput = ref<HTMLInputElement>()
const croppedCanvas = ref<HTMLCanvasElement>()
const originalImage = ref<string>('')
const imageInfo = ref<ImageInfo | null>(null)
const selectedFocalLength = ref<number>(50)
const error = ref<string>('')

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    await processImage(file)
  }
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files?.[0]) {
    await processImage(files[0])
  }
}

const processImage = async (file: File) => {
  error.value = ''
  
  if (file.type !== 'image/jpeg') {
    error.value = 'Please upload a JPEG image'
    return
  }

  try {
    // Read EXIF data
    const exifData = await parseExif(file)
    
    // Create image data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      originalImage.value = dataUrl

      // Load image to get dimensions
      const img = new Image()
      img.onload = () => {
        imageInfo.value = {
          ...exifData,
          width: img.width,
          height: img.height,
          focalLength: exifData.focalLength || 50
        }
        
        // Set default focal length from EXIF if available
        if (exifData.focalLength) {
          selectedFocalLength.value = exifData.focalLength
        }

        // Draw initial crop
        updateCrop()
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  } catch (err) {
    error.value = 'Error processing image'
    console.error(err)
  }
}

const updateCrop = () => {
  if (!croppedCanvas.value || !originalImage.value || !imageInfo.value) return

  const img = new Image()
  img.onload = () => {
    const canvas = croppedCanvas.value!
    const focalLength = selectedFocalLength.value
    
    // Calculate crop based on focal length
    // Longer focal length = more zoomed in = smaller viewing angle
    // We'll use a simple model: focal length affects zoom ratio
    const zoomRatio = focalLength / (imageInfo.value?.focalLength || 50)
    
    // Calculate new dimensions
    const newWidth = img.width / zoomRatio
    const newHeight = img.height / zoomRatio
    
    // Center crop
    const x = (img.width - newWidth) / 2
    const y = (img.height - newHeight) / 2
    
    canvas.width = newWidth
    canvas.height = newHeight
    
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, x, y, newWidth, newHeight, 0, 0, newWidth, newHeight)
  }
  img.src = originalImage.value
}

const downloadCropped = () => {
  if (!croppedCanvas.value) return

  const link = document.createElement('a')
  link.href = croppedCanvas.value.toDataURL('image/jpeg', 0.95)
  link.download = `focal-crop-${selectedFocalLength.value}mm.jpg`
  link.click()
}

// Watch focal length changes
import { watch } from 'vue'
watch(() => selectedFocalLength.value, () => {
  updateCrop()
})
</script>

<style scoped>
.focal-crop-plugin {
  width: 100%;
  padding: 20px 0;
}

.plugin-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.upload-section h3,
.info-section h3,
.crop-section h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 20px;
}

.upload-area {
  background-color: #f5f7fa;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
}

.upload-btn {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #764ba2;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item .label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  font-weight: 500;
}

.info-item .value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.controls {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
}

.focal-input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  width: 100px;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.preview-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-label {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.image-preview {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  max-height: 500px;
}

.image-preview img,
.image-preview canvas {
  max-width: 100%;
  max-height: 100%;
  display: block;
}

.download-section {
  display: flex;
  justify-content: center;
}

.download-btn {
  background-color: #48bb78;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.download-btn:hover {
  background-color: #38a169;
}

.error-message {
  background-color: #fed7d7;
  color: #c53030;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #c53030;
}
</style>
