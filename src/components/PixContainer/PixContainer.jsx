import { Copy } from '@phosphor-icons/react';
import { useState } from 'react';
import pixImg from '../../assets/pix.svg';
import qrCode from '../../assets/qr-georgia.png';

export const PixContainer = () => {

  const pixKey = 87877457472;

  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = pixKey;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert("Chave pix copiada com sucesso!");
  }

  return (
    <div className="pix-container">
      <img src={pixImg} alt="pix logo" id="pix-img" />
      <img src={qrCode} alt="pix logo" id="qrcode-img" />
      <div className="pix-row">
        <h4>Chave Pix:</h4>
        <span>87877457472</span>
        <Copy 
          size={24} 
          weight="duotone" 
          onClick={() => copyToClipboard()}
        />
      </div>
      <div className="pix-row">
        <h4>Nome:</h4>
        <span>Geórgia Marylack</span>
      </div>
    </div>
  )
}
