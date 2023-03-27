import titleMiniGe from '../../assets/salgados-mini-ge.png';
import smoke from '../../assets/smoke.png';

import '../../App.scss';

export const Header = () => {
  return (
    <div className="header-container">
      <img src={titleMiniGe} alt="Boneca Mini Gê" id="titleMiniGe" />
      <h1>Salgados da Gê</h1>
      <div className="smoke-wrapper">
        <img className="smoke" src={smoke} alt="smoke" />
      </div>
      <div className="smoke-wrapper">
        <img className="smoke2" src={smoke} alt="smoke" />
      </div>
      <div className="smoke-wrapper">
        <img className="smoke3" src={smoke} alt="smoke" />
      </div>
    </div>
  )
}
