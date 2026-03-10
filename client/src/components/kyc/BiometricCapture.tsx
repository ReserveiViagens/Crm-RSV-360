import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BiometricCaptureProps {
  onCaptureSuccess: (imageData: string) => void;
}

export function BiometricCapture({ onCaptureSuccess }: BiometricCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"camera" | "preview" | "success">("camera");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setStep("preview");
    }
  }, []);

  const retry = () => {
    setCapturedImage(null);
    setStep("camera");
  };

  const confirm = async () => {
    if (!capturedImage) return;
    setProcessing(true);
    // Simulate biometric processing (500ms delay)
    await new Promise((r) => setTimeout(r, 1500));
    setProcessing(false);
    setStep("success");
    onCaptureSuccess(capturedImage);
  };

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-10 text-center" data-testid="biometric-success">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-in zoom-in duration-300">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Biometria capturada!</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Sua foto foi registrada. Estamos processando sua verificação de identidade.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="biometric-capture">
      {step === "camera" && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] max-w-sm mx-auto">
            {cameraError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground gap-3">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm font-medium text-center px-4">Câmera não encontrada ou sem permissão.<br />Permita o acesso à câmera no navegador.</p>
              </div>
            ) : (
              <>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user", width: 640, height: 480 }}
                  onUserMediaError={() => setCameraError(true)}
                  className="w-full h-full object-cover"
                  mirrored
                />
                {/* Oval silhouette overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-44 h-56 rounded-full border-4 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />
                </div>
                <div className="absolute bottom-3 left-0 right-0 text-center">
                  <span className="text-white text-xs font-semibold bg-black/50 rounded-full px-3 py-1">
                    Posicione seu rosto no oval
                  </span>
                </div>
              </>
            )}
          </div>
          <Button
            onClick={capture}
            disabled={cameraError}
            className="w-full h-12 rounded-xl font-bold gap-2"
            data-testid="btn-capture-photo"
          >
            <Camera className="w-4 h-4" />
            Capturar foto
          </Button>
        </div>
      )}

      {step === "preview" && capturedImage && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden max-w-sm mx-auto border-2 border-primary">
            <img src={capturedImage} alt="Foto capturada" className="w-full object-cover" />
            <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold rounded-full px-2.5 py-1">
              Prévia
            </div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            A foto está nítida e seu rosto visível? Confirme ou tire outra.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={retry} className="flex-1 rounded-xl gap-2 h-11" data-testid="btn-retry-photo">
              <RefreshCw className="w-4 h-4" /> Repetir
            </Button>
            <Button onClick={confirm} disabled={processing} className="flex-1 rounded-xl gap-2 h-11" data-testid="btn-confirm-photo">
              {processing ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</> : <><CheckCircle2 className="w-4 h-4" /> Confirmar</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
