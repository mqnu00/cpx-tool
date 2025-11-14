import type { PluginModule } from '../types'
import FocalCrop from './FocalCrop.vue'

const focalCropPlugin: PluginModule = {
  id: 'focal-crop',
  name: 'Focal Crop',
  title: 'Focal Distance Crop',
  description: 'Read JPEG EXIF data and crop images based on focal length',
  icon: '📷',
  component: FocalCrop,
  version: '1.0.0'
}

export default focalCropPlugin
