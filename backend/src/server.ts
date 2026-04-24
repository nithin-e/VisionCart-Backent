import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import collectionRoutes from './routes/collection.routes.js';
import bannerRoutes from './routes/banner.routes.js';
import storeRoutes from './routes/store.routes.js';
import userRoutes from './routes/user.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import tryAtHomeRoutes from './routes/tryAtHome.routes.js';
import reviewRoutes from './routes/review.routes.js';
import blogRoutes from './routes/blog.routes.js';
import franchiseRoutes from './routes/franchise.routes.js';
import contactRoutes from './routes/contact.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import reportRoutes from './routes/report.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import adminAuthRoutes from './routes/adminAuth.routes.js';
import brandRoutes from './routes/brand.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', collectionRoutes);
app.use('/api', bannerRoutes);
app.use('/api', storeRoutes);
app.use('/api', userRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);
app.use('/api', inventoryRoutes);
app.use('/api', couponRoutes);
app.use('/api', tryAtHomeRoutes);
app.use('/api', reviewRoutes);
app.use('/api', blogRoutes);
app.use('/api', franchiseRoutes);
app.use('/api', contactRoutes);
app.use('/api', notificationRoutes);
app.use('/api', reportRoutes);
app.use('/api', settingsRoutes);
app.use('/api', brandRoutes);
app.use('/api/admin', adminAuthRoutes);


app.use(errorMiddleware);

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();