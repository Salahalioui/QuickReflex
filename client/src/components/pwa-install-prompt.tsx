import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/use-pwa';

export function PWAInstallPrompt() {
  const { isInstallable, handleInstall } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 bg-dark-surface border-electric-blue shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-electric-blue rounded-lg flex items-center justify-center">
              <Download className="text-[var(--dark-bg)]" size={20} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">Install RT Trainer</div>
              <div className="text-xs text-secondary">
                Get the full app experience with offline access
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              data-testid="button-install-pwa"
              onClick={handleInstall}
              size="sm"
              className="bg-electric-blue hover:bg-electric-blue-dark text-[var(--dark-bg)] font-semibold px-4 py-2"
            >
              Install
            </Button>
            <Button
              data-testid="button-dismiss-install"
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="p-2"
            >
              <X className="text-secondary" size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}