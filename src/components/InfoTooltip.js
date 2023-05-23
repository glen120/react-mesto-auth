import successPicture from "../images/success-pict.svg";
import failurePicture from "../images/failure-pict.svg";

export default function InfoTooltip({successReg, isOpen, onClose, onCloseByClick}) {
    const img = successReg ? successPicture : failurePicture;
    const sign = successReg ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.';

    return (
        <div className={`popup popup_tooltip` + (isOpen && " popup_opened")} onMouseDown={onCloseByClick}>
            <div className="popup__container popup__tooltip-container">
                <button className="popup__close-button"
                        type="button"
                        aria-label="Закрыть"
                        onClick={onClose}></button>
                <img className="popup__tooltip-image" src={img} alt={sign} />
                <p className="popup__tooltip-sign">{sign}</p>
            </div>
        </div>
    )
}