import axiosInstance from '../../../axiosapi/AxiosInstance';

//import modelo
import UserRegisterModel from '../models/UserRegisterModel'


/* FUNCION PARA MANDAR Y OBTENER CREDENCIALES DEL LOGIN */
export const postLogin = async (email, password) => {
  try {
    const response = await axiosInstance.post('/api/Auth/Login', {
      email,
      password,
    });

    //console.log(response.data);
    return response;

  } catch (error) {

    console.error(error);
    return error;

  }
}
export const postLoginDriver = async (correo, password) => {
  try {
    const response = await axiosInstance.post('/api/Conductores/LoginConductor', {
      correo,
      password,
    });

    //console.log(response.data);
    return response;

  } catch (error) {

    console.error(error);
    return error;

  }
}

/* ARMANDO GOMEZ 10/03/2023
FUNCION PARA ENVIAR EL FORMULARIO 
DE REGISTRO DE USUARIO */
export const postRegisterUser = async (UserRegisterModel) => {
  try {
    const response = await axiosInstance.post('/api/Auth/Registro', UserRegisterModel);

    console.log(response.data);
    return response;

  } catch (error) {

    console.error(error);
    return error;
    
  }
}

/* ASI VOY CREANBDO LAS FUNCIONES */
export const getLogin = async () => {
    try {
      const response = await axiosInstance.get('/api/Auth/Login');
      return response.data;
    } catch (error) {
      console.error(error);
    }
  
  };
