import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./Logout.scss";
import "./Filter.scss";
import "./Pagination.scss";
import "./UserList.scss";
import "./ExportStyle.scss";
import "./SendMessage.scss";
import "./PushNotificationDelete.scss";

const MyUserList = ({ onLogout }) => {
  // Estado para el consumo de la APi
  const [dataApi, setDataApi] = useState([]);
  // useState para manejar el estado de los filtros 
  const [genderFilter, setGenderFilter] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");
  const [ageRange, setAgeRange] = useState({ min: 0, max: 100 });
  //useState para manejar el estado de la paginacion
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageData, setMessageData] = useState({ name: "", message: "" });
  const [messagesSent, setMessagesSent] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const [setExportStatus] = useState("");
  const usersPerPage = 12;

  // Consumo de la API
  useEffect(() => {
    fetch("https://randomuser.me/api/?results=80")
      .then((resp) => resp.json())
      .then((respData) => {
        setDataApi(respData.results);
      })
      .catch((error) => {
        console.log("Error en la solicitud de la API", error);
      });
  }, []);



  //Funciones para manejar el apartado del envio de mensaje al usuario
  const handleSendMessage = (user) => {
    setCurrentUser(user);
    localStorage.setItem(`user_${user.id.value}`, JSON.stringify(user));
    setShowMessageForm(true);
  };

  const handleMessageChange = (e) => {
    const { name, value } = e.target;
    setMessageData({ ...messageData, [name]: value });
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (currentUser) {
      setMessagesSent((prevMessages) => ({
        ...prevMessages,
        [currentUser.id.value]: (prevMessages[currentUser.id.value] || 0) + 1,
      }));
    }
    alert(
      `Message sent to : ${currentUser.name.first}: ${messageData.message}`
    );
    setShowMessageForm(false);
    setMessageData({ name: "", message: "" });
  };

  // Funciones para filtrar usuarios
  const filteredUsers = dataApi.filter((user) => {
    const age = user.dob.age;
    return (
      (!genderFilter || user.gender === genderFilter) &&
      (!nationalityFilter || user.nat === nationalityFilter) &&
      age >= ageRange.min &&
      age <= ageRange.max
    );
  });

  // Apartado para el manejo de la paginacion
  const indexOfLastUser = currentPage * usersPerPage; // = 1 * 12 = 12
  const indexOfFirstUser = indexOfLastUser - usersPerPage; // 12 - 12 = 0
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Funciones para implementar la eliminacion de los usuarios
  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
  };

  const handleDelete = () => {
    setDataApi((prevUsers) =>
      prevUsers.filter((user) => user !== userToDelete)
    );
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((user) => user !== userToDelete)
    );
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
  };

  // Funciones para convertir los datos a csv, hacer la operacion asincrona
  // Exportar usuarios seleccionados a CSV
  const exportSelectedUsers = async () => {
    try {
      // Mostrar que la operación está en proceso
      setIsExporting(true);
      setExportStatus("Exporting...");

      // Simulamos una pequeña demora para imitar una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Crear los datos CSV
      const csvData = selectedUsers.map((user) => {
        return {
          Name: `${user.name.first} ${user.name.last}`,
          Email: user.email,
          Gender: user.gender,
          Nationality: user.nat,
        };
      });
// Aqui se define la estructura que va a llevar el CSV
      const csvContent = [
        ["Name", "Email", "Gender", "Nationality"],
        ...csvData.map((user) => [
          user.Name,
          user.Email,
          user.Gender,
          user.Nationality,
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

      // Crear y descargar  el archivo Blob
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "selected_users.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Actualizar el estado después de la exportación
      setExportStatus("Export completed successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      setExportStatus("Export failed. Please try again.");
    } finally {
      // Desactivar el estado de exportación en proceso
      setIsExporting(false);
    }
  };

    // Manejo de selección de usuarios
  const handleUserSelected = (user) => {
    setSelectedUsers((prevSelectedUser) =>
      prevSelectedUser.includes(user)
        ? prevSelectedUser.filter((u) => u !== user)
        : [...prevSelectedUser, user]
    );
  };

  // Funcion par limpiar las casillas en caso de que el usuario asi lo requiera
  const clearSelection = () => {
    setSelectedUsers([]);
  };

  return (
    <>
      <div style={{ backgroundColor: "#21233d" }} className="user-list-header">
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div
        style={{
          backgroundColor: "#21233d",
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <h1 style={{ color: "white", marginRight: "35px", fontSize: "50px" }}>
          Welcome to user list
        </h1>
      </div>

      <div
        style={{
          backgroundColor: "#21233d",
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <div>
          <button
            onClick={exportSelectedUsers}
            disabled={isExporting}
            className={`button-export-section ${
              isExporting ? "exporting" : ""
            }`}
          >
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
        <button
          onClick={clearSelection}
          disabled={selectedUsers.length === 0}
          className="button-export-section"
        >
          Clean select
        </button>
      </div>

      <div style={{ marginTop: "40px" }} className="user-list">
        <div className="filter-controls">
          <div>
            <label>Age range:</label>
            <input
              type="number"
              placeholder="Min"
              value={ageRange.min}
              onChange={(e) =>
                setAgeRange({ ...ageRange, min: parseInt(e.target.value) || 0 })
              }
            />
            <input
              type="number"
              placeholder="Max"
              value={ageRange.max}
              onChange={(e) =>
                setAgeRange({
                  ...ageRange,
                  max: parseInt(e.target.value) || 100,
                })
              }
            />
          </div>

          <select
            onChange={(e) => setNationalityFilter(e.target.value)}
            value={nationalityFilter}
          >
            <option value="">Seleccionar nacionalidad</option>
            <option value="US">US</option>
            <option value="GB">UK</option>
            <option value="FR">France</option>
            <option value="MX">Mexico</option>
          </select>

          <button onClick={() => setGenderFilter("male")}>Male</button>
          <button onClick={() => setGenderFilter("female")}>Female</button>
          <button onClick={() => setGenderFilter("")}>All users</button>
        </div>

        <div style={{ marginBottom: "40px" }}></div>
        <div className="cards-container">
          {currentUsers.map((user, index) => (
            <div className="card" key={user.id.value || index}>
              <label className="custom-checkbox">
                <input
                  type="checkbox"
                  onChange={() => handleUserSelected(user)}
                  checked={selectedUsers.includes(user)}
                />
                <span></span>
              </label>
              <img
                src={user.picture.medium}
                alt={`${user.name.first} ${user.name.last}`}
                className="user-image"
              />
              <p>Title: {user.name.title}</p>
              <p>First Name: {user.name.first}</p>
              <p>Last Name: {user.name.last}</p>
              <button
                className="delete-button"
                onClick={() => confirmDeleteUser(user)}
              >
                Delete
              </button>
              {userToDelete && (
                <div
                  className={`push-notification ${userToDelete ? "show" : ""}`}
                >
                  <p>
                    Are you sure you want to delete {userToDelete?.name?.first}?
                  </p>
                  <div>
                    <button onClick={handleDelete}>Yes, delete</button>
                    <button onClick={handleCancelDelete}>Cancel</button>
                  </div>
                </div>
              )}
              <Link
                to={`/users/${user.id.value}`}
                className="view-details-link"
                onClick={() => handleSendMessage(user)}
                state={{ messagesSent: messagesSent[user.id.value] || 0 }} // Pasar el conteo de mensajes enviados
              >
                Show Details{" "}
                {messagesSent[user.id.value] > 0 &&
                  `(${messagesSent[user.id.value]})`}{" "}
              </Link>
              <div style={{ marginTop: "15px" }}></div>
              <button
                className="send-message-button"
                onClick={() => handleSendMessage(user)}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          ))}
        </div>

        {showMessageForm && currentUser && (
          <div className="message-form">
            <h2>Send Message to {currentUser.name.first}</h2>
            <form onSubmit={handleSubmitMessage}>
              <input
                type="text"
                name="message"
                value={messageData.message}
                onChange={handleMessageChange}
                placeholder="Your message"
                required
              />
              <button type="submit">Send</button>
              <button type="button" onClick={() => setShowMessageForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default MyUserList;
