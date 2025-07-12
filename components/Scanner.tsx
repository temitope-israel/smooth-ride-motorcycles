// "use client";

// import { Html5Qrcode } from "html5-qrcode";
// import { useEffect, useRef } from "react";

// interface ScannerProps {
//   onScanSuccess: (data: string) => void;
// }

// export default function Scanner({ onScanSuccess }: ScannerProps) {
//   const scannerId = "reader";
//   const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
//   const scannerStartedRef = useRef(false); // Track if scanner actually started

//   useEffect(() => {
//     const html5QrCode = new Html5Qrcode(scannerId);
//     html5QrCodeRef.current = html5QrCode;

//     const startScanner = async () => {
//       try {
//         await html5QrCode.start(
//           { facingMode: "environment" },
//           {
//             fps: 10,
//             qrbox: { width: 400, height: 150 },
//             //aspectRatio: 1.7778,
//           },
//           (decodedText) => {
//             html5QrCode.stop().then(() => {
//               scannerStartedRef.current = false;
//               onScanSuccess(decodedText);
//             });
//           },
//           (errorMessage) => {
//             console.warn("Scan error:", errorMessage);
//           }
//         );
//         scannerStartedRef.current = true;
//       } catch (err) {
//         console.error("Failed to start scanner:", err);
//       }
//     };

//     const timeout = setTimeout(() => {
//       const reader = document.getElementById(scannerId);
//       if (reader) {
//         startScanner();
//       } else {
//         console.error("Reader container not found");
//       }
//     }, 300);

//     return () => {
//       clearTimeout(timeout);
//       if (scannerStartedRef.current && html5QrCodeRef.current) {
//         html5QrCodeRef.current
//           .stop()
//           .then(() => {
//             scannerStartedRef.current = false;
//             console.log("Scanner stopped successfully.");
//           })
//           .catch((err) => console.error("Error stopping scanner:", err));
//       }
//     };
//   }, [onScanSuccess]);

//   return (
//     <div
//       id={scannerId}
//       style={{
//         width: "400px",
//         maxWidth: "400px",
//         height: "300px",
//         margin: "0 auto",
//         border: "2px dashed #ccc",
//         borderRadius: "8px",
//         backgroundColor: "#000",
//         position: "relative",
//         zIndex: 10,
//         overflow: "hidden",
//       }}
//     />
//   );
// }

// "use client";

// import { useEffect, useRef } from "react";
// import {
//   BrowserMultiFormatReader,
//   DecodeHintType,
//   BarcodeFormat,
// } from "@zxing/browser";

// interface ScannerProps {
//   onScanSuccess: (data: string) => void;
// }

// export default function Scanner({ onScanSuccess }: ScannerProps) {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

//   useEffect(() => {
//     const codeReader = new BrowserMultiFormatReader();
//     codeReaderRef.current = codeReader;

//     const startScanner = async () => {
//       try {
//         await codeReader.decodeFromVideoDevice(
//           undefined,
//           videoRef.current!,
//           (result, err) => {
//             if (result) {
//               console.log("Barcode detected:", result.getText());
//               onScanSuccess(result.getText());

//               // Stop scanning
//               codeReader.stopContinuousDecode();
//               if (videoRef.current?.srcObject) {
//                 const tracks = (
//                   videoRef.current.srcObject as MediaStream
//                 ).getTracks();
//                 tracks.forEach((track) => track.stop());
//               }
//             }
//           }
//         );
//       } catch (error) {
//         console.error("Error starting scanner:", error);
//       }
//     };

//     startScanner();

//     return () => {
//       try {
//         codeReader.stopContinuousDecode();
//         if (videoRef.current?.srcObject) {
//           const tracks = (
//             videoRef.current.srcObject as MediaStream
//           ).getTracks();
//           tracks.forEach((track) => track.stop());
//         }
//       } catch (err) {
//         console.warn("Scanner cleanup failed:", err);
//       }
//     };
//   }, [onScanSuccess]);

//   return (
//     <div className="w-full max-w-md mx-auto">
//       <video
//         ref={videoRef}
//         className="w-full border border-gray-300 rounded shadow"
//         style={{ backgroundColor: "#000" }}
//         muted
//         autoPlay
//         playsInline
//       />
//       <p className="text-center text-sm text-gray-500 mt-2">
//         Align barcode within the box
//       </p>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import {
//   BrowserMultiFormatReader,
//   BarcodeFormat,
//   DecodeHintType,
//   Result,
// } from "@zxing/library";

