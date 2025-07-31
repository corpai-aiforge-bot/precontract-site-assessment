export {};

declare global {
  interface Window {
    google: typeof google;
  }

  namespace JSX {
    interface IntrinsicElements {
      'gmpx-place-autocomplete': any;
    }
  }
}
