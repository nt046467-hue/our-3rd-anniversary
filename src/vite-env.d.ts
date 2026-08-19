/// <reference types="vite/client" />

// Extend video element with non-standard but widely-supported attributes
declare namespace React {
  interface VideoHTMLAttributes<T> {
    controlsList?: string;
    disablePictureInPicture?: boolean;
    disableRemotePlayback?: boolean;
  }
}
