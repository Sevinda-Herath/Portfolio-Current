// Simple media preloader for videos/images
// Usage: preloadVideos([url1, url2]).then(() => { /* ready */ })

export function preloadVideos(urls) {
  if (typeof window === 'undefined') return Promise.resolve();
  const list = Array.isArray(urls) ? urls : [urls];
  const tasks = list
    .filter(Boolean)
    .map((src) =>
      new Promise((resolve) => {
        try {
          const v = document.createElement('video');
          v.preload = 'auto';
          v.src = src;
          v.oncanplaythrough = () => resolve();
          v.onloadeddata = () => resolve();
          v.onerror = () => resolve(); // resolve on error to avoid blocking
          // Trigger load
          // Some browsers require calling load() explicitly
          v.load?.();
        } catch {
          resolve();
        }
      })
    );
  return Promise.all(tasks).then(() => undefined);
}
