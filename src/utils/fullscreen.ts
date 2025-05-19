import { ref } from 'vue'
export default function fullScreen() {
  const isFullScreen = ref(false)
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      isFullScreen.value = true
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        isFullScreen.value = false
      }
    }
  }
  return { toggleFullScreen, isFullScreen }
}
