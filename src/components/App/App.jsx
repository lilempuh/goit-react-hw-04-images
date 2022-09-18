import { useState, useEffect } from 'react';
import Button from '../Button/Button';
import ImageGallery from '../ImageGallery/ImageGallery';
import Loader from '../Loader/Loader';
import Searchbar from '../Searchbar/Searchbar';
import ApiImages from '../../servis/Api';
import Modal from '../Modal/Modal';
import Error from '../Error/Error';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from './App.styled';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function App() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(Status.IDLE);
  const [showModal, setShowModal] = useState(false);
  const [bigImage, setBigImage] = useState('');

  useEffect(() => {
    if (!search) {
      return;
    }

    setStatus(Status.PENDING);
    if (page === 1) {
      setItems([]);
    }
    searchGallery();

    if (page > 1) {
      scroll();
    }

    function searchGallery() {
      ApiImages(search, page)
        .then(data => {
          setItems(prevItems => [...prevItems, ...data.hits]);
          setStatus(Status.RESOLVED);
          if (data.hits.length === 0) {
            setStatus(Status.REJECTED);
            setError('Sorry, there are no images matching your search query.');
            return;
          }
        })
        .catch(error => {
          setStatus(Status.REJECTED);
          setError(error);
        });
    }
  }, [page, search]);

  const scroll = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleFormSubmit = search => {
    setSearch(search);
    setPage(1);
    setItems([]);
  };

  const onLoadMore = () => {
    setPage(prevState => prevState + 1);
  };

  const openModal = image => {
    setShowModal(true);
    setBigImage(image);
  };
  const closeModal = () => {
    setShowModal(false);
    setBigImage('');
  };
  return (
    <Container>
      <Searchbar onSubmit={handleFormSubmit} />
      {status === Status.PENDING && <Loader />}
      {status === Status.REJECTED && <Error message={error} />}
      {status === Status.RESOLVED && (
        <ImageGallery images={items} onImageClick={openModal} />
      )}
      {items.length !== 0 && status === Status.RESOLVED && (
        <Button onClick={onLoadMore} />
      )}
      {showModal && (
        <Modal onClose={closeModal}>
          <img src={bigImage} alt={search} />
        </Modal>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </Container>
  );
}
