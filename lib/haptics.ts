export function vibrateTap(): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(15);
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }
}

export function vibrateSelect(): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(25);
    } catch {
      // Ignore
    }
  }
}

export function vibrateSuccess(): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([30, 40, 60]);
    } catch {
      // Ignore
    }
  }
}

export function vibrateDecide(): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([50, 50, 50, 50, 120]);
    } catch {
      // Ignore
    }
  }
}
