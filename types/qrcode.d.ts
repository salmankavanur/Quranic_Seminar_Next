declare module 'qrcode' {
  interface QRCodeToDataURLOptions {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    margin?: number;
    width?: number;
  }

  function toDataURL(
    data: string,
    options?: QRCodeToDataURLOptions
  ): Promise<string>;

  export { toDataURL };
  export default { toDataURL };
} 