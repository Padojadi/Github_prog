'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface BookingQRCodeProps {
  qrCodeData: string
  bookingId: string
}

export function BookingQRCode({ qrCodeData, bookingId }: BookingQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && qrCodeData) {
      QRCode.toCanvas(canvasRef.current, qrCodeData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
    }
  }, [qrCodeData])

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `qrcode-${bookingId}.png`
      link.href = url
      link.click()
    }
  }

  const parsedData = JSON.parse(qrCodeData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code de la Réservation</CardTitle>
        <CardDescription>
          Présentez ce QR code à l&apos;entrée du salon
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center p-4 bg-white rounded-lg">
          <canvas ref={canvasRef} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium text-muted-foreground">Salon:</span>
            <span>{parsedData.lounge_name}</span>

            <span className="font-medium text-muted-foreground">Client:</span>
            <span>{parsedData.customer_name}</span>

            <span className="font-medium text-muted-foreground">Début:</span>
            <span>{new Date(parsedData.start_time).toLocaleString('fr-FR')}</span>

            <span className="font-medium text-muted-foreground">Fin:</span>
            <span>{new Date(parsedData.end_time).toLocaleString('fr-FR')}</span>

            <span className="font-medium text-muted-foreground">Invités:</span>
            <span>{parsedData.num_guests}</span>
          </div>

          {parsedData.amenities && parsedData.amenities.length > 0 && (
            <div>
              <span className="font-medium text-muted-foreground">Services:</span>
              <p className="text-xs mt-1">{parsedData.amenities.join(', ')}</p>
            </div>
          )}
        </div>

        <Button onClick={handleDownload} className="w-full" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Télécharger le QR Code
        </Button>
      </CardContent>
    </Card>
  )
}
