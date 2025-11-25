"use client"

import { useEffect } from "react"

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[App] Service Worker registered:", registration.scope)

          // Check for updates periodically
          setInterval(() => {
            registration.update()
          }, 60000) // Check every minute
        })
        .catch((error) => {
          console.error("[App] Service Worker registration failed:", error)
        })
    }
  }, [])

  return null
}

// Helper function to clear image cache
export async function clearImageCache() {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel()
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success)
      }
      navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" }, [messageChannel.port2])
    })
  }
}
