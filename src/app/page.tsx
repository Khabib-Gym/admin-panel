'use client';

import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Home() {
  const handleToast = () => {
    toast.success('Setup complete! Everything is working.');
  };

  return (
    <main className="min-h-screen p-8 bg-background">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Khabib Admin Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Setup complete! UI components are working.</p>
          <Input placeholder="Test input..." />
          <div className="flex gap-2">
            <Button type="button" onClick={handleToast}>
              Primary
            </Button>
            <Button type="button" variant="secondary">
              Secondary
            </Button>
            <Button type="button" variant="outline">
              Outline
            </Button>
          </div>
          <div className="flex gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
