import titleMiniGe from '../../assets/salgados-mini-ge.png';
import '../../App.scss';

export const Header = () => {
  return (
    <div className="header-container">
      <img src={titleMiniGe} alt="Boneca Mini Gê" id="titleMiniGe" />
      <h1>Salgados da Gê</h1>
    </div>
  )
}
