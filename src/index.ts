import app from "./app";
import morgan from "morgan";
import { useSwagger } from "./swagger";

app.use(morgan("dev"));
useSwagger(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔌 MediVault Backend running on port ${PORT}`);
});
