import React from "react";

// Импортируем компоненты
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithConfirm from "./PopupWithConfirm";
import api from "../utils/api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

export default function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
    const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});
    const [deletedCard, setDeletedCard] = React.useState({});
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);

    // Получение от сервера данных профиля и начальных карточек
    React.useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([userData, initialCards]) => {
                setCurrentUser(userData);
                setCards(initialCards);
            })
            .catch((err) => console.log(err));
    }, []);

    // Обработчики открытия попапов
    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }
    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }
    function handleCardClick(card) {
        setSelectedCard(card);
        setIsImagePopupOpen(true);
    }
    function handleCardDelete(card) {
        setDeletedCard(card);
        setIsConfirmPopupOpen(true);
    }

    // Обработчик закрытия попапов
    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsImagePopupOpen(false);
        setIsConfirmPopupOpen(false);
    }

    // Закрытие попапов при клике в пустую область
    function closePopupByClick(evt) {
        if (evt.target === evt.currentTarget) {
            closeAllPopups();
        }
    }

    // Функция, изменяющая данные профиля
    function handleUpdateUser(userData) {
        api.editProfile(userData)
            .then((res) => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    // Функция, изменяющая аватар профиля
    function handleUpdateAvatar(avatarData) {
        api.editAvatar(avatarData)
            .then((res) => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    // Функция, добавляющая новую карточку
    function handleAddPlaceSubmit(cardData) {
        api.addNewCard(cardData)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    // Функция, ставящая и убирающая лайк карточке
    function handleCardLike(card) {
        const isLiked = card.likes.some(person => person._id === currentUser._id);
        api.changeLike(card._id, !isLiked)
            .then(newCard => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err) => console.log(err));
    }

    // Функция, удаляющая карточку
    function handleRemoveCard() {
        api.removeCard(deletedCard._id)
            .then(() => {
                setCards((state) => state.filter((c) => c._id !== deletedCard._id));
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div>
        <Header />
        <Main
            onEditProfile={handleEditProfileClick}
            onEditAvatar={handleEditAvatarClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
        />
        <Footer />
        <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onCloseByClick={closePopupByClick}
            onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onCloseByClick={closePopupByClick}
            onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onCloseByClick={closePopupByClick}
            onAddPlace={handleAddPlaceSubmit}
        />
        <PopupWithConfirm
            isOpen={isConfirmPopupOpen}
            onClose={closeAllPopups}
            onCloseByClick={closePopupByClick}
            onConfirm={handleRemoveCard}
        />
        <ImagePopup
            card={selectedCard}
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
            onCloseByClick={closePopupByClick}
        />
    </div>
    </CurrentUserContext.Provider>
  );
}