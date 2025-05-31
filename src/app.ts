import dotenv from "dotenv";
dotenv.config();
import express from "express";

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import adressRoutes from './routes/adressRoutes';
import localityRoutes from './routes/localityRoutes';
import countryRoutes from './routes/countryRoutes';
import provinceRoutes from './routes/provinceRoutes';
import buyOrderRoutes from './routes/buyOrderRoutes';
import buyOrderDetailRoutes from './routes/buyOrderDetailRoutes';
import productDetailRoutes from './routes/productDetailRoutes';
import imageRoutes from './routes/imageRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import priceRoutes from './routes/priceRoutes';
import discountRoutes from './routes/discountRoutes';

const app = express();

app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/adress', adressRoutes);
app.use('/localities', localityRoutes);
app.use('/countries', countryRoutes);
app.use('/provinces', provinceRoutes);
app.use('/buyOrders', buyOrderRoutes);
app.use('/buyOrderDetails', buyOrderDetailRoutes);
app.use('/productDetails', productDetailRoutes);
app.use('/images', imageRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/prices', priceRoutes);
app.use('/discounts', discountRoutes);

export default app