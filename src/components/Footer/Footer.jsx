import { useState } from "react";
import { InstagramLogo, LinkedinLogo, QrCode, WhatsappLogo } from "@phosphor-icons/react"
import { PixContainer } from "../PixContainer/PixContainer";
import Rodal from "rodal";

export const Footer = () => {
  const [isPixRodalOpen, setIsPixRodalOpen] = useState(false);

  const modalProductHandlerStyles = {
    height: 'max-content',
    width: '400px',
    maxWidth: '90vw'
  };

  return (
    <div className="footer-container">
      <header>
        <div className="social-wrapper">
          <span>Onde nos encontrar</span>
          <div className="social-icons">
            <a href="https://instagram.com/ge_salgados1?igshid=YmMyMTA2M2Y=">
              <InstagramLogo size={32} weight="duotone" />
            </a>
            <a href="https://wa.me/message/QQBWQREHFCQRE1">
              <WhatsappLogo size={32} weight="duotone" />
            </a>
          </div>
        </div>
        <div className="pix-wrapper">
          <span>Nosso Pix</span>
          <QrCode 
            size={32} 
            weight="duotone" 
            onClick={() => setIsPixRodalOpen(true)}
          />
        </div>
      </header>
      <div className="copyright-wrapper">
        <span>Desenvolvido por <a href="https://www.linkedin.com/in/diego-nacif">Diego Nacif</a></span>
        
        {/* <LinkedinLogo size={28} weight="duotone" /> */}
      </div>
      <Rodal
        visible={isPixRodalOpen}
        onClose={() => setIsPixRodalOpen(false)}
        className='rodal-pix'
        id='rodal-pix-content'
        animation='zoom'
        duration={300}
        showMask={true}
        closeMaskOnClick={true}
        showCloseButton={true}
        closeOnEsc={true}
        customStyles={modalProductHandlerStyles}
      >
        <PixContainer />
      </Rodal>
    </div>
  )
}
