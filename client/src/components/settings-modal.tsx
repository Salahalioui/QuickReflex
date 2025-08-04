import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { TestSettings } from '@/types/test';
import { Settings, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TestSettings;
  onSettingsChange: (settings: TestSettings) => void;
  onClearData: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onClearData
}: SettingsModalProps) {
  const handleTrialCountChange = (value: string) => {
    onSettingsChange({ ...settings, trialCount: parseInt(value) });
  };

  const handleVolumeChange = (value: number[]) => {
    onSettingsChange({ ...settings, volume: value[0] });
  };

  const handleHapticsChange = (checked: boolean) => {
    onSettingsChange({ ...settings, haptics: checked });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-surface border-dark-elevated max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="trial-count">Number of Trials</Label>
            <Select value={settings.trialCount.toString()} onValueChange={handleTrialCountChange}>
              <SelectTrigger data-testid="select-trial-count" className="bg-dark-elevated border-dark-elevated">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-elevated border-dark-elevated">
                <SelectItem value="3">3 trials</SelectItem>
                <SelectItem value="5">5 trials</SelectItem>
                <SelectItem value="10">10 trials</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Audio Volume: {settings.volume}%</Label>
            <Slider
              data-testid="slider-volume"
              value={[settings.volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="haptics">Haptic Feedback</Label>
            <Switch
              data-testid="switch-haptics"
              id="haptics"
              checked={settings.haptics}
              onCheckedChange={handleHapticsChange}
            />
          </div>
          
          <div className="pt-4 border-t border-dark-elevated">
            <Button
              data-testid="button-clear-data"
              variant="destructive"
              className="w-full"
              onClick={onClearData}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
