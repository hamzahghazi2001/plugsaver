// filepath: plugsaver/plug-saver2.0/react-qr-scanner.d.ts
declare module 'react-qr-scanner' {
    import { Component } from 'react';
  
    interface QrScannerProps {
      delay?: number;
      onScan?: (data: any) => void;
      onError?: (error: any) => void;
      style?: React.CSSProperties;
      facingMode?: 'user' | 'environment';
      className?: string;
    }
  
    export default class QrScanner extends Component<QrScannerProps> {}
  }
