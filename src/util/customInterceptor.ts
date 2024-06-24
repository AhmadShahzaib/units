import axios from 'axios';
const axiosCall = async (data) => {
  try {

  } catch (err) {
    console.log(err);
  }
};

const logData = async (req, data) => {
 
  let params;
  if (Object.keys(req.params).length !== 0) {
    params = req.params;
  } else if (Object.keys(req.query).length !== 0) {
    params = req.query;
  } else if (Object.keys(req.body).length !== 0) {
    params = req.body;
  }
  const dataForAxios = {
    param: params,
    method: req.method,
    originalURL: req.originalUrl,
    port: process.env.PORT,
    server: process.env.SERVICE_BASE_URL,
    serviceName: process.env.MICROSERVICE_NAME,
    header: req.headers,
    response: JSON.stringify(data),
  };
 
};

export const CustomInterceptor = (req, res, next) => {
  const oldSend = res.send;
 
  // if (next)
  next();
};
