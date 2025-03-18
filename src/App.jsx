import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

function App() {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // Imágenes de portada para el carrusel
  const portadas = ["/geronimo.jpg", "/geronimo2.jpg" , "/geronimo3.jpg", "/geronimo4.jpg", "/geronimo5.jpg" ,];

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validar tipo de archivo
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Solo puedes subir imágenes (JPG, PNG, JPEG).");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => setPreview(reader.result);
  }

  function subirImagen() {
    if (!file) {
      toast.warn("Selecciona una imagen primero.");
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      var rawLog = reader.result.split(",")[1];
      var dataSend = {
        dataReq: { data: rawLog, name: file.name, type: file.type },
        fname: "uploadFilesToGoogleDrive",
      };

      fetch(
        "https://script.google.com/macros/s/AKfycbxl-GLIcFbVI728JiPjj_inkPAMsVYAkzbgxtam78D7do9j5VUDaZ8HB0SMNqGRVqdCUg/exec",
        { method: "POST", body: JSON.stringify(dataSend) }
      )
        .then((res) => res.json())
        .then(() => {
          toast.success("🎉 Imagen subida con éxito!");
          setPreview(null);
          setFile(null);
        })
        .catch((e) => {
          toast.error("🚨 Error al subir la imagen.");
          console.log(e);
        });
    };
  }

  // Configuración del carrusel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="container">
      {/* Carrusel de imágenes */}
      <Slider {...sliderSettings} className="slider">
        {portadas.map((url, index) => (
          <div key={index} className="slide">
            <img src={url} alt={`Portada ${index + 1}`} className="slider-image" />
          </div>
        ))}
      </Slider>

      <div className="card">
        <h2>🎉 Mis 18 🎉</h2>
        <p>Sube tu foto y sé parte del evento</p>

        <label className="file-input-label">
          Seleccionar Imagen
          <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
        </label>

        {preview && (
          <div className="preview-container">
            <img src={preview} alt="Vista previa" className="preview-image" />
            <button className="upload-button" onClick={subirImagen}>
              📤 Subir Imagen
            </button>
          </div>
        )}
      </div>

      {/* Notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