// interface ScannerProps {
//   onScanSuccess: (data: string) => void;
// }

// export default function Scanner({ onScanSuccess }: ScannerProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
//   const [scanMessage, setScanMessage] = useState("📷 Waiting for scan...");

//   useEffect(() => {
//     const codeReader = new BrowserMultiFormatReader();
//     codeReaderRef.current = codeReader;

//     const constraints: MediaStreamConstraints = {
//       video: {
//         facingMode: { ideal: "environment" },
//         width: { ideal: 1280 },
//         height: { ideal: 720 },
//       },
//       audio: false,
//     };

//     let activeStream: MediaStream | null = null;

//     navigator.mediaDevices
//       .getUserMedia(constraints)
//       .then((stream) => {
//         activeStream = stream;
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();

//           codeReader.decodeFromVideoElementContinuously(
//             videoRef.current,
//             (result: Result | undefined, error: Error | undefined) => {
//               if (result) {
//                 const text = result.getText();
//                 setScanMessage("✅ Scan successful!");
//                 onScanSuccess(text);

//                 // Stop scanner and stream
//                 codeReader.reset();
//                 activeStream?.getTracks().forEach((track) => track.stop());

//                 // Clear message after a few seconds
//                 setTimeout(() => setScanMessage(""), 3000);
//               }
//               // We silently ignore decode errors
//             }
//           );
//         }
//       })
//       .catch((err) => {
//         console.error("Camera access error:", err);
//         setScanMessage(`🚫 Camera error: ${err.message}`);
//       });

//     return () => {
//       codeReader.reset();
//       activeStream?.getTracks().forEach((track) => track.stop());
//     };
//   }, [onScanSuccess]);

//   return (
//     <div className="relative w-full max-w-md mx-auto mt-4">
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         playsInline
//         className="w-full border-2 border-gray-400 rounded"
//       />

//       {/* Green outline overlay */}
//       <div className="absolute top-1/2 left-1/2 w-64 h-20 border-4 border-green-500 rounded transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

//       {/* Scan message */}
//       {scanMessage && (
//         <p className="mt-3 text-center text-sm text-blue-600">{scanMessage}</p>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
  Result,
} from "@zxing/library";

interface ScannerProps {
  onScanSuccess: (data: string) => void;
}

export default function Scanner({ onScanSuccess }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [scanMessage, setScanMessage] = useState("📷 Waiting for scan...");

  useEffect(() => {
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.EAN_13,
      BarcodeFormat.UPC_A,
    ]);

    const codeReader = new BrowserMultiFormatReader(hints);
    codeReaderRef.current = codeReader;

    let activeStream: MediaStream | null = null;

    const startScanner = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        if (videoInputDevices.length === 0) {
          throw new Error("No video input devices found");
        }

        // Use the back camera if available
        const backCamera = videoInputDevices.find((d) =>
          d.label.toLowerCase().includes("back")
        );

        const selectedDeviceId =
          backCamera?.deviceId || videoInputDevices[0].deviceId;

        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result: Result | undefined, error: Error | undefined) => {
            if (result) {
              const text = result.getText();
              console.log("Scanned:", text);
              setScanMessage("✅ Scan successful!");
              onScanSuccess(text);

              codeReader.reset();
              if (videoRef.current?.srcObject) {
                const tracks = (
                  videoRef.current.srcObject as MediaStream
                ).getTracks();
                tracks.forEach((track) => track.stop());
              }

              setTimeout(() => setScanMessage(""), 3000);
            }
          }
        );
      } catch (err: any) {
        console.error("Camera error:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setScanMessage(`🚫 Camera error: ${errorMessage}`);
      }
    };

    startScanner();

    return () => {
      codeReader.reset();
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="relative w-full max-w-md mx-auto mt-4">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full border-2 border-gray-400 rounded"
      />
      <div className="absolute top-1/2 left-1/2 w-64 h-20 border-4 border-green-500 rounded transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      {scanMessage && (
        <p className="mt-3 text-center text-sm text-blue-600">{scanMessage}</p>
      )}
    </div>
  );
}
