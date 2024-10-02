import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './DetailStyle.scss';
import './UserDetail.scss';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Obtén la ubicación actual
  const [userDetail, setUserDetail] = useState(null);
  const messagesSent = location.state?.messagesSent || 0; // Accede al conteo de mensajes enviados

  useEffect(() => {
    // Intenta obtener el detalle del usuario desde el localStorage
    const storedUser = localStorage.getItem(`user_${id}`);
    if (storedUser) {
      setUserDetail(JSON.parse(storedUser));
    } else {
      // Si no se encuentra en el localStorage, puedes hacer una solicitud a la API
      // Cambia esta línea según la API que uses
      fetch(`https://randomuser.me/api/?results=1`)
        .then((resp) => resp.json())
        .then((respData) => {
          setUserDetail(respData.results[0]); // Suponiendo que la respuesta es un arreglo
        })
        .catch((error) => {
          console.log('Error en la solicitud de la API', error);
        });
    }
  }, [id]);

  if (!userDetail) {
    return <div>Loading...</div>; // O un indicador de carga
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='user-detail-container'>
      <div className="user-detail">
        <h2>User Details</h2>
        <img src={userDetail.picture.large} alt={`${userDetail.name.first} ${userDetail.name.last}`} />
        <p>Title: {userDetail.name.title}</p>
        <p>First Name: {userDetail.name.first}</p>
        <p>Last Name: {userDetail.name.last}</p>
        <p>Email: {userDetail.email}</p>
        <p>Age: {userDetail.dob.age}</p>
        <p>New messages: {messagesSent}</p> {/* Mostrar la cantidad de mensajes enviados */}
        <button className="back-button" onClick={handleGoBack}>Back</button>
      </div>
    </div>
  );
};

export default UserDetail;
