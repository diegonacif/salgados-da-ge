import { Copy } from '@phosphor-icons/react';
import { useState } from 'react';
import pixImg from '../../assets/pix.svg';
import qrCode from '../../assets/QR_Code_Example.svg';

export const PixContainer = () => {

  const pixKey = 99999999999;

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
        <span>99999999999</span>
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
      <div className="pix-row">
        <h4>CPF:</h4>
        <span>***.750.257.**</span>
      </div>
    </div>
  )
}
