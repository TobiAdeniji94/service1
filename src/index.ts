import app from './app';
import swaggerDocs from './utils/swagger';


const PORT = parseInt(process.env.PORT as string, 10) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  swaggerDocs(app, PORT)
});
