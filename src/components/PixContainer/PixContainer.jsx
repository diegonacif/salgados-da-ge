import { Copy } from '@phosphor-icons/react';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import pixImg from '../../assets/pix.svg';
import qrCode from '../../assets/QR_Code_Example.svg';

export const PixContainer = () => {

  const pixKey = 99999999999;

  const copyToClipboard = () => {
    navigator.clipboard.writeText("this.state.textToCopy");
    alert(`Chave pix copiada para área de transferência.`);
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
