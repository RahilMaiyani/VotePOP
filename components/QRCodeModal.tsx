'use client';

import React, { useState } from 'react';
import { generateQRCodeSVG } from '../lib/qr';
import { CloseIcon, CopyIcon, CheckIcon, ShareIcon, QrCodeIcon } from './Icons';
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

  if (!isOpen) return null;

  const svgString = generateQRCodeSVG(url, {
    size: 200,
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    margin: 2,
  });

  const handleCopy = async () => {
    vibrateTap();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      vibrateSuccess();
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
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
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-6 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00E5FF] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
              <QrCodeIcon size={18} strokeWidth={2.5} />
            </div>
            <h3 className="font-black text-lg uppercase tracking-tight text-black">
              Share Poll
            </h3>
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

        {/* Poll Title Badge */}
        <div className="mb-4 p-2.5 bg-[#FFE600]/30 border-2 border-black rounded-xl text-center">
          <p className="font-black text-xs uppercase tracking-wider text-gray-700">Poll Question</p>
          <p className="font-extrabold text-sm text-black truncate">{pollTitle}</p>
        </div>

        {/* QR Code Container */}
        <div className="flex justify-center p-4 bg-[#CEFF00] border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000] mb-5">
          <div
            className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]"
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        </div>

        {/* Link Input & Copy */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full px-3 py-2 bg-gray-50 border-2 border-black rounded-xl text-xs font-bold text-gray-800 select-all"
          />
          <button
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

        {/* Native Share Button */}
        <button
          onClick={handleNativeShare}
          className="w-full py-2.5 bg-[#00E5FF] text-black font-black text-xs uppercase border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <ShareIcon size={16} />
          <span>Share with Friends</span>
        </button>
      </div>
    </div>
  );
};
