'use client';

import React, { useState } from 'react';
import { generateQRCodeSVG } from '../lib/qr';
import {
  CloseIcon,
  CopyIcon,
  CheckIcon,
  ShareIcon,
  QrCodeIcon,
  WhatsAppIcon,
  TelegramIcon,
  DownloadIcon,
} from './Icons';
import { vibrateTap, vibrateSuccess } from '../lib/haptics';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  pollTitle: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  url,
  pollTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const svgString = generateQRCodeSVG(url, {
    size: 200,
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    margin: 2,
  });

  const shareText = `Vote on "${pollTitle}" with the squad!\n\nTap link to cast your vote:\n${url}`;

  const handleCopy = async () => {
    vibrateTap();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setToastMessage('Link copied to clipboard! Ready to paste into chat.');
      vibrateSuccess();
      setTimeout(() => {
        setCopied(false);
        setToastMessage('');
      }, 2500);
    } catch {
      // Fallback
      setToastMessage('Failed to copy link');
      setTimeout(() => setToastMessage(''), 2000);
    }
  };

  const handleWhatsApp = () => {
    vibrateTap();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  };

  const handleTelegram = () => {
    vibrateTap();
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Vote on "${pollTitle}" with the squad!`)}`;
    window.open(tgUrl, '_blank');
  };

  const handleDownloadQR = () => {
    vibrateTap();
    try {
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const cleanName = pollTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
      a.download = `votepop-${cleanName}-qr.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      vibrateSuccess();
      setToastMessage('QR code downloaded as SVG!');
      setTimeout(() => setToastMessage(''), 2000);
    } catch {
      setToastMessage('Could not download QR code');
      setTimeout(() => setToastMessage(''), 2000);
    }
  };

  const handleNativeShare = async () => {
    vibrateTap();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Vote on: ${pollTitle}`,
          text: `Cast your vote on "${pollTitle}" with the squad!`,
          url: url,
        });
        vibrateSuccess();
      } catch {
        // User cancelled or share dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-5 sm:p-6 rounded-3xl overflow-hidden my-auto max-h-[94vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00E5FF] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
              <QrCodeIcon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg uppercase tracking-tight text-black leading-none">
                Share With Squad
              </h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">
                Scan or send link
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              vibrateTap();
              onClose();
            }}
            className="w-8 h-8 rounded-lg border-2 border-black bg-[#FF6EA7] flex items-center justify-center font-bold shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-3 p-2 bg-[#CEFF00] border-2 border-black rounded-xl text-center text-xs font-black text-black shadow-[1.5px_1.5px_0px_#000] animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Poll Title Badge */}
        <div className="mb-3.5 p-2 bg-[#FFE600]/30 border-2 border-black rounded-xl text-center">
          <p className="font-black text-[10px] uppercase tracking-wider text-gray-700">Poll Question</p>
          <p className="font-extrabold text-xs sm:text-sm text-black truncate">{pollTitle}</p>
        </div>

        {/* QR Code Card */}
        <div className="flex flex-col items-center p-3.5 bg-[#CEFF00] border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000] mb-4">
          <div
            className="p-2.5 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]"
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
          <p className="text-[10px] font-black uppercase tracking-wider text-black mt-2 text-center">
            Scan with phone camera to vote
          </p>
        </div>

        {/* Quick Instant Share Actions */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#25D366] text-white font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#1EBE5D] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <WhatsAppIcon size={18} />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleTelegram}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#0088CC] text-white font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#0077B5] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <TelegramIcon size={18} />
            <span>Telegram</span>
          </button>
        </div>

        {/* Link Input & Copy */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-[11px] font-bold text-gray-800 select-all"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 px-3 py-2 bg-[#FFE600] text-black font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 cursor-pointer"
          >
            {copied ? (
              <>
                <CheckIcon size={14} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Utility Actions: Native Share & Download */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleNativeShare}
            className="py-2 px-2 bg-[#00E5FF] text-black font-black text-[11px] uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <ShareIcon size={14} />
            <span>More Apps</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadQR}
            className="py-2 px-2 bg-white text-black font-black text-[11px] uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <DownloadIcon size={14} />
            <span>Save QR SVG</span>
          </button>
        </div>

      </div>
    </div>
  );
};
