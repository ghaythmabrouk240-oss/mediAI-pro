'use client'

import { useState } from 'react'
import { Code, Copy, Check, ExternalLink } from 'lucide-react'

export default function IntegrationGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const integrationCode = `
<!-- MediAI Pro Integration Script -->
<script src="https://your-domain.com/mediAI-pro.js"></script>
<script>
  MediAIPro.init({
    apiKey: 'your-api-key',
    theme: 'medical', // medical, modern, dark, light
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    features: ['chat', 'voice', 'files', 'reports'],
    patientId: 'optional-patient-id',
    onReady: function() {
      console.log('MediAI Pro loaded successfully');
    }
  });
</script>
  `.trim()

  const reactIntegrationCode = `
// React Component Integration
import { MediAIProvider, FloatingMediAIBall } from '@mediAI-pro/react';

function App() {
  return (
    <MediAIProvider
      apiKey="your-api-key"
      config={{
        theme: 'medical',
        features: ['chat', 'voice', 'files', 'reports']
      }}
    >
      <YourApp />
      <FloatingMediAIBall />
    </MediAIProvider>
  );
}
  `.trim()

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const integrationMethods = [
    {
      id: 'html',
      name: 'HTML Website',
      code: integrationCode,
      description: 'Add to any website with simple script tag'
    },
    {
      id: 'react',
      name: 'React Application',
      code: reactIntegrationCode,
      description: 'React components for seamless integration'
    },
    {
      id: 'api',
      name: 'REST API',
      code: 'POST /api/mediAI/chat\nContent-Type: application/json\n\n{\n  "message": "Patient symptoms",\n  "patientId": "123",\n  "context": {}\n}',
      description: 'Direct API integration for custom applications'
    }
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h3 className="font-bold text-lg text-foreground mb-2">Integrate MediAI Pro</h3>
        <p className="text-sm text-muted-foreground">
          Add advanced medical AI to any healthcare application
        </p>
      </div>

      {/* Integration Methods */}
      <div className="space-y-4">
        {integrationMethods.map((method) => (
          <div key={method.id} className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{method.name}</h4>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(method.code, method.id)}
                  className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  {copied === method.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied === method.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <pre className="p-4 bg-background text-sm overflow-x-auto">
              <code>{method.code}</code>
            </pre>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-500/10 rounded-lg text-center">
          <Code className="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <div className="text-sm font-medium text-foreground">Easy Setup</div>
          <div className="text-xs text-muted-foreground">5 minutes</div>
        </div>
        <div className="p-3 bg-green-500/10 rounded-lg text-center">
          <div className="text-sm font-medium text-foreground">HIPAA Ready</div>
          <div className="text-xs text-muted-foreground">Compliant</div>
        </div>
        <div className="p-3 bg-purple-500/10 rounded-lg text-center">
          <div className="text-sm font-medium text-foreground">Multi-Platform</div>
          <div className="text-xs text-muted-foreground">Web & Mobile</div>
        </div>
        <div className="p-3 bg-orange-500/10 rounded-lg text-center">
          <div className="text-sm font-medium text-foreground">Customizable</div>
          <div className="text-xs text-muted-foreground">Brand & Theme</div>
        </div>
      </div>

      {/* Documentation Link */}
      <div className="text-center">
        <button className="flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors">
          <ExternalLink className="w-4 h-4" />
          View Full Documentation
        </button>
      </div>
    </div>
  )
}
