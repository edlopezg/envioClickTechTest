import React, { useState, useEffect } from 'react';
import './Logout.scss';
import './Filter.scss';
import './Pagination.scss';
import './UserList.scss';
import './ExportStyle.scss';

const MyUserList = ({ onLogout }) => {
  //Manejo de la APi 
  
  const [dataApi, setDataApi] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [nationalityFilter, setNationalityFilter] = useState('');
  const [ageRange, setAgeRange] = useState({ min: 0, max: 100 });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; 
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null); // Estado para el usuario que se eliminará

  //Consumo de la APi
  useEffect(() => {
    fetch('https://randomuser.me/api/?results=80')
      .then((resp) => resp.json())
      .then((respData) => {
        setDataApi(respData.results);
      })
      .catch((error) => {
        console.log('Error en la solicitud de la API', error);
      });
  }, []);

  const handleUserSelected = (user) => {
      setSelectedUsers((prevSelectedUser) => 
      prevSelectedUser.includes(user) ?
      prevSelectedUser.filter((u) => u !== user) :
      [...prevSelectedUser, user]
      );
  };

  const convertToCsv = (users) => {
    const headers = ['Title', 'FirstName' ,'LastName' ,'email'];
    const csvRows = [
      headers.join(','),
      ...users.map((user) =>
      [
        user.name.title,
        user.name.first,
        user.name.last,
        user.email,
      ].join(',')
      ),
    ];
    return csvRows.join('\n')
  };

  const downloadArchiveCsv = (csvContent) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSelectedUsers = () => {
    alert('Exportación de usuarios en proceso...');
    setTimeout(() => {
      const csvContent = convertToCsv(selectedUsers);
      downloadArchiveCsv(csvContent);
      alert('La exportación ha finalizado.');
    }, 2000);
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  // Función para eliminar usuario
  const confirmDeleteUser = (user) => {
    setUserToDelete(user); // Guardar el usuario que queremos eliminar
  };

  const handleDelete = () => {
    setDataApi((prevData) => prevData.filter((user) => user !== userToDelete));
    setUserToDelete(null); // Resetear la confirmación después de eliminar
  };

  const handleCancelDelete = () => {
    setUserToDelete(null); // Cancelar la operación de eliminación
  };

  // Función para filtrar los usuarios
  const filteredUsers = dataApi.filter((user) => {
    const age = user.dob.age;

    return (
      (!genderFilter || user.gender === genderFilter) &&
      (!nationalityFilter || user.nat === nationalityFilter) &&
      age >= ageRange.min &&
      age <= ageRange.max
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <> 
      <div style={{ backgroundColor:'#21233d' }} className="user-list-header">
        <button onClick={onLogout} className="logout-button">Logout</button>
      </div>
      <div style={{ backgroundColor: '#21233d', display: 'flex', justifyContent: 'center', padding: '10px' }}>
      <h1 style={{color:'white', marginRight:'35px' , fontSize:'50px'}}>Welcome to user list</h1>
      </div>

            <div style={{ backgroundColor: '#21233d', display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <button onClick={exportSelectedUsers} disabled={selectedUsers.length === 0} className="button-export-section">Export CSV </button>
        <button onClick={clearSelection} disabled={selectedUsers.length === 0} className="button-export-section">Clean selection</button>
      </div>
        

 

      <div style={{marginTop:'40px'}} className="user-list">
        <div className="filter-controls">
          <div>
            <label>Age range:</label>
            <input
              type="number"
              placeholder="Min"
              value={ageRange.min}
              onChange={(e) => setAgeRange({ ...ageRange, min: parseInt(e.target.value) || 0 })}
            />
            <input
              type="number"
              placeholder="Max"
              value={ageRange.max}
              onChange={(e) => setAgeRange({ ...ageRange, max: parseInt(e.target.value) || 100 })}
            />
          </div>

          <select onChange={(e) => setNationalityFilter(e.target.value)} value={nationalityFilter}>
            <option value="">Seleccionar nacionalidad</option>
            <option value="US">US</option>
            <option value="GB">UK</option>
            <option value="FR">France</option>
            <option value="MX">Mexico</option>
          </select>

          <button onClick={() => setGenderFilter('male')}>Male</button>
          <button onClick={() => setGenderFilter('female')}>Female</button>
          <button onClick={() => setGenderFilter('')}>All users</button>
        </div>
        <div style={{ marginBottom:'40px'}}></div>
        <div className='cards-container' >
          {currentUsers.map((user, index) => (
            <div className='card' key={user.id.value || index}>
              <label className='custom-checkbox'>
                <input
                  type='checkbox'
                  onChange={() => handleUserSelected(user)}
                  checked={selectedUsers.includes(user)}
                />
                <span></span>
              </label>
              <img src={user.picture.medium} alt={`${user.name.first} ${user.name.last}`} className='user-image' />
              <p>Title: {user.name.title}</p>
              <p>First Name: {user.name.first}</p>
              <p>Last Name: {user.name.last}</p>
              <button className="delete-button" onClick={() => confirmDeleteUser(user)}>Delete</button>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {userToDelete && (
        <div className="delete-confirmation-modal">
          <p>Are you sure you want to delete {userToDelete.name.first} {userToDelete.name.last}?</p>
          <button onClick={handleDelete}>Yes, delete</button>
          <button onClick={handleCancelDelete}>Cancel</button>
        </div>
      )}
    </>
  );
};
// se agrega comentario de prueba 
export default MyUserList;
