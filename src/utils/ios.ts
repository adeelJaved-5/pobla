export default function isIOS() {
  // return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}
